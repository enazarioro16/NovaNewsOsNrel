CREATE TABLE IF NOT EXISTS "user_bookmark" (
	"userId" text NOT NULL,
	"newsId" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_bookmark_userId_newsId_pk" PRIMARY KEY("userId","newsId")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "preferences" jsonb;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_bookmark" ADD CONSTRAINT "user_bookmark_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_bookmark" ADD CONSTRAINT "user_bookmark_newsId_news_id_fk" FOREIGN KEY ("newsId") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
