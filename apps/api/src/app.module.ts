import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NovaNewsDomainsModule } from './domains/domains.module';
// Importamos el módulo legacy para que compile lo anterior si es necesario, pero nos enfocaremos en Domains
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NovaNewsDomainsModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
