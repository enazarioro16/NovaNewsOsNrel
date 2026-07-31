import { Injectable, Logger } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { db, newsTable } from '@novanews/database';
import { eq } from 'drizzle-orm';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

export interface RawArticle {
  originalUrl: string;
  source: string;
  title: string;
  content: string;
  qualityScore: number;
}

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);

  constructor(
    private readonly aiService: AIService,
    @InjectMetric('articles_ingested_total') private readonly ingestedCounter: Counter<string>
  ) {}

  /**
   * News Intelligence Pipeline Orchestrator
   */
  async startPipeline(raw: RawArticle) {
    this.logger.log(`[PIPELINE START] Procesando: ${raw.title}`);
    this.ingestedCounter.inc();

    let featuredImage: string | null = null;
    try {
      this.logger.log(`[PIPELINE] Extrayendo imagen (og:image) de ${raw.originalUrl}`);
      const res = await fetch(raw.originalUrl, { signal: AbortSignal.timeout(5000) });
      const html = await res.text();
      const match = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) || 
                    html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
      if (match && match[1]) featuredImage = match[1];
    } catch (err) {
      this.logger.warn(`[PIPELINE] No se pudo extraer la imagen: ${err}`);
    }

    // 1. Ingesta & Normalización (Guardar crudo)
    const [inserted] = await db.insert(newsTable).values({
      originalUrl: raw.originalUrl,
      source: raw.source,
      title: raw.title,
      content: raw.content,
      qualityScore: raw.qualityScore,
      featuredImage: featuredImage,
      pipelineStatus: 'INGESTED'
    }).returning();

    this.logger.log(`[PIPELINE] ID Asignado: ${inserted.id}`);

    // 2. Procesamiento Inteligente (AI)
    const aiResult = await this.aiService.processArticle(raw.title, raw.content);

    // 3. Actualización y pase a Revisión Editorial
    await db.update(newsTable).set({
      summary: aiResult.summary,
      seoTitle: aiResult.seoTitle,
      seoDescription: aiResult.seoDescription,
      tags: aiResult.tags,
      semanticEmbedding: aiResult.semanticEmbedding,
      pipelineStatus: 'REVIEW_PENDING'
    }).where(eq(newsTable.id, inserted.id));

    this.logger.log(`[PIPELINE END] ${inserted.id} -> REVIEW_PENDING`);
  }
}
