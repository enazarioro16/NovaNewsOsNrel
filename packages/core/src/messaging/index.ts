// Event Bus
export interface IEvent {
  eventName: string;
  occurredOn: Date;
}

export interface IEventHandler<T extends IEvent> {
  handle(event: T): Promise<void>;
}

export interface IEventBus {
  publish<T extends IEvent>(event: T): Promise<void>;
  publishAll(events: IEvent[]): Promise<void>;
  subscribe<T extends IEvent>(eventName: string, handler: IEventHandler<T>): void;
}

// Command Bus
export interface ICommand {
  commandName: string;
}

export interface ICommandHandler<T extends ICommand, R = void> {
  execute(command: T): Promise<R>;
}

export interface ICommandBus {
  execute<T extends ICommand, R = void>(command: T): Promise<R>;
  register<T extends ICommand>(commandName: string, handler: ICommandHandler<T, any>): void;
}

// Query Bus
export interface IQuery {
  queryName: string;
}

export interface IQueryHandler<T extends IQuery, R> {
  ask(query: T): Promise<R>;
}

export interface IQueryBus {
  ask<T extends IQuery, R>(query: T): Promise<R>;
  register<T extends IQuery>(queryName: string, handler: IQueryHandler<T, any>): void;
}
