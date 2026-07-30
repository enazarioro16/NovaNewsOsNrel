# Diagrama de Dependencias del Core

El `NovaNews OS Core` está diseñado bajo un modelo de **Zero-Coupling Interno**. Todos los submódulos dependen exclusivamente de abstracciones (interfaces) y los tipos primarios (Exceptions y Config).

## Dependencias Direccionales

```mermaid
graph TD
    %% Módulo Base (Nivel 0)
    EXC[Exceptions Core]
    
    %% Módulos de Fundación (Nivel 1)
    CFG[Configuration Core]
    MSG[Messaging Core: Event/Command/Query]
    
    %% Módulos de Infraestructura Abstracta (Nivel 2)
    OBS[Observability: Log/Metrics/Trace/Health]
    INF[Infrastructure: Storage/Cache/Search]
    
    %% Módulos de Negocio Abstracto (Nivel 3)
    ID[Identity & Authorization Core]
    AI[AI Core: LLM/Memory/Prompt]
    WF[Workflow & Notification Core]
    
    %% Módulo Orquestador (Nivel 4)
    KER[Kernel Core: DI/Modules/Plugins]

    %% Relaciones
    CFG --> EXC
    MSG --> EXC
    OBS --> CFG
    OBS --> EXC
    INF --> CFG
    INF --> EXC
    
    ID --> MSG
    ID --> EXC
    AI --> MSG
    AI --> EXC
    WF --> MSG
    WF --> EXC
    
    KER --> CFG
    KER --> OBS
    KER --> MSG
```

## Orden de Implementación
1. **Exceptions Base** (Errores de dominio y sistema).
2. **Configuration Core** (Interfaces de configuración).
3. **Observability Core** (Logging, Health, Metrics).
4. **Messaging Core** (Bus de eventos, comandos y consultas).
5. **Infrastructure Core** (Interfaces de Caché, Storage, Search).
6. **Identity Core** (Usuarios, Roles, Permisos).
7. **AI Core** (Providers, Prompts, Memory).
8. **Workflow & Analytics** (Flujos y Métricas).
9. **Kernel Core** (DI, Loaders).
