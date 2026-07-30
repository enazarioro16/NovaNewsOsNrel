import { NewsEntity } from './news.entity';

export const INewsRepositoryToken = Symbol('INewsRepository');

export interface INewsRepository {
  findById(id: string): Promise<NewsEntity | null>;
  findAll(): Promise<NewsEntity[]>;
  create(news: Partial<NewsEntity>): Promise<NewsEntity>;
  update(id: string, news: Partial<NewsEntity>): Promise<NewsEntity | null>;
  delete(id: string): Promise<boolean>;
}
