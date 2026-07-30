# Evaluación de Tecnologías: Base de Datos Principal

**Fecha:** 2026-07-28
**Estado:** Propuesto
**Componente:** Primary OLTP Database

## Candidatos

### 1. PostgreSQL

- **Ventajas:** Estándar de facto en bases de datos relacionales open-source. Soporte increíble para JSONB (permite mezclar esquemas rígidos con flexibilidad NoSQL). Soporta pgvector para búsquedas vectoriales de IA sin necesitar bases de datos externas adicionales en una fase inicial.
- **Desventajas:** Escalabilidad horizontal compleja (requiere sharding manual o herramientas como Citus).
- **Coste:** Muy bajo (Open source).
- **Escalabilidad:** Excelente verticalmente.
- **Compatibilidad IA:** Excelente gracias a pgvector.
- **Justificación:** Ofrece integridad relacional para finanzas/usuarios y flexibilidad documental (JSONB) para contenido crudo.

### 2. MySQL

- **Ventajas:** Extremadamente rápido para operaciones de lectura simples. Amplia adopción, fácil de encontrar talento. Ecosistema robusto de herramientas.
- **Desventajas:** Soporte JSON inferior al de PostgreSQL. Carece de extensiones nativas potentes para IA como pgvector (aunque hay soluciones recientes, están menos maduras).
- **Coste:** Muy bajo.
- **Escalabilidad:** Excelente verticalmente, lectura distribuida fácil mediante réplicas.
- **Justificación:** Buena opción, pero se queda corta frente a PostgreSQL en características avanzadas requeridas por nuestro framework AI (tipos de datos complejos, arrays, vectores).
