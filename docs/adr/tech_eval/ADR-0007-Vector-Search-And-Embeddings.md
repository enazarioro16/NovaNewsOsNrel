# ADR-0007: Vector Search, Chunking Strategy and Embeddings Model

## Estado
**Aprobado**

## Contexto
En el Sprint 10 hemos alcanzado la necesidad de implementar el *Semantic Core*. El objetivo es reemplazar la búsqueda relacional simple por la base de lo que será el *Knowledge Graph* y el sistema de búsqueda semántica y de recomendación (Retrieval-Augmented Generation / RAG). Para ello, necesitamos decidir:
1. Qué base de datos vectorial utilizaremos.
2. Qué modelo de embeddings implementaremos.
3. Cuál será nuestra estrategia de partición de datos (Chunking).

## Decisiones

### 1. Base de Datos Vectorial: pgvector (PostgreSQL)
**Alternativas consideradas:** Pinecone, Qdrant, Milvus.
**Decisión:** Utilizar la extensión `pgvector` nativa en nuestra base de datos PostgreSQL actual.
**Justificación:** Mantenemos la simplicidad operativa ("Menos piezas móviles"). Al tener los vectores en la misma base de datos relacional (Drizzle ORM), evitamos problemas de sincronización de estado, consistencia eventual y reducimos el costo de infraestructura del MVP.

### 2. Modelo de Embeddings: text-embedding-004 (Google Gemini)
**Alternativas consideradas:** OpenAI `text-embedding-3-small`, HuggingFace `all-MiniLM-L6-v2`.
**Decisión:** Utilizaremos la API de Google Gemini (`text-embedding-004`), que produce vectores de 768 dimensiones.
**Justificación:** Excelente relación costo/rendimiento, alto límite de tokens por minuto (ideal para ingesta masiva) y soporte nativo en `@google/genai` (SDK que usaremos para la extracción de JSON estructurado).

### 3. Estrategia de Chunking
**Decisión:** En esta fase MVP, **no haremos chunking agresivo**. En su lugar, vectorizaremos únicamente el *Resumen (Summary)* generado por la IA y no el contenido en bruto.
**Justificación:** Un artículo crudo puede tener 2000 palabras, lo que diluye la semántica del vector. Al hacer que el LLM extraiga un resumen altamente denso en información (3 viñetas) junto con `semanticTags`, el embedding resultante captura la esencia exacta de la noticia. Si un resumen excede la ventana óptima en el futuro, aplicaremos *Sentence-level chunking*, pero para el MVP, el resumen completo (aprox. 150 tokens) será 1 Vector.

## Consecuencias
- **Positivas:** Simplifica enormemente la arquitectura al no requerir bases de datos extra. Permite búsquedas relacionales y vectoriales combinadas (Ej. "Noticias similares a este vector filtradas por el tag 'Tecnología'").
- **Negativas:** `pgvector` no escala de la misma forma que una base de datos vectorial distribuida (como Pinecone) si llegamos a cientos de millones de vectores. Será necesario migrar si superamos la escala empresarial.
