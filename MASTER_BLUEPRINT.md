# MASTER BLUEPRINT: NovaNews OS Enterprise AI Platform

**Versión:** 1.0.0 (Constitución Técnica Oficial)
**Estado:** Aprobado para inicio de Sprint 1

Este documento constituye la única fuente oficial de verdad y el diseño arquitectónico supremo para NovaNews OS. A partir de este momento, NovaNews OS deja de ser un producto B2C aislado y se convierte en una **Plataforma Empresarial de Inteligencia Artificial**.

---

## 1. Topología de la Arquitectura Empresarial (Layered Architecture)

La dependencia siempre fluye hacia abajo. Las capas superiores jamás pueden ser requeridas por las inferiores.

1. **Clients (Capa de Presentación Externa)**: Navegadores Web, Apps Móviles, Dispositivos IoT, Clientes API de terceros.
2. **Interfaces (Capa de Exposición)**: GraphQL, REST APIs, WebSockets, gRPC.
3. **Applications (Productos Finales)**:
   - _News Portal Web_
   - _Admin Dashboard_
   - _Analytics SaaS_
   - _AI Studio_
4. **Business Modules (Lógica de Dominio del Producto)**: Reglas específicas de negocio (Suscripciones al portal, lógica de ranking de noticias, motores de afiliación).
5. **Shared Services (Servicios de Plataforma)**: Servicios orquestados reutilizables (Ej: _Publishing Service_ que usa _News Plugin_ y _AI Core_).
6. **NovaNews OS Core (El Kernel)**: Servicios puros, abstractos y agnósticos al negocio de "noticias". Proveen la infraestructura de software.

---

## 2. NovaNews OS Core (El Kernel Tecnológico)

El Core está compuesto por módulos estandarizados. A continuación, el diseño de los pilares críticos:

### 2.1 Identity Core & Security Core

- **Objetivo:** Gestión centralizada de identidades, autenticación (AuthN) y autorización (AuthZ).
- **Responsabilidades:** Emisión de tokens, MFA, RBAC/ABAC estricto, rotación de claves.
- **Interfaces:** `VerifyToken()`, `CheckPermission()`.
- **Dependencias:** Autenticación delegada (Keycloak / Auth.js), Redis (Revocation list).

### 2.2 Agent Core & LLM Core

- **Objetivo:** Framework interno de instanciación y ejecución de Inteligencia Artificial.
- **Responsabilidades:** Proveer un estándar `IAgent`, enrutar peticiones al proveedor de IA adecuado (OpenAI, Anthropic, Local Llama) mediante un proxy (LiteLLM).
- **Interfaces:** `DispatchPrompt()`, `InstantiateAgent()`.

### 2.3 Event Core & Workflow Core

- **Objetivo:** Sistema nervioso de la plataforma.
- **Responsabilidades:** Garantizar la entrega asíncrona de mensajes entre cores y plugins, orquestar flujos de larga duración (Sagas).
- **Interfaces:** `PublishEvent()`, `SubscribeToEvent()`.

### 2.4 Otros Cores Fundamentales (Implementación Progresiva)

- **Knowledge Core / Memory Core:** Vectorización e indexación de embeddings (RAG base).
- **Observability Core:** Telemetría centralizada (OpenTelemetry).
- **Storage & Media Core:** Abstracción de sistema de archivos (Cloudflare R2/S3).
- **Plugin Core:** Inyector dinámico de dependencias en tiempo de ejecución.
- _(Los demás Cores: Configuration, Audit, Search, API Gateway, Billing, Feature Flag, I18n, Settings, Analytics y SEO, siguen esta misma interfaz estricta)._

---

## 3. Sistema de Plugins (Extensibilidad)

La plataforma es estéril por defecto. Toda funcionalidad de negocio se inyecta como un **Plugin**.

- **Regla de Oro:** Los plugins NUNCA modifican el código del Core. Se conectan a través de _Hooks_ y _Eventos_.
- **Ejemplos de Implementación:**
  - `News Plugin`: Define la entidad "Artículo" y sus estados.
  - `AI Editor Plugin`: Se suscribe a eventos del `News Plugin` para generar correcciones, usando el `Agent Core`.
  - `Advertising Plugin`: Inyecta lógica de subasta en los espacios del frontend.

---

## 4. Arquitectura de Enterprise AI (Sistema Multiagente)

El sistema de agentes ya no es un flujo lineal, es una red neuronal de operaciones de software.

- **Orquestador Central:** El "Kernel AI" que delega el trabajo. Funciona como un router cognitivo.
- **Anatomía del Agente Enterprise:**
  - _Memoria Local:_ Contexto de ejecución transaccional (Redis).
  - _Memoria Compartida:_ Base de datos vectorial (pgvector) a la que todos los agentes consultan para mantener consistencia editorial.
  - _Herramientas (Toolchain):_ Funciones deterministas inyectadas (ej. `ExecuteSQL`, `CrawlURL`). Controladas estrictamente por el `Security Core`.
  - _Sistema de Reflexión y Autoevaluación:_ Un agente `QA_AI` critica la salida del agente `Writer_AI` antes de considerarla "Done".
  - _Sistema de Aprendizaje:_ Ajuste dinámico de los meta-prompts basados en analíticas de retención.
  - _Recuperación de Errores:_ Si un LLM falla o alucina, el orquestador aplica _Fallbacks_ (retrocede a un modelo menor o pide intervención humana).

---

## 5. Knowledge Graph (Fase Futura Post-MVP)

Este dominio será el cerebro relacional de la plataforma. A diferencia del almacenamiento tabular clásico, conectará metadatos no estructurados.
* **Responsabilidades**: Relacionar entidades (Personas, Empresas, Países, Eventos, Tecnologías).
* **Casos de Uso Previstos**: Detectar tendencias, generar cronologías automáticas, agrupar noticias redundantes y crear páginas temáticas dinámicas (Ej: "Todo sobre OpenAI").
* **Regla Estricta**: No bloqueará el lanzamiento del MVP. Su diseño debe ser conectable de forma externa al `News Intelligence Pipeline` en el futuro.

---

## 6. Omnichannel Distribution Engine (Nuevos Flujos Post-MVP)

El sistema incorpora un motor automatizado que re-empaqueta contenido aprobado para su distribución en redes externas sin intervención manual.

- **Responsabilidades**: Convertir artículos periodísticos a guiones estructurados para videos cortos (TikTok/Reels), textos para redes sociales (X/Telegram) y Newsletters.
- **Implementación Actual**: El `Distribution Core` se dispara automáticamente tras el evento `PUBLISHED`. Invoca al LLM para generar formatos JSON estrictos y los expone mediante endpoints Webhook seguros.
- **Regla Estricta**: El Core nunca debe integrar directamente APIs externas (ej. SDK de TikTok). Todo sistema de publicación externo debe interactuar suscribiéndose o consultando nuestros Webhooks estandarizados (desacoplamiento total).

---

## 6. Salida del Sprint 0 (Criterio de Éxito)

Para evitar el _Analysis Paralysis_, declaro oficialmente que **el Sprint 0 ha alcanzado su objetivo fundacional**.
Tenemos la constitución (MASTER_BLUEPRINT), la separación de capas, el diseño del OS Core, y los ADRs tecnológicos base (Ver `ADR-0006`).

A partir del **Sprint 1**, comenzaremos la construcción iterativa del producto funcional, implementando primero el `Identity Core` y el `API Gateway Core`.
