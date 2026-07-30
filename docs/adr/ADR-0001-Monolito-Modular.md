# ADR-0001: Adopción de Monolito Modular vs Arquitectura Orientada a Eventos

**Fecha:** 2026-07-28
**Estado:** Aceptado
**Autor (Agente):** CTO AI

### Contexto y Problema

El diseño original proponía una arquitectura Orientada a Eventos (Event-Driven) e infraestructura de Microservicios para soportar millones de usuarios. Sin embargo, la startup se encuentra en Fase MVP (0 usuarios). Una arquitectura distribuida prematura introduciría latencia de red, complejidad en el despliegue, dificultad en el rastreo de errores y sobrecarga operativa que puede agotar los recursos antes de encontrar Product-Market Fit (PMF).

### Alternativas Evaluadas

1. **Microservicios (Event-Driven con Kafka/RabbitMQ):**
   - _Pros:_ Escalabilidad infinita e independiente. Tolerancia a fallos aislada.
   - _Contras:_ Alto costo cognitivo, DevOps complejo, consistencia eventual difícil de manejar en MVP.
2. **Monolito Tradicional (Big Ball of Mud):**
   - _Pros:_ Rápido de desarrollar inicialmente. Fácil de desplegar.
   - _Contras:_ Imposible de escalar a largo plazo. Código espagueti inmanejable.
3. **Monolito Modular (Domain-Driven Design):**
   - _Pros:_ Despliegue simple (un solo artefacto). Límites estrictos entre dominios (evita código espagueti). Refactorización sencilla a microservicios si se necesita en el futuro (extrayendo los módulos).
   - _Contras:_ Escalabilidad vertical inicial, todos los módulos caen si la aplicación principal cae.

### Decisión

Adoptaremos una **Arquitectura de Monolito Modular**. Todo el backend correrá en un único proceso, pero el código estará estrictamente separado en módulos independientes (Bounded Contexts) comunicados únicamente a través de interfaces bien definidas o eventos en memoria (In-Memory Event Bus), NO a través de red.

### Justificación

Un monolito modular bien organizado permite la velocidad de desarrollo necesaria para un MVP mientras mantiene los límites claros entre dominios (Ej: `NewsModule`, `UserModule`, `AIModule`). Muchas startups fracasan por sobre-ingeniería inicial. Esto nos garantiza un time-to-market rápido y un camino de evolución claro: si un módulo necesita escalar de forma independiente en el futuro, se podrá extraer a un microservicio sin reescribir la lógica de negocio.

### Consecuencias (Riesgos y Trade-offs)

- **Positivas:** Reducción drástica del tiempo de despliegue y debugging. Infraestructura mucho más económica.
- **Negativas/Riesgos:** Riesgo de acoplamiento accidental si no se respetan estrictamente los límites de los módulos mediante linters y revisiones arquitectónicas (ArchUnit).

### Plan de Reemplazo (Future-Proofing)

Cuando un módulo (ej. `AI_Processing`) demande demasiada CPU afectando la API principal, o cuando el equipo de ingeniería supere las 15 personas, reemplazaremos el bus de eventos en memoria por Kafka/RabbitMQ y extraeremos ese módulo a un microservicio independiente.
