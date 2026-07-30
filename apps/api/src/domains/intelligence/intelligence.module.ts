import { Module } from '@nestjs/common';
import { SourceManager } from './source.manager';
import { DeduplicationEngine } from './deduplication.engine';
import { ScoringEngine } from './scoring.engine';

@Module({
  providers: [SourceManager, DeduplicationEngine, ScoringEngine],
  exports: [SourceManager, DeduplicationEngine, ScoringEngine],
})
export class IntelligenceModule {}
