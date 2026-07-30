CREATE TABLE IF NOT EXISTS "source" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"language" text DEFAULT 'es' NOT NULL,
	"country" text DEFAULT 'GLOBAL' NOT NULL,
	"category" text NOT NULL,
	"frequency_min" integer DEFAULT 60,
	"credibility_score" integer DEFAULT 50,
	"priority" integer DEFAULT 3,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"health" integer DEFAULT 100,
	"avg_response_time_ms" integer DEFAULT 0,
	"last_sync_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "quality_score" integer DEFAULT 0;