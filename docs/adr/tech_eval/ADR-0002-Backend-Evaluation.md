# Evaluación de Tecnologías: Backend Framework

**Fecha:** 2026-07-28
**Estado:** Propuesto (Pendiente de Decisión)
**Componente:** Backend Core Framework

## Candidatos

### 1. NestJS (Node.js / TypeScript)

- **Ventajas:** Arquitectura fuertemente opinada (Angular-style), inyección de dependencias nativa, excelente soporte para Monolito Modular y CQRS. El mismo lenguaje (TS) que el Frontend permite compartir DTOs y tipos.
- **Desventajas:** Consumo de memoria medio-alto (Node.js). Menor rendimiento en procesamiento multihilo puro comparado con Go.
- **Curva de Aprendizaje:** Media. Requiere entender decoradores, RxJS y DI.
- **Mantenibilidad:** Muy Alta (arquitectura estandarizada).
- **Compatibilidad IA:** Alta. LangChain.js tiene gran soporte y la comunidad JS/TS es la segunda más grande en IA.
- **Coste/Escalabilidad:** Coste de infraestructura moderado. Escala bien horizontalmente, pero no tan eficiente por request como Go.

### 2. Go (Golang)

- **Ventajas:** Concurrencia nativa ultra-eficiente (Goroutines). Consumo de memoria extremadamente bajo. Ideal para manejar millones de conexiones simultáneas y procesamiento de alta velocidad.
- **Desventajas:** Código más verboso (manejo de errores manual `if err != nil`). Ecosistema de frameworks web menos estandarizado que NestJS (normalmente se usan routers ligeros como Gin/Fiber).
- **Curva de Aprendizaje:** Media-Alta (cambio de paradigma si el equipo viene de TS/Python).
- **Mantenibilidad:** Alta (código simple y directo), pero requiere fuerte disciplina arquitectónica manual.
- **Compatibilidad IA:** Media. Hay SDKs, pero el estado del arte de IA (LangChain, LlamaIndex) siempre llega primero a Python y luego a TS.
- **Coste/Escalabilidad:** Coste de infraestructura mínimo. Máxima escalabilidad vertical y horizontal.

### 3. FastAPI (Python)

- **Ventajas:** Desarrollo hiperveloz. Generación de OpenAPI automática. Integración nativa e instantánea con todo el ecosistema de IA y Machine Learning (PyTorch, Pandas, LangChain, OpenAI nativo).
- **Desventajas:** Rendimiento inferior a Go y TS/Node bajo carga extrema. Python no es el mejor lenguaje para mantener un Monolito Modular gigante sin disciplina estricta.
- **Curva de Aprendizaje:** Muy Baja.
- **Mantenibilidad:** Media (requiere fuerte tipado estático `mypy` para no romperse en producción a gran escala).
- **Compatibilidad IA:** Excelente (Es el estándar de la industria AI).
- **Coste/Escalabilidad:** Requiere más contenedores para manejar la misma concurrencia que Go o Node, incrementando costos bajo carga masiva.

### 4. ASP.NET Core (C#)

- **Ventajas:** Rendimiento masivo (a la par o superior a Go en algunos benchmarks web). Orientación a objetos robusta, excelente para Domain-Driven Design y arquitecturas empresariales gigantes.
- **Desventajas:** Ecosistema tradicionalmente cerrado (aunque ahora es open-source). Suele requerir Windows/Visual Studio para máxima productividad (aunque Rider/VSCode funcionan bien).
- **Curva de Aprendizaje:** Alta.
- **Mantenibilidad:** Excelente.
- **Compatibilidad IA:** Media-Alta (Semantic Kernel de Microsoft está creciendo rápido).

---

**Nota para el Consejo:** Evaluar basándose en nuestra necesidad de integrar IA intensivamente (Python/TS) versus nuestra necesidad de bajo coste de cómputo y escalabilidad máxima (Go/C#).
