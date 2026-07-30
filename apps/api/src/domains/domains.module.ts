import { Module } from '@nestjs/common';
import { EditorialController } from './editorial/editorial.controller';
import { IngestionService } from './content/ingestion.service';
import { PipelineService } from './content/pipeline.service';
import { AIService } from './ai/ai.service';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { IdentityModule } from './identity/identity.module';
import { AutomationService } from './content/automation.service';
import { DistributionModule } from './distribution/distribution.module';
import { ResearchAgent } from './ai/agents/research.agent';
import { EditorAgent } from './ai/agents/editor.agent';
import { SeoAgent } from './ai/agents/seo.agent';

@Module({
  imports: [IntelligenceModule, IdentityModule, DistributionModule],
  controllers: [EditorialController],
  providers: [
    IngestionService, 
    PipelineService, 
    AIService, 
    AutomationService,
    ResearchAgent,
    EditorAgent,
    SeoAgent
  ],
})
export class NovaNewsDomainsModule {}
