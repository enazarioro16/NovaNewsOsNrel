import { Module } from '@nestjs/common';
import { EditorialController } from './editorial/editorial.controller';
import { IngestionService } from './content/ingestion.service';
import { PipelineService } from './content/pipeline.service';
import { AIService } from './ai/ai.service';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { IdentityModule } from './identity/identity.module';
import { AutomationService } from './content/automation.service';
import { DistributionModule } from './distribution/distribution.module';

@Module({
  imports: [IntelligenceModule, IdentityModule, DistributionModule],
  controllers: [EditorialController],
  providers: [IngestionService, PipelineService, AIService, AutomationService],
})
export class NovaNewsDomainsModule {}
