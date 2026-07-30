# ADR-0008: Automation and Scheduler Engine

## Estado
**Aprobado**

## Contexto
En el Sprint 11, el News Intelligence Pipeline necesita autonomía. El sistema debe poder consultar automáticamente fuentes de información externas (RSS) a intervalos regulares (Polling) sin requerir llamadas REST externas. Tuvimos que decidir si utilizar una herramienta de orquestación externa (como n8n, Temporal, o Trigger.dev) o una solución interna para el MVP.

## Decisiones

### 1. Motor de Scheduling: `@nestjs/schedule` (Cron)
**Alternativas consideradas:** n8n, Temporal, BullMQ, Trigger.dev.
**Decisión:** Utilizar el módulo nativo `@nestjs/schedule` dentro del monolito `apps/api`.
**Justificación:** El objetivo principal del MVP es validar el flujo End-to-End manteniendo la simplicidad operativa ("Menos piezas móviles"). Integrar un orquestador externo como Temporal introduce complejidades de infraestructura (despliegue de workers, persistencia de estado externa) que no están justificadas en esta fase temprana donde solo necesitamos un "latido" periódico para extraer feeds RSS.

### 2. Procesamiento por Lotes (Batching) y Manejo de Errores
**Decisión:** El Cron job ejecutará extracciones cada 30 minutos, limitando el procesamiento de las noticias nuevas a pequeños lotes (Batches) y protegiendo cada llamada con un bloque `try/catch` robusto a nivel de artículo.
**Justificación:** Dado que cada artículo nuevo dispara llamadas al proveedor de LLM (Gemini) para extraer resúmenes y embeddings, una falla en red o en cuota del proveedor no debe detener el Job completo. El procesamiento en lotes mitiga el riesgo de alcanzar límites de cuota (Rate Limits) abruptamente.

## Consecuencias
- **Positivas:** Reducción dramática del costo operativo. El equipo de desarrollo no necesita levantar contenedores adicionales; el servidor API NestJS actúa como su propio motor autónomo.
- **Negativas:** La persistencia de estado de las tareas fallidas no es tan robusta como en Temporal. Si el pod/instancia de NestJS se reinicia en medio de un Cron Job, la ejecución actual se pierde, delegando la recuperación al siguiente ciclo programado (ya que el motor de deduplicación protegerá contra reinserciones).
