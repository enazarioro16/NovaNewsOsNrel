# MVP Specification: NovaNews OS

**Estado:** Aprobado (Sprint 4)
**Fase:** PRODUCTO

## 1. Visión del MVP
El MVP (Minimum Viable Product) de NovaNews OS es la **primera versión pública utilizable**. No buscamos construir el sistema operativo empresarial completo para terceros aún, sino lanzar un portal de noticias propio, alimentado parcialmente por IA, que demuestre que podemos curar, resumir y entregar información más rápido y con menos sesgo que los medios tradicionales.

## 2. El Problema Principal
Los lectores profesionales y entusiastas de la tecnología están abrumados por el "ruido" informativo, el clickbait y la fragmentación. Invierten demasiado tiempo tratando de entender qué es importante.

## 3. Usuarios Objetivo (Personas)

| Persona | Rol | Necesidad Principal | Dolor actual |
|---|---|---|---|
| **P1: Alex (Lector Casual)** | Consumidor | Leer resúmenes rápidos de tecnología en 5 minutos mientras viaja en tren. | Artículos llenos de paja, muros de pago engañosos. |
| **P2: Laura (Periodista/Curadora)** | Creadora | Encontrar fuentes crudas rápidamente para armar una historia verificada. | Fake news, falta de contexto, dificultad para contrastar fuentes. |
| **P3: Carlos (Editor Jefe)** | Gestor | Asegurar que el contenido publicado mantenga un estándar de calidad y no tenga sesgo extremo. | Proceso manual lento de revisión editorial. |
| **P4: Sara (Administradora)** | Owner | Controlar la salud del sistema, monetización y métricas globales. | Herramientas fragmentadas, falta de visión unificada. |
| **P5: Empresa Tech (Anunciante)** | Sponsor | Llegar a un público hiper-segmentado (ej: lectores de AI y Blockchain). | Anuncios irrelevantes que generan rechazo. |
| **P6: David (Suscriptor Premium)** | Power User | Recibir alertas y feeds personalizados solo de temas de su interés. | Mucho ruido en feeds generales, sobrecarga de notificaciones. |

## 4. Customer Journey (P1: Lector Casual -> P6: Suscriptor)
1. **Descubrimiento:** P1 encuentra un artículo resumen vía Twitter (generado por SEO AI).
2. **Adquisición:** P1 entra a la web. Lee la noticia resumida (3 viñetas) en menos de 10 segundos.
3. **Activación:** Se le ofrece un "Feed Personalizado Libre de Ruido" si se registra. P1 se registra con Google (pasa a ser Usuario Registrado).
4. **Retención:** P1 recibe un email diario (Newsletter) con sus 3 temas favoritos. Vuelve a la web cada mañana.
5. **Monetización:** P1 quiere escuchar las noticias en Audio generado por IA mientras conduce. Paga la suscripción de $5/mes (se convierte en P6).

## 5. Alcance del MVP

### IN (Funcionalidades Obligatorias)
- Feed cronológico de noticias (Lectura pública).
- Editorial Quality Hub: Bandeja de revisión (Split-View) para aprobar/rechazar artículos y editar metadata generada por IA (Tags, SEO Title, Summary).
- Resúmenes de noticias con IA (Pipeline básico).
- Registro de usuarios (Google Auth) para guardar artículos.
- SEO optimizado (Rutas dinámicas, meta tags).

### OUT (Queda fuera del MVP)
- Búsqueda semántica compleja (Vectores avanzados).
- Suscripciones de pago (Paywalls).
- Panel de anunciantes y programática propia.
- App móvil nativa (Será PWA web responsiva).
- Podcasting AI y video generativo.

## 6. Métricas de Éxito

- **North Star Metric:** "Tiempo Total de Lectura de Calidad" (Lectura de más de 30 segundos sin rebotar).
- **KPIs del Lanzamiento:**
  - 1,000 Usuarios Registrados (Activados) en las primeras 4 semanas.
  - Tasa de retención Día 7 > 20%.
  - Costo de Inferencia AI por artículo < $0.05.

## 7. La Regla de Oro (Filtro de Funcionalidades)
A partir de hoy, TODA historia de usuario debe responder:
1. **¿Qué valor aporta al usuario?**
2. **¿Qué valor aporta al negocio?**
3. **¿Cómo ayuda al lanzamiento del MVP?**
*(Si no responde esto, se descarta).*
