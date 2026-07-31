import { Module } from '@nestjs/common';
import { EditorialController } from './editorial/editorial.controller';
import { IngestionService } from './content/ingestion.service';
import { PipelineService } from './content/pipeline.service';
import { TTSService } from './content/tts.service';
import { AIService } from './ai/ai.service';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { IdentityModule } from './identity/identity.module';
import { AutomationService } from './content/automation.service';
import { DistributionModule } from './distribution/distribution.module';
import { ResearchAgent } from './ai/agents/research.agent';
import { EditorAgent } from './ai/agents/editor.agent';
import { SeoAgent } from './ai/agents/seo.agent';
import { FactCheckerAgent } from './ai/agents/fact-checker.agent';
import { IngestionController } from './content/ingestion.controller';
import { domainMetricProviders } from './metrics.providers';

@Module({
  imports: [IntelligenceModule, IdentityModule, DistributionModule],
  controllers: [EditorialController, IngestionController],
  providers: [
    IngestionService, 
    PipelineService, 
    TTSService,
    AIService, 
    AutomationService,
    ResearchAgent,
    EditorAgent,
    SeoAgent,
    FactCheckerAgent,
    ...domainMetricProviders
  ],
})
export class NovaNewsDomainsModule {}
