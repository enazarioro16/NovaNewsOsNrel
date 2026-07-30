import { ILogger } from '../observability';

export interface IDependencyInjectionContainer {
  resolve<T>(identifier: string | symbol): T;
  register<T>(identifier: string | symbol, instance: T): void;
}

export interface IPluginContext {
  diContainer: IDependencyInjectionContainer;
  logger: ILogger;
}

export interface IPlugin {
  name: string;
  version: string;
  initialize(context: IPluginContext): Promise<void>;
  teardown(): Promise<void>;
}

export interface IPluginLoader {
  loadPlugin(plugin: IPlugin): Promise<void>;
  unloadPlugin(name: string): Promise<void>;
  getLoadedPlugins(): IPlugin[];
}

export interface IModuleLoader {
  bootstrap(): Promise<void>;
  shutdown(): Promise<void>;
}
