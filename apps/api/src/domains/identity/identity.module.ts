import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './identity.guard';
import { StripeWebhookController } from './stripe.controller';

@Module({
  controllers: [StripeWebhookController],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class IdentityModule {}
