# Evaluación Integral del Stack Tecnológico Enterprise (ADR)

Este documento consolida las decisiones tecnológicas definitivas para soportar la arquitectura de NovaNews OS Platform, basándose en la recomendación del Consejo Ejecutivo.

## 1. Backend Core Framework

- **Candidatos:** NestJS vs ASP.NET Core
- **Decisión:** **NestJS (TypeScript)**
- **Justificación:** Aunque ASP.NET Core posee un rendimiento multi-hilo superior para ciertos escenarios enterprise, NestJS nos permite compartir el 100% del ecosistema tipado (TypeScript) y DTOs con el Frontend (Next.js). Además, el ecosistema de IA (LangChain.js) está mucho más maduro en el entorno Node/TS. La arquitectura fuertemente opinada de NestJS nos garantiza la separación modular requerida para el OS Core.

## 2. Frontend Framework

- **Candidatos:** Next.js vs Angular vs Vue
- **Decisión:** **Next.js**
- **Justificación:** El renderizado híbrido (SSR + React Server Components) es innegociable para el SEO agresivo requerido por una plataforma de contenido (News Portal).

## 3. Base de Datos Principal & Búsqueda Vectorial

- **Candidatos:** PostgreSQL vs MySQL | Meilisearch vs OpenSearch
- **Decisión:** **PostgreSQL + Meilisearch**
- **Justificación:** Postgres es el rey absoluto en flexibilidad. El uso de la extensión `pgvector` nos permite tener la memoria compartida de la IA (embeddings) en la misma base de datos transaccional en el Día 1. Usaremos **Meilisearch** como motor de búsqueda secundario ultra-rápido para las búsquedas tipográficas del usuario final (typo-tolerance).

## 4. ORM (Capa de Acceso a Datos)

- **Candidatos:** Prisma vs Drizzle ORM
- **Decisión:** **Drizzle ORM**
- **Justificación:** Prisma ofrece una experiencia de desarrollo fantástica, pero su motor en Rust y el "Cold Start" en entornos Serverless genera problemas de latencia e infraestructuras pesadas. Drizzle ORM ofrece la misma seguridad de tipos (Type-Safety) de extremo a extremo, pero se ejecuta como SQL puro, ofreciendo un rendimiento inmensamente superior y control absoluto sobre las consultas complejas requeridas por el Core.

## 5. IA Proxy (Abstracción de LLMs)

- **Candidatos:** Conexiones directas OpenAI SDK vs LiteLLM
- **Decisión:** **LiteLLM**
- **Justificación:** Obligatorio para una plataforma Enterprise. En lugar de atarnos a OpenAI, el `LLM Core` llamará a un proxy de LiteLLM que estandariza las llamadas. Si OpenAI sube precios o falla, podemos rutear el tráfico a Anthropic (Claude) o Llama local cambiando solo una variable de entorno.

## 6. Autenticación y Autorización

- **Candidatos:** Keycloak vs Auth.js
- **Decisión:** **Keycloak** (Para el Identity Core)
- **Justificación:** Auth.js es ideal para aplicaciones B2C simples. Sin embargo, para una plataforma OS que requiere SSO, gestión de roles de agentes IA, identidades máquina a máquina (M2M) y federación de identidades, Keycloak (Open Source, Java) es el estándar Enterprise que actuará como nuestro `Identity Core` de bajo nivel.

## 7. Automatización

- **Candidatos:** n8n vs Trigger.dev
- **Decisión:** **Trigger.dev**
- **Justificación:** Mantenemos los background jobs (procesamiento asíncrono de noticias) como código tipado dentro de nuestro repositorio (Code-first), favoreciendo la mantenibilidad del equipo de ingeniería sobre la interfaz visual de n8n.

## 8. Almacenamiento & Observabilidad

- **Storage:** Cloudflare R2 (Compatible con S3, latencia global, 0 costes de egreso - egress fees).
- **Cache:** Redis (Esencial para Rate Limiting y Caché de lectura de artículos).
- **Observabilidad:** OpenTelemetry estandarizado enviando métricas a Grafana (El estándar absoluto cloud-native).
