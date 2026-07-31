import { pgTable, text, timestamp, uuid, jsonb, integer, customType } from 'drizzle-orm/pg-core';

const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(768)';
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`;
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

export const newsTable = pgTable('news', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').unique(),
  source: text('source'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  summary: text('summary'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  featuredImage: text('featured_image'),
  tags: jsonb('tags').$type<string[]>(),
  semanticEmbedding: vector('semantic_embedding'),
  qualityScore: integer('quality_score').default(0),
  socialScript: jsonb('social_script'), // ShortVideoScript for social media distribution
  pipelineStatus: text('pipeline_status').notNull().default('INGESTED'), // INGESTED, PROCESSED, REVIEW_PENDING, APPROVED, PUBLISHED, REJECTED
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type NewsInsert = typeof newsTable.$inferInsert;
export type NewsSelect = typeof newsTable.$inferSelect;
