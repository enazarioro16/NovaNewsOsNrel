# Integration Blueprint: n8n Workflow Architecture

Este documento detalla la arquitectura de integración orquestada (Capa Externa) entre el **Core de NovaNews OS** y el orquestador **n8n**. Esta separación garantiza que el Core se mantenga ágil, inmutable e independiente de la lógica volátil de redes sociales y CRMs de terceros.

## 1. Arquitectura de Red y Seguridad (Machine-to-Machine)
- El contenedor de `n8n` se ejecuta dentro del mismo clúster de Docker en la red privada `novanews_internal`.
- Esto le permite conectarse directamente al backend de NovaNews OS usando la URL `http://api:3001` sin necesidad de exponer el backend a internet (si se desea ocultar tras el firewall).
- **M2M Authentication:** `n8n` autenticará sus peticiones inyectando el header `x-api-key: <M2M_API_KEY>` en los nodos HTTP Request. El `ApiKeyAuthGuard` del Core NestJS se encargará de validarlo, bloqueando cualquier intento público ilegítimo.

## 2. Flujo 1: Distribución Omnicanal Automática (Polling)
Ya que somos nosotros los que mantenemos el control (Outbound API), `n8n` funcionará bajo un patrón de *Polling* (o bien conectándose a un evento Webhook futuro).
1. **Trigger Node (Schedule):** n8n se despierta cada 15 minutos (por ejemplo).
2. **HTTP Request Node:** Hace un `GET http://api:3001/distribution/scripts` con la API Key configurada.
3. **Item Lists / Filter:** Itera sobre el arreglo de noticias con `socialScript` que aún no hayan sido publicadas hoy (o almacenadas internamente en el estado de n8n).
4. **Switch Node (Router):** 
   - *Rama A (Telegram/X):* Extrae `hook` y `body` del JSON y ejecuta los nodos nativos de Telegram Bot / Twitter v2.
   - *Rama B (TikTok/Reels/Video AI):* Extrae todo el guion y envía el JSON a HeyGen/Runway/ElevenLabs.

## 3. Flujo 2: Exportación a CRM (Suscripciones B2B)
El Core se mantiene enfocado en el Feed; el CRM vive afuera.
1. **Trigger Node:** Intercepta la API pública cuando un suscriptor se registra (futuro Endpoint M2M).
2. **HubSpot / Salesforce Node:** El orquestador se encarga de crear el Contacto, enviarlo a Mailchimp y aplicar etiquetas de Mail Marketing basadas en los `Tags` que prefirió el usuario en su Onboarding.

## Por qué n8n y no NestJS
Empotrar el SDK oficial de Telegram, la SDK de TikTok o el cliente de HubSpot dentro del código TypeScript de nuestro Monorepo `apps/api` inflaría la deuda técnica exponencialmente. n8n abstrae los mantenimientos de tokens Oauth2 de esas plataformas (Credential Manager) y nos permite rediseñar las campañas sin requerir un nuevo `docker build` ni tiempo de despliegue de los ingenieros.
