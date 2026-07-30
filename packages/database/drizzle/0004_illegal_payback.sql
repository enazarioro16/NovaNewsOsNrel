CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE "news" ADD COLUMN "semantic_embedding" "vector(768)";