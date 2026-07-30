import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

export const sourceTable = pgTable('source', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  url: text('url'), // RSS or API URL
  type: text('type').notNull(), // RSS, SCRAPER, API
  language: text('language').notNull().default('es'),
  country: text('country').notNull().default('GLOBAL'),
  category: text('category').notNull(),
  frequencyMin: integer('frequency_min').default(60),
  credibilityScore: integer('credibility_score').default(50), // 0-100
  priority: integer('priority').default(3), // 1 (High) - 5 (Low)
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, PAUSED, ERROR
  health: integer('health').default(100), // 0-100
  avgResponseTimeMs: integer('avg_response_time_ms').default(0),
  lastSyncAt: timestamp('last_sync_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type SourceInsert = typeof sourceTable.$inferInsert;
export type SourceSelect = typeof sourceTable.$inferSelect;
