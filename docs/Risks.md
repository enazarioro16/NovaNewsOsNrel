# Registro de Riesgos y Mitigaciones

| ID  | Riesgo                              | Impacto | Probabilidad | Estrategia de Mitigación                                                                                                                               | Propietario (Agente)    |
| --- | ----------------------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| R1  | Sobrecarga de Ingesta de Datos      | Alto    | Alta         | Implementar colas de mensajes (Kafka/RabbitMQ) con auto-scaling para desacoplar ingesta de procesamiento.                                              | CTO / DevOps AI         |
| R2  | Alucinaciones del Modelo de IA      | Crítico | Media        | Implementar flujo de "Fact-Checking AI" independiente cruzando datos con 3+ fuentes confiables antes de publicar.                                      | Editor AI / Research AI |
| R3  | Alto Costo de Infraestructura de IA | Medio   | Alta         | Optimizar prompts, usar modelos más pequeños (Open-source) para tareas simples (clasificación) y grandes para resúmenes complejos. Cachear respuestas. | CTO / Backend AI        |
| R4  | Retrasos por sobre-ingeniería       | Alto    | Media        | Seguir estrictamente el MVP. Utilizar YAGNI. Iniciar con un Monolito Modular en lugar de microservicios completos.                                     | Scrum Master / CTO      |
| R5  | Seguridad y Privacidad de Datos     | Alto    | Baja         | Cifrado en reposo y en tránsito. Cumplimiento GDPR/CCPA por diseño (Privacy by Design).                                                                | Security AI             |
