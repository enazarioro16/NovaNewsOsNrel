import { Injectable, Logger } from '@nestjs/common';
import { AIService } from '../ai/ai.service';
import { db, newsTable } from '@novanews/database';
import { eq } from 'drizzle-orm';

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

  constructor(private readonly aiService: AIService) {}

  /**
   * News Intelligence Pipeline Orchestrator
   */
  async startPipeline(raw: RawArticle) {
    this.logger.log(`[PIPELINE START] Procesando: ${raw.title}`);

    // 1. Ingesta & Normalización (Guardar crudo)
    const [inserted] = await db.insert(newsTable).values({
      originalUrl: raw.originalUrl,
      source: raw.source,
      title: raw.title,
      content: raw.content,
      qualityScore: raw.qualityScore,
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
