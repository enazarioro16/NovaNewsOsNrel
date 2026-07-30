// Logging
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface ILogger {
  log(level: LogLevel, message: string, meta?: Record<string, any>): void;
  info(message: string, meta?: Record<string, any>): void;
  error(message: string, trace?: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}

// Observability & Metrics
export interface IMetricProvider {
  incrementCounter(name: string, value?: number, tags?: Record<string, string>): void;
  recordHistogram(name: string, value: number, tags?: Record<string, string>): void;
}

// Health Check
export interface HealthIndicatorResult {
  status: 'up' | 'down';
  details?: Record<string, any>;
}

export interface IHealthIndicator {
  name: string;
  check(): Promise<HealthIndicatorResult>;
}

// Audit
export interface IAuditLogger {
  logAction(userId: string, action: string, resource: string, metadata?: any): Promise<void>;
}
