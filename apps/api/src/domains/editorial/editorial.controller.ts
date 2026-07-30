import { Controller, Post, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { IngestionService } from '../content/ingestion.service';
import { DistributionService } from '../distribution/distribution.service';
import { db, newsTable } from '@novanews/database';
import { eq, desc } from 'drizzle-orm';
import { JwtAuthGuard } from '../identity/identity.guard';

@UseGuards(JwtAuthGuard)
@Controller('editorial')
export class EditorialController {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly distributionService: DistributionService
  ) {}

  // Trigger manual del pipeline para testing
  @Post('trigger-ingestion')
  async trigger() {
    return this.ingestionService.ingestMockSource();
  }

  // Listar noticias para el CMS
  @Get('news')
  async listNews() {
    return db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
  }

  @Put('news/:id/publish')
  async publishNews(@Param('id') id: string) {
    await db.update(newsTable).set({
      pipelineStatus: 'PUBLISHED',
      publishedAt: new Date(),
    }).where(eq(newsTable.id, id));
    
    // Disparar motor de distribución automáticamente en el background
    this.distributionService.generateAndSaveScript(id).catch(err => {
      console.error(`Error en distribucion post-publish:`, err);
    });

    return { success: true };
  }

  // Rechazar
  @Put('news/:id/reject')
  async rejectNews(@Param('id') id: string) {
    await db.update(newsTable).set({
      pipelineStatus: 'REJECTED'
    }).where(eq(newsTable.id, id));
    return { success: true };
  }

  // Obtener por ID
  @Get('news/:id')
  async getNewsById(@Param('id') id: string) {
    const result = await db.select().from(newsTable).where(eq(newsTable.id, id));
    return result[0];
  }

  @Put('news/:id')
  async updateAndPublish(@Param('id') id: string, @Body() data: any) {
    await db.update(newsTable).set({
      seoTitle: data.seoTitle,
      summary: data.summary,
      tags: data.tags,
      pipelineStatus: 'PUBLISHED',
      publishedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(newsTable.id, id));
    
    // Disparar motor de distribución
    this.distributionService.generateAndSaveScript(id).catch(err => {
      console.error(`Error en distribucion post-publish:`, err);
    });

    return { success: true };
  }
}
