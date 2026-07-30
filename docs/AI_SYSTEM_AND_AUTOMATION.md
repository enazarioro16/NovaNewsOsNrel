# Sistema Multiagente de IA y Automatizaciones

## 1. Arquitectura Multiagente

El sistema interno (Consejo AI) y el sistema de producto (Procesamiento de Noticias) se comportan como redes de agentes.

**¿Quién coordina?**
El orquestador principal (Workflow Manager, basado en LangChain/LangGraph) coordina el flujo de producto. En el Consejo, el Scrum Master AI orquesta las interacciones de desarrollo.

**¿Cómo se comunican?**
Mediante un bus de eventos en memoria (In-Memory Event Bus). Un agente emite un resultado que dispara el inicio de otro agente.

**¿Cómo comparten memoria?**
Memoria a Corto Plazo: Contexto del evento actual (Payload JSON).
Memoria a Largo Plazo: Base de datos vectorial (Chroma/Pinecone) para recordar decisiones pasadas o contextos editoriales.

**¿Cómo toman decisiones y resuelven conflictos?**
Mecanismo de "Majority Voting" o "Delegación de Autoridad". Si el _Editor AI_ y el _Research AI_ tienen un conflicto de confianza sobre un artículo, este se marca para _Human-in-the-Loop_ o revisión del CEO AI (política).

## 2. Automatizaciones de Producto (Flujos Lógicos)

_No hay código implementado, solo diseño de flujos._

### Automatización Editorial (Ingesta -> Publicación)

1. CRON (Scheduler) dispara el Worker de Ingesta.
2. Extrae HTML crudo y lo sanitiza.
3. Pasa el texto a _Research AI_ para extracción de entidades clave (NER).
4. Pasa a _Editor AI_ para reescribir con estilo neutro (Bias-free).
5. Pasa a _SEO AI_ para generar slugs, meta descripciones y H1 optimizados.
6. Guardado en DB (Status: Published).

### Automatización Social Media

1. Escucha evento `ArticlePublished`.
2. Llama a _Social Media AI_ para generar 1 hilo de Twitter, 1 post de LinkedIn.
3. Añade a la cola de RabbitMQ/EventBus para publicación programada según horarios pico.

### Automatización Analytics

1. CRON nocturno consolida datos de interacciones (`Interaction`).
2. Recalcula embeddings de preferencias de usuarios.
3. Actualiza la caché de Redis con los nuevos feeds pre-calculados.

### Automatización DevOps / Alertas

1. Prometheus detecta latencia > 500ms o Error 5xx.
2. Alerta a _DevOps AI_ (vía webhook interno).
3. DevOps AI revisa logs y decide escalar horizontalmente los contenedores, o deshacer el último despliegue (Rollback automático).
