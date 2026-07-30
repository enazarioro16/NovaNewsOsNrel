import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IngestionService } from './ingestion.service';
import { db, sourceTable } from '@novanews/database';
import { eq } from 'drizzle-orm';
import Parser from 'rss-parser';

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);
  private readonly rssParser = new Parser();

  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * Heartbeat autónomo del sistema.
   * Se ejecuta cada 30 minutos. Para pruebas locales, también se puede configurar más rápido.
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async pollSources() {
    this.logger.log('Wake up: Iniciando ciclo autónomo de Ingesta (Polling RSS)...');

    try {
      // 1. Extraer fuentes activas
      const activeSources = await db.select().from(sourceTable).where(eq(sourceTable.status, 'ACTIVE'));
      this.logger.log(`Fuentes activas encontradas: ${activeSources.length}`);

      for (const source of activeSources) {
        if (!source.url) continue;
        
        this.logger.log(`Leyendo RSS de [${source.name}]: ${source.url}`);
        
        try {
          const feed = await this.rssParser.parseURL(source.url);
          
          // Procesamiento en lotes para evitar Rate Limits (Max 5 por ciclo por fuente)
          const latestItems = feed.items.slice(0, 5);
          
          const rawPayloads = latestItems.map(item => ({
            sourceId: source.id,
            title: item.title || 'Sin Título',
            content: (item.contentSnippet || item.content || item.summary || 'Sin contenido').substring(0, 1000),
            originalUrl: item.link || 'unknown'
          }));

          // Delegar al Ingestion Service
          await this.ingestionService.ingestBatch(source, rawPayloads);
          
        } catch (sourceError) {
          // Si una fuente falla (Timeout, error parseo), no detener las demás
          this.logger.error(`Error leyendo fuente ${source.name}: ${sourceError}`);
        }
      }

      this.logger.log('Ciclo autónomo completado.');
    } catch (error) {
      this.logger.error(`Falla general en AutomationService: ${error}`);
    }
  }
}
