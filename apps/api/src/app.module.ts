import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NovaNewsDomainsModule } from './domains/domains.module';
// Importamos el módulo legacy para que compile lo anterior si es necesario, pero nos enfocaremos en Domains
import { NewsModule } from './modules/news/news.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrometheusModule.register(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
    ScheduleModule.forRoot(),
    NovaNewsDomainsModule,
    NewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
