import { makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

export const aiGenerationLatency = makeHistogramProvider({
  name: 'ai_generation_duration_seconds',
  help: 'Latency of Gemini AI article generation',
  buckets: [1, 2, 5, 10, 20, 30, 60] // en segundos
});

export const articlesIngestedTotal = makeCounterProvider({
  name: 'articles_ingested_total',
  help: 'Total number of raw articles ingested',
});

export const editorialApprovalsTotal = makeCounterProvider({
  name: 'editorial_approvals_total',
  help: 'Total number of articles approved by the editor',
});

export const webhookDistributionErrors = makeCounterProvider({
  name: 'webhook_distribution_errors',
  help: 'Total number of failed webhook distributions',
});

export const domainMetricProviders = [
  aiGenerationLatency,
  articlesIngestedTotal,
  editorialApprovalsTotal,
  webhookDistributionErrors
];
