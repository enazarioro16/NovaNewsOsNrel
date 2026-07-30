# Guía de Despliegue en Producción (NovaNews OS Beta)

Este documento contiene los pasos exactos para que un Operador DevOps despliegue NovaNews OS en un Servidor Privado Virtual (VPS) estándar (Ubuntu 22.04 LTS).

## Requisitos Previos en el VPS
- Docker Engine instalado.
- Docker Compose v2 instalado.
- Git instalado.
- Puertos 80, 443, 3000 y 3001 abiertos en el Firewall (UFW/Security Groups).

## 1. Clonar y Configurar Entorno
1. Haz SSH hacia tu servidor: `ssh user@tu_ip_servidor`
2. Clona el repositorio: `git clone https://github.com/tu-org/novanews-os.git && cd novanews-os`
3. Copia el archivo de entorno y configura tus variables:
   ```bash
   cp .env.example .env
   nano .env
   # Asegúrate de rellenar:
   # GEMINI_API_KEY=tu_clave_real
   # NEXTAUTH_SECRET=genera_un_hash_aleatorio_con_openssl
   ```

## 2. Compilar e Iniciar Contenedores
Gracias a nuestro `docker-compose.prod.yml`, construir y levantar el proyecto es un solo comando. Usaremos la bandera `-d` para que corra en segundo plano.

```bash
docker compose -f docker-compose.prod.yml up --build -d
```
*Nota: Los Dockerfiles (apps/api/Dockerfile.prod y apps/web/Dockerfile.prod) están optimizados con Multi-stage builds. Solo incluirán los binarios compilados y las dependencias de producción, reduciendo el tamaño de la imagen drásticamente y mejorando la seguridad.*

## 3. Ejecución Segura de Migraciones (Drizzle)
Una vez que el clúster de Docker está corriendo, necesitamos instanciar el esquema en la base de datos de producción (la cual corre en la red aislada `novanews_internal`). 
Para no exponer la base de datos a internet ni ejecutar migraciones en el runtime (mala práctica), usaremos un contenedor temporal:

```bash
# Correr contenedor de node mapeado a la red de producción
docker run --rm --network novanews-os_novanews_internal \
  -v $(pwd)/packages/database:/app/packages/database \
  -w /app/packages/database \
  -e DATABASE_URL="postgres://novanews:novanews_prod_password@database:5432/novanews_prod_db" \
  node:20-alpine \
  npx drizzle-kit migrate
```
Este comando garantiza que la tabla `source`, `news`, las relaciones y la extensión `pgvector` queden configuradas de manera segura en producción.

## 4. Reverse Proxy (Recomendado)
Se recomienda encarecidamente instalar **Nginx** o **Caddy** en la máquina Host para mapear `tu-dominio.com` hacia el puerto 3000 (Next.js) y `api.tu-dominio.com` hacia el puerto 3001 (NestJS API), aprovisionando certificados SSL de Let's Encrypt automáticamente.

## 5. Mantenimiento y Recuperación
El archivo de Compose incluye `restart: always`. Si la máquina se reinicia, todos los microservicios volverán a encenderse automáticamente. Además, el `AutomationService` (CronJob) arrancará inmediatamente al encender el contenedor de la API para reanudar el flujo del News Pipeline.
