import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './identity.guard';

@Module({
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class IdentityModule {}
