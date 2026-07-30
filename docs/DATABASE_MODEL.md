# Modelo Conceptual de Base de Datos (Domain-Driven Design)

Este documento modela las entidades y relaciones independientes de la tecnología subyacente.

## Bounded Contexts

### 1. Identity & Access Context (CoreModule)

- **User (Aggregate Root)**
  - Atributos: ID, Email, HashedPassword, Status, CreatedAt.
  - Entidades de valor: `Role` (Admin, Editor, Reader, PremiumReader), `SubscriptionTier`.
- **UserPreferences (Entity)**
  - Atributos: UserID, PreferredCategories, MutedKeywords, ReadHistory (referencia).

### 2. Editorial Context (NewsModule)

- **Article (Aggregate Root)**
  - Atributos: ID, Slug, OriginalTitle, AITitle, OriginalContent, AIContent, Summary, PublishedAt, Status (Draft, Published, Rejected).
  - Entidades de valor: `Source` (URL, Agencia).
- **Category & Tag (Entities)**
  - Atributos: ID, Name, Slug.
- **FactCheck (Entity)**
  - Atributos: ArticleID, ConfidenceScore, BiasIndicator, SourcesVerified.

### 3. Ingestion Context (IngestionModule)

- **RawFeed (Aggregate Root)**
  - Atributos: ID, SourceURL, RawHTML/JSON, FetchedAt, ProcessedStatus (Pending, Processed, Failed).

### 4. Engagement Context (FeedModule)

- **Interaction (Event/Entity)**
  - Atributos: ID, UserID, ArticleID, InteractionType (View, Like, Bookmark, Share), DurationSeconds, Timestamp.

## Relaciones Principales

- Un `User` tiene un perfil de `UserPreferences`.
- Un `User` realiza múltiples `Interactions` sobre `Articles`.
- Un `Article` proviene de un `RawFeed`.
- Un `Article` tiene una entidad `FactCheck` asociada (1:1).
- Un `Article` tiene múltiples `Tags` y pertenece a múltiples `Categories` (N:M).

## Eventos de Dominio

- `UserRegistered` -> Activa flujo de onboarding de preferencias.
- `RawFeedIngested` -> Activa `AIModule` para procesamiento.
- `ArticleFactChecked` -> Activa publicación automática si `ConfidenceScore > 95%`.
- `ArticlePublished` -> Invalida caché de Redis y notifica a `AutomationModule` para Redes Sociales.
