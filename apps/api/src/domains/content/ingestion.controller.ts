import { Controller, Post, Body, Headers, UnauthorizedException, Logger, HttpCode } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { z } from 'zod';

const BatchIngestSchema = z.object({
  source: z.object({
    name: z.string(),
    credibilityScore: z.number().optional().default(50),
  }),
  articles: z.array(z.object({
    title: z.string(),
    content: z.string(),
    originalUrl: z.string().url(),
  })).max(10) // Batching preventivo (máx 10 por llamada)
});

@Controller('content/webhook')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);
  
  // En producción, esto vendría de process.env.N8N_WEBHOOK_SECRET
  private readonly WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'n8n_nova_secret_2026';

  constructor(private readonly ingestionService: IngestionService) {}

  @Post('ingest')
  @HttpCode(202) // 202 Accepted (Procesamiento asíncrono)
  async ingestBatch(
    @Headers('x-webhook-secret') secret: string,
    @Body() payload: any
  ) {
    // 1. Blindaje Perimetral (Auth)
    if (!secret || secret !== this.WEBHOOK_SECRET) {
      this.logger.warn(`Intento de inyección no autorizado desde webhook.`);
      throw new UnauthorizedException('Invalid Webhook Secret');
    }

    // 2. Validación de Payload Estricta
    const validationResult = BatchIngestSchema.safeParse(payload);
    if (!validationResult.success) {
      this.logger.error(`Estructura de payload inválida enviada por n8n: ${validationResult.error}`);
      return { success: false, message: 'Invalid payload structure', errors: validationResult.error };
    }

    const { source, articles } = validationResult.data;
    this.logger.log(`Recibiendo batch de ${articles.length} artículos desde ${source.name}`);

    // 3. Control de Flujo (Ejecución asíncrona)
    // No usamos await aquí para liberar la conexión de n8n rápido y evitar Timeouts
    this.ingestionService.ingestBatch(source, articles).catch(err => {
      this.logger.error(`Fallo en el procesamiento asíncrono del Batch: ${err}`);
    });

    return { 
      success: true, 
      message: `Batch aceptado. Procesando ${articles.length} artículos en background.` 
    };
  }
}
