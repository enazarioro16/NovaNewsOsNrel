import { Injectable, Logger } from '@nestjs/common';
import { db, newsTable } from '@novanews/database';
import { eq, or, ilike } from 'drizzle-orm';
import * as crypto from 'crypto';

@Injectable()
export class DeduplicationEngine {
  private readonly logger = new Logger(DeduplicationEngine.name);

  /**
   * Evalúa si una noticia ya existe en la base de datos
   * usando Hash, URL exacta, o similitud de Título.
   */
  async isDuplicate(title: string, url: string, content: string): Promise<boolean> {
    const contentHash = crypto.createHash('sha256').update(content).digest('hex');

    // 1. Hard Match (URL o Hash idéntico)
    // 2. Soft Match (Similitud de título rudimentaria vía ILIKE)
    const existing = await db.select({ id: newsTable.id }).from(newsTable).where(
      or(
        eq(newsTable.originalUrl, url),
        ilike(newsTable.title, `%${title.substring(0, 30)}%`) // Placeholder de similitud semántica
      )
    ).limit(1);

    if (existing.length > 0) {
      this.logger.warn(`Duplicado detectado: ${url}`);
      return true;
    }
    return false;
  }
}
