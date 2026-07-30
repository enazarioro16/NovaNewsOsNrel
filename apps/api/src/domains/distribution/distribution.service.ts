import { Injectable, Logger } from '@nestjs/common';
import { db, newsTable } from '@novanews/database';
import { eq } from 'drizzle-orm';
import { GoogleGenAI } from '@google/genai';
import { ShortVideoScript } from './interfaces';
import { z } from 'zod';

const ScriptSchema = z.object({
  hook: z.string(),
  body: z.string(),
  callToAction: z.string(),
  hashtags: z.array(z.string()),
});

@Injectable()
export class DistributionService {
  private readonly logger = new Logger(DistributionService.name);
  private readonly ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY' });

  async generateAndSaveScript(newsId: string): Promise<void> {
    this.logger.log(`[Distribution] Iniciando generación de guion para noticia: ${newsId}`);
    
    const [news] = await db.select().from(newsTable).where(eq(newsTable.id, newsId));
    if (!news) throw new Error('Noticia no encontrada');

    let scriptData: ShortVideoScript;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_KEY') {
      this.logger.warn('[Distribution] Usando AI Mock para Guion');
      scriptData = {
        hook: `¡Atención! ${news.seoTitle}`,
        body: news.summary || '',
        callToAction: 'Dale like y síguenos para más noticias.',
        hashtags: ['#noticias', '#novanews']
      };
    } else {
      try {
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Eres un creador de contenido viral para TikTok/Reels. Crea un guion de 30 segundos basado en la siguiente noticia:\n\nTítulo: ${news.seoTitle}\nResumen: ${news.summary}\n\nGenera un JSON con "hook" (gancho inicial de 3 segundos), "body" (desarrollo), "callToAction" (despedida y llamada a acción) y "hashtags" (array de tags).`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                hook: { type: "STRING" },
                body: { type: "STRING" },
                callToAction: { type: "STRING" },
                hashtags: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["hook", "body", "callToAction", "hashtags"]
            }
          }
        });

        if (!response.text) throw new Error("Empty response from LLM");
        const parsed = JSON.parse(response.text);
        scriptData = ScriptSchema.parse(parsed);

      } catch (error) {
        this.logger.error(`Error generando guion: ${error}`);
        throw error;
      }
    }

    // Guardar en base de datos
    await db.update(newsTable)
      .set({ socialScript: scriptData })
      .where(eq(newsTable.id, newsId));

    this.logger.log(`[Distribution] Guion generado y guardado para ${newsId}`);
  }
}
