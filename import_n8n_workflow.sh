#!/bin/bash
set -e

echo "[NovaNews] Importando Workflow a n8n..."
# Copiamos el JSON al contenedor
docker cp n8n/workflows/001_ingestion_pipeline.json novanews_n8n_prod:/tmp/001_ingestion_pipeline.json

# Importamos usando el CLI de n8n
docker exec novanews_n8n_prod n8n import:workflow --input=/tmp/001_ingestion_pipeline.json

echo "[NovaNews] ¡Workflow importado con éxito!"
