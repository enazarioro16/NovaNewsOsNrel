# Organización del Proyecto

Este documento justifica la existencia de cada directorio, definiendo quién lo usa y sus dependencias, asegurando una separación estricta de responsabilidades.

| Directorio        | Propósito y Justificación                                                                                                   | Agente Responsable | Dependencias                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------ |
| `.antigravity/`   | Reglas duras del sistema, prompts base, políticas de consumo y flujos internos. Evita que la IA actúe de forma errática.    | AI Engineer        | Ninguna                        |
| `docs/`           | Single Source of Truth para arquitectura, negocio, procesos y ADRs. Fundamental para onboarding y contexto de agentes.      | CTO / Scrum Master | Ninguna                        |
| `agents/`         | Definición de identidad, inputs/outputs y metaprompts de los agentes del Consejo. Permite instanciar agentes dinámicamente. | AI Engineer        | `.antigravity/`                |
| `backend/`        | Código del Monolito Modular. Maneja lógica de negocio, APIs y persistencia. Separado por Bounded Contexts.                  | Backend AI         | `database/`, `infrastructure/` |
| `frontend/`       | Interfaz de usuario web responsiva (Web App).                                                                               | Frontend / UX AI   | `backend/` (vía API)           |
| `mobile/`         | Aplicación móvil nativa o híbrida. Mantenida separada para un ciclo de release distinto al web.                             | Frontend AI        | `backend/` (vía API)           |
| `automation/`     | Scripts y flujos sin servidor (Serverless/Cron) para tareas asíncronas como crawling, scraping y publicación social.        | Automation AI      | `backend/`, `prompts/`         |
| `infrastructure/` | Código de infraestructura (Terraform, Dockerfiles, K8s). Permite despliegues reproducibles (IaC).                           | DevOps AI          | Ninguna                        |
| `database/`       | Modelos conceptuales, esquemas, y migraciones. Aislado para control estricto del estado y evolución de esquemas.            | Database AI        | Ninguna                        |
| `prompts/`        | Repositorio versionado de prompts de producción utilizados por los módulos de IA para analizar y generar contenido.         | AI Engineer        | Ninguna                        |
| `tests/`          | Pruebas E2E, carga, y seguridad (Cypress, JMeter). Asegura que no haya regresiones antes de un release.                     | QA AI              | `backend/`, `frontend/`        |
| `scripts/`        | Herramientas de desarrollo local (Makefiles, bash, powershell) para levantar entornos y bases de datos locales.             | DevOps AI          | Ninguna                        |
| `assets/`         | Archivos estáticos pesados (Imágenes, logos, vectores) para marketing y frontend.                                           | UX/UI AI           | Ninguna                        |
