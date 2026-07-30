# Principios y Reglas de Arquitectura

Este documento rige las decisiones de ingeniería para NovaNews OS. Toda línea de código y decisión de diseño debe adherirse a estas reglas.

## 1. Principios Generales

- **SOLID & Clean Architecture**: Separación estricta de responsabilidades (Presentación, Casos de Uso, Dominio, Infraestructura). La lógica de negocio NO debe depender de frameworks.
- **KISS & YAGNI**: No sobre-ingenierizar. No construir características "por si acaso". Resolver el problema actual de la forma más simple posible que permita escalar en el futuro.
- **DRY (Don't Repeat Yourself)**: La lógica duplicada es deuda técnica. Reutilizar componentes y modularizar agresivamente.

## 2. Paradigma de Diseño

- **Diseño API-First**: Toda funcionalidad backend debe estar expuesta mediante una API RESTful o GraphQL bien documentada antes de desarrollar el cliente.
- **Arquitectura Modular (Monolito Modular a Microservicios)**: Iniciaremos con un Monolito Modular altamente cohesivo, con fronteras de contexto claras (DDD). Esto facilitará la extracción a microservicios independientes cuando la carga lo requiera.
- **Arquitectura Hexagonal (Puertos y Adaptadores)**: Aislaremos la lógica de negocio de agentes externos (Bases de datos, APIs de terceros, Interfaces de usuario).

## 3. Manejo de Datos y Estado

- **Single Source of Truth**: Mantener una única fuente de verdad para el estado de la aplicación.
- **Inmutabilidad y Eventos**: Preferir estructuras de datos inmutables y arquitecturas orientadas a eventos (Event-Driven) para el procesamiento asíncrono de noticias.

## 4. Calidad y Testing

- **Test-Driven Development (TDD)**: Fomentado para casos de uso críticos del dominio.
- **Cobertura Mínima**: 80% de cobertura en lógica de negocio.
- **Revisiones Automatizadas**: Ningún PR se aprueba sin pasar linting, SAST (seguridad) y tests automáticos.

## 5. IA y Consumo de Contexto (Regla Interna del Consejo)

- El Consejo Ejecutivo de IA optimizará el uso de tokens, enfocándose en los archivos relevantes y utilizando resúmenes estructurados.
