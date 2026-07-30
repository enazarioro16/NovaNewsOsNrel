# Evaluación de Tecnologías: Orquestación y Automatización

**Fecha:** 2026-07-28
**Estado:** Propuesto
**Componente:** Workflow & Automation Engine

## Candidatos

### 1. Temporal.io

- **Ventajas:** Framework de "ejecución duradera". Permite escribir flujos de trabajo asíncronos en código (Go, TS, Python) que sobreviven a caídas del servidor. Excelente para orquestación compleja de agentes IA.
- **Desventajas:** Infraestructura pesada. Requiere montar servicios separados (Workers, Temporal Server, DB). Curva de aprendizaje altísima.
- **Justificación:** Es la herramienta definitiva para sistemas distribuidos robustos (Uber, Netflix la usan), pero puede ser overkill extremo para un MVP.

### 2. n8n

- **Ventajas:** Interfaz visual (No-code / Low-code) potente. Permite programar nodos en JavaScript. Excelentes integraciones preconstruidas (Redes Sociales, LLMs, APIs). Open-source y autohospedable.
- **Desventajas:** Difícil de versionar en Git (son archivos JSON). No es ideal para lógica de negocio puramente interna que requiere miles de ejecuciones por segundo (overhead).
- **Justificación:** Ideal para la "Automatización Social Media" y "Crawling", separándolo de la lógica core.

### 3. Trigger.dev

- **Ventajas:** Code-first background jobs para TypeScript. Se escribe en el mismo repositorio que tu código backend/Next.js. Sin infraestructura compleja (ellos manejan el backend SaaS o se puede self-hostear).
- **Desventajas:** Menos conectores pre-construidos que n8n. Más joven, ecosistema en desarrollo.
- **Justificación:** El balance perfecto entre "Code-first" (versionable) y facilidad de uso para un Monolito Modular en TS.
