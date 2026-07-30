import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { db, newsTable } from '@novanews/database';
import { eq, isNotNull, desc } from 'drizzle-orm';
import { ApiKeyAuthGuard } from '../identity/api-key.guard';

@Controller('distribution')
export class DistributionController {
  
  // Endpoint protegido para que agentes de automatización externos (n8n/Make) consuman los guiones listos
  @UseGuards(ApiKeyAuthGuard)
  @Get('scripts')
  async getReadyScripts() {
    const scripts = await db.select({
      id: newsTable.id,
      title: newsTable.seoTitle,
      publishedAt: newsTable.publishedAt,
      socialScript: newsTable.socialScript,
    })
    .from(newsTable)
    .where(isNotNull(newsTable.socialScript))
    .orderBy(desc(newsTable.publishedAt));

    return { data: scripts };
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get('scripts/:id')
  async getScriptById(@Param('id') id: string) {
    const result = await db.select({
      socialScript: newsTable.socialScript
    })
    .from(newsTable)
    .where(eq(newsTable.id, id));

    return result[0];
  }
}
