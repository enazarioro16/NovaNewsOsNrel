# Evaluación de Tecnologías: Frontend Framework

**Fecha:** 2026-07-28
**Estado:** Propuesto
**Componente:** Web Frontend Application

## Candidatos

### 1. Next.js (React)

- **Ventajas:** Renderizado híbrido (SSR/SSG), excelente para SEO (vital para nuestro caso). Ecosistema masivo. Vercel ofrece despliegue instantáneo. Integra App Router para server components que reducen el JS enviado al cliente.
- **Desventajas:** Curva de aprendizaje empinada para Server Components. Creciente complejidad arquitectónica. Vendor lock-in parcial con Vercel si se usan features muy específicas.
- **Coste:** Bajo/Medio (depende de la infraestructura de Serverless).
- **SEO y Performance:** Excelente SSR, ideal para indexación rápida de artículos de noticias.
- **Justificación:** Es el estándar de la industria actual para aplicaciones web intensivas en contenido y SEO.

### 2. Angular

- **Ventajas:** Framework completo, no requiere librerías de terceros para routing o estado. Altamente mantenible y preferido en entornos corporativos (Enterprise).
- **Desventajas:** Muy verboso. SSR (Angular Universal) históricamente complejo, aunque mejorado recientemente. Ciclo de actualización constante.
- **Coste:** Bajo (hosting estático/Node).
- **SEO y Performance:** Medio-Alto (requiere correcta configuración de SSR).
- **Justificación:** Excelente para el "Core Admin Panel", pero puede ser excesivamente rígido para una SPA orientada a consumidor hiper-dinámica.

### 3. Vue / Nuxt.js

- **Ventajas:** Sintaxis elegante, curva de aprendizaje rapidísima. Nuxt.js ofrece un SSR excelente y robusto. Muy ligero y rápido.
- **Desventajas:** Comunidad menor que React. Ecosistema de librerías de terceros (UI components) más reducido.
- **Coste:** Bajo.
- **SEO y Performance:** Excelente SSR, bundle size típicamente menor que React.
- **Justificación:** Una alternativa sólida a Next.js si se prioriza la velocidad de desarrollo del frontend por encima de tener el ecosistema más grande.
