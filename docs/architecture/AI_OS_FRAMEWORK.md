# Inteligencia Artificial: OS de Agentes

NovaNews OS no "usa" inteligencia artificial; _es_ un sistema operativo gestionado por IA. Este documento define la arquitectura interna del sistema multiagente.

## 1. Orquestador Principal (The Kernel)

El orquestador es un bucle de control basado en el patrón ReAct (Reason + Act). Evalúa el estado actual del sistema (eventos pendientes en la cola) y delega tareas a los agentes específicos. No ejecuta tareas de dominio, solo delega y enruta.

## 2. Memoria y Gestión de Contexto

Los agentes sufren de amnesia sin un sistema de memoria robusto.

- **Memoria a Corto Plazo (RAM del Agente):** Historial de mensajes de la sesión actual o del pipeline de procesamiento del artículo actual (almacenado en Redis).
- **Memoria a Largo Plazo (Disco Duro del Agente):** Base de datos vectorial (VectorDB) que almacena guías de estilo, decisiones pasadas, conocimiento histórico y regulaciones legales. Recuperado vía Retrieval-Augmented Generation (RAG).
- **Memoria Compartida (Shared Workspace):** Un "Pizarrón" (Blackboard Pattern) donde múltiples agentes pueden leer y escribir. Ej: _Research AI_ escribe los hechos, _Editor AI_ los lee para redactar.

## 3. Sistema de Herramientas (Toolchain)

Los agentes no pueden interactuar directamente con el mundo físico o bases de datos a menos que usen Herramientas registradas en el Core.

- `fetch_url(url)`: Descarga contenido crudo.
- `execute_query(sql)`: Restringido solo al _Database AI_ bajo un rol read-only.
- `publish_event(topic, payload)`: Emite eventos al bus del sistema.
- `request_human_approval(context)`: Escala una decisión al equipo humano.

## 4. Comunicación entre Agentes

- **Comunicación Asíncrona (Eventos):** _SEO AI_ emite `SeoTagsGenerated`. _Editor AI_ está suscrito y actualiza el artículo.
- **Comunicación Síncrona (RPC/Mensajes Directos):** Un agente solicita información a otro y espera. Ejemplo: _CTO AI_ le pregunta a _Security AI_ por la viabilidad de una librería.

## 5. Sistema de Permisos y Restricciones (RBAC para IA)

A los agentes se les asignan roles estrictos:

- _Research AI_: Permiso para usar la web, pero NO puede escribir en la base de datos de producción.
- _Editor AI_: Permiso para escribir en la tabla `Articles`, pero no puede modificar perfiles de usuario.

## 6. Sistema de Aprendizaje (Self-Reflection)

Implementación de un bucle "Actor-Critic". Cuando un artículo genera bajo engagement (detectado por Analytics AI), el sistema envía el feedback al Editor AI para ajustar su `prompt` interno ("Las notas recientes son muy largas, reduce la verbosidad en un 20%").
