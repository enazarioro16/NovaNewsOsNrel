import { Controller, Post, Req, Headers, BadRequestException, Logger } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { db, users } from '@novanews/database';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2024-04-10',
});

@Controller('webhook/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    // NestJS por defecto parsea el JSON, pero Stripe requiere el body crudo (raw body) para verificar la firma.
    // Para simplificar en este entorno (si el raw body no está configurado), si no hay STRIPE_WEBHOOK_SECRET, 
    // confiamos en el body parseado (solo para desarrollo/mock). En prod, se debe usar raw body.
    try {
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        // En una app NestJS real, se debe configurar raw-body middleware para esta ruta
        // req.rawBody debe estar disponible. Asumimos que lo está, o usamos un mock.
        event = stripe.webhooks.constructEvent(
          (req as any).rawBody || JSON.stringify(req.body),
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } else {
        event = req.body as Stripe.Event;
      }
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`Received Stripe event: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          
          if (session.client_reference_id) {
            // client_reference_id guarda el ID del usuario en nuestra DB
            await db.update(users).set({
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              isPro: true
            }).where(eq(users.id, session.client_reference_id));
            this.logger.log(`Usuario ${session.client_reference_id} actualizado a PRO.`);
          }
          break;
        }

        case 'customer.subscription.deleted':
        case 'customer.subscription.canceled': {
          const subscription = event.data.object as Stripe.Subscription;
          // Si la suscripción se cancela, quitamos el status PRO
          await db.update(users).set({
            isPro: false
          }).where(eq(users.stripeSubscriptionId, subscription.id));
          this.logger.log(`Suscripción ${subscription.id} cancelada. Status PRO removido.`);
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          // Validar el estatus
          const isPro = subscription.status === 'active' || subscription.status === 'trialing';
          await db.update(users).set({
            isPro: isPro,
            stripePriceId: subscription.items.data[0].price.id
          }).where(eq(users.stripeSubscriptionId, subscription.id));
          this.logger.log(`Suscripción ${subscription.id} actualizada. isPro: ${isPro}`);
          break;
        }

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error procesando evento ${event.type}: ${error}`);
      throw new BadRequestException('Error interno al actualizar base de datos');
    }

    return { received: true };
  }
}
