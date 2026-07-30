# Playbook de Scrum y Ciclo de Vida

## Ceremonias

1. **Sprint Planning**: El _Product Owner AI_ presenta el Backlog priorizado. El _Scrum Master AI_ y _CTO AI_ negocian el alcance del Sprint.
2. **Daily Scrum**: Sincronización rápida. ¿Qué hice? ¿Qué haré? ¿Qué bloqueos tengo?
3. **Sprint Review**: Demostración del incremento de producto funcional frente a las métricas del Sprint.
4. **Sprint Retrospective**: Análisis de mejora continua. Actualización de `.antigravity/workflows` si aplica.

## Definition of Ready (DoR)

Una Historia de Usuario está "Ready" (lista para desarrollo) cuando:

- Tiene criterios de aceptación claros.
- Tiene dependencias técnicas resueltas.
- Ha sido estimada en Story Points.
- Posee un diseño UX (si aplica).

## Definition of Done (DoD)

Una tarea está "Done" (terminada) cuando:

- El código pasa el CI (Build & Linters sin errores).
- Pasa los tests unitarios (>85% coverage).
- Pasa los análisis de seguridad SAST (0 vulnerabilidades críticas/altas).
- Documentación técnica actualizada (Swagger/OpenAPI).
- Aprobada en QA por el _QA AI_.
- Desplegada en Staging.

## Estimaciones

- Se utilizará la sucesión de Fibonacci (1, 2, 3, 5, 8, 13) para los **Story Points**.
- Velocity: Calculada como el promedio de Story Points completados en los últimos 3 Sprints.

## Artefactos

- **Product Backlog**: Lista viva de todo el trabajo requerido, propiedad del _Product Owner AI_.
- **Sprint Backlog**: Lista de tareas comprometidas para el Sprint actual.
- **Burndown Chart**: Gráfico de avance diario (automatizado por Analytics AI).
- **Release Plan**: Mapa de entregas mayores alineado con el Roadmap.
