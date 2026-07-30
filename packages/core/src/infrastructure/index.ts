// Storage
export interface IStorageProvider {
  uploadFile(path: string, buffer: Buffer, mimetype: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
}

// Cache
export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}

// Search
export interface ISearchQuery {
  term: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface ISearchResult<T> {
  hits: T[];
  total: number;
}

export interface ISearchProvider {
  indexDocument<T>(index: string, id: string, document: T): Promise<void>;
  deleteDocument(index: string, id: string): Promise<void>;
  search<T>(index: string, query: ISearchQuery): Promise<ISearchResult<T>>;
}

// Scheduler
export interface IJob {
  id: string;
  name: string;
  payload: any;
}

export interface ISchedulerProvider {
  scheduleJob(jobName: string, payload: any, cronExpression: string): Promise<void>;
  dispatchJob(jobName: string, payload: any, delayMs?: number): Promise<void>;
}
