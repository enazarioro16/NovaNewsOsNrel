export interface IConfigProvider {
  get<T>(key: string): T;
  getOrThrow<T>(key: string): T;
  has(key: string): boolean;
}

export interface IEnvironmentConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
}
