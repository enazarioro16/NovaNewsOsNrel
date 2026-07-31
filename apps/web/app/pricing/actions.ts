'use server'

import { auth } from '../../../auth';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { db, users } from '@novanews/database';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2024-04-10',
});

// ID del Precio de la suscripción PRO configurada en Stripe Dashboard
const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || 'price_mock_pro';

export async function createCheckoutSession() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Verificar si el usuario ya tiene un customer ID en DB
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  
  if (user?.isPro) {
    return redirect('/pricing/portal');
  }

  let customerId = user?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email!,
      name: session.user.name!,
    });
    customerId = customer.id;
    // Guardar el customer ID en DB
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, session.user.id));
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    client_reference_id: session.user.id, // VITAL: Para el webhook
    payment_method_types: ['card'],
    line_items: [
      {
        price: PRO_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  } else {
    throw new Error('Error al crear la sesión de checkout');
  }
}

export async function createCustomerPortalSession() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect('/login');
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  
  if (!user?.stripeCustomerId) {
    throw new Error('No Stripe Customer ID found');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
  });

  redirect(portalSession.url);
}
