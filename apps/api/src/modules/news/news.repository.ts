import { Injectable } from '@nestjs/common';
import { INewsRepository } from './news.repository.interface';
import { NewsEntity } from './news.entity';
import { db, newsTable } from '@novanews/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class NewsRepository implements INewsRepository {
  async findById(id: string): Promise<NewsEntity | null> {
    const result = await db.select().from(newsTable).where(eq(newsTable.id, id));
    if (!result.length) return null;
    const item = result[0];
    return new NewsEntity(item.id, item.title, item.content, item.pipelineStatus as any, item.createdAt, item.updatedAt);
  }

  async findAll(): Promise<NewsEntity[]> {
    const result = await db.select().from(newsTable);
    return result.map((item: any) => new NewsEntity(item.id, item.title, item.content, item.pipelineStatus as any, item.createdAt, item.updatedAt));
  }

  async create(news: Partial<NewsEntity>): Promise<NewsEntity> {
    const result = await db.insert(newsTable).values({
      title: news.title!,
      content: news.content!,
      pipelineStatus: news.status || 'DRAFT'
    }).returning();
    const item = result[0];
    return new NewsEntity(item.id, item.title, item.content, item.pipelineStatus as any, item.createdAt, item.updatedAt);
  }

  async update(id: string, news: Partial<NewsEntity>): Promise<NewsEntity | null> {
    const result = await db.update(newsTable).set({
      title: news.title,
      content: news.content,
      pipelineStatus: news.status,
      updatedAt: new Date()
    }).where(eq(newsTable.id, id)).returning();
    if (!result.length) return null;
    const item = result[0];
    return new NewsEntity(item.id, item.title, item.content, item.pipelineStatus as any, item.createdAt, item.updatedAt);
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(newsTable).where(eq(newsTable.id, id)).returning();
    return result.length > 0;
  }
}
