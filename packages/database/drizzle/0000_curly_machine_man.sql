CREATE TABLE IF NOT EXISTS "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_url" text,
	"source" text,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"seo_title" text,
	"seo_description" text,
	"tags" jsonb,
	"pipeline_status" text DEFAULT 'INGESTED' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
