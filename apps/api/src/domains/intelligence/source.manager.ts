import { Injectable, Logger } from '@nestjs/common';
import { db, sourceTable } from '@novanews/database';

@Injectable()
export class SourceManager {
  private readonly logger = new Logger(SourceManager.name);

  async registerMockSource() {
    this.logger.log('Registrando fuente mock...');
    const [source] = await db.insert(sourceTable).values({
      name: 'HackerNews Premium Feed',
      type: 'RSS',
      language: 'en',
      category: 'Technology',
      credibilityScore: 95, // Fuente de alta credibilidad
      priority: 1,
    }).returning();
    
    return source;
  }

  async getActiveSources() {
    return db.select().from(sourceTable);
  }
}
