import { Injectable, Logger } from '@nestjs/common';
import { PipelineService } from './pipeline.service';
import { SourceManager } from '../intelligence/source.manager';
import { DeduplicationEngine } from '../intelligence/deduplication.engine';
import { ScoringEngine } from '../intelligence/scoring.engine';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly pipelineService: PipelineService,
    private readonly sourceManager: SourceManager,
    private readonly deduplicationEngine: DeduplicationEngine,
    private readonly scoringEngine: ScoringEngine,
  ) {}

  async ingestMockSource() {
    this.logger.log('--- STARTING SOURCE INTELLIGENCE ENGINE ---');
    
    // 1. Registro y Evaluación de Fuente
    const source = await this.sourceManager.registerMockSource();
    this.logger.log(`Fuente validada: ${source.name} | Reputación: ${source.credibilityScore}`);

    const mockArticles = [
      {
        originalUrl: 'https://news.ycombinator.com/item?id=99991',
        title: 'OpenAI releases new advanced model for developers',
        content: 'OpenAI has officially launched its newest iteration of the GPT model...'
      },
      {
        originalUrl: 'https://news.ycombinator.com/item?id=99992',
        title: 'Rust reaches 1.80 with new async traits',
        content: 'The Rust core team has finalized the integration of async traits...'
      },
      { // Duplicado intencional
        originalUrl: 'https://news.ycombinator.com/item?id=99991',
        title: 'OpenAI releases new advanced model for developers',
        content: 'OpenAI has officially launched its newest iteration of the GPT model...'
      }
    ];

    let ingestedCount = 0;

    for (const raw of mockArticles) {
      // 2. Deduplicación
      const isDupe = await this.deduplicationEngine.isDuplicate(raw.title, raw.originalUrl, raw.content);
      if (isDupe) {
        this.logger.warn(`Descartado por deduplicación: ${raw.title}`);
        continue;
      }

      // 3. Quality Scoring
      const score = this.scoringEngine.calculateScore(source, {
        credibility: source.credibilityScore || 0,
        recencyHours: 1,
        wordCount: 150,
        isTrending: true
      });
      
      this.logger.log(`Artículo [${raw.title}] recibió Score de Calidad: ${score}/100`);

      // 4. Umbral de Aceptación (Filter)
      if (score < 50) {
        this.logger.warn(`Descartado por bajo Content Score: ${raw.title}`);
        continue;
      }

      // 5. Enviar al News Intelligence Pipeline
      await this.pipelineService.startPipeline({
        originalUrl: raw.originalUrl,
        source: source.name,
        title: raw.title,
        content: raw.content,
        qualityScore: score
      });
      ingestedCount++;
      
      // Delay to avoid hitting the 15 RPM free tier limit (wait 12 seconds between articles)
      if (ingestedCount < mockArticles.length) {
        this.logger.log(`[Throttling] Esperando 12s antes del siguiente artículo...`);
        await sleep(12000);
      }
    }

    return { ingested: ingestedCount };
  }

  async ingestBatch(source: any, rawArticles: { title: string, content: string, originalUrl: string }[]) {
    this.logger.log(`--- INGESTING BATCH FROM ${source.name} ---`);
    let ingestedCount = 0;

    for (const raw of rawArticles) {
      // 1. Deduplicación
      const isDupe = await this.deduplicationEngine.isDuplicate(raw.title, raw.originalUrl, raw.content);
      if (isDupe) {
        this.logger.debug(`Descartado por deduplicación: ${raw.title}`);
        continue;
      }

      // 2. Quality Scoring
      const score = this.scoringEngine.calculateScore(source, {
        credibility: source.credibilityScore || 0,
        recencyHours: 1,
        wordCount: 150,
        isTrending: true
      });
      
      if (score < 50) {
        this.logger.warn(`Descartado por bajo Score: ${raw.title}`);
        continue;
      }

      // 3. Enviar al Pipeline
      await this.pipelineService.startPipeline({
        originalUrl: raw.originalUrl,
        source: source.name,
        title: raw.title,
        content: raw.content,
        qualityScore: score
      });
      ingestedCount++;
      
      // Delay to avoid hitting the 15 RPM free tier limit (wait 12 seconds between articles)
      if (ingestedCount < rawArticles.length) {
        this.logger.log(`[Throttling] Esperando 12s antes del siguiente artículo...`);
        await sleep(12000);
      }
    }
    
    this.logger.log(`Batch completado. Insertados: ${ingestedCount}/${rawArticles.length}`);
  }
}
