import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { SEO_AGENT_PROMPT } from './prompts';
import { EditorOutput } from './editor.agent';

export const SeoOutputSchema = z.object({
  seoTitle: z.string().describe("Título optimizado para motores de búsqueda (máx 60 caracteres)"),
  seoDescription: z.string().describe("Descripción optimizada (máx 160 caracteres)"),
  tags: z.array(z.string()).describe("Lista de tags semánticos (máximo 5)"),
});

export type SeoOutput = z.infer<typeof SeoOutputSchema>;

@Injectable()
export class SeoAgent {
  private readonly logger = new Logger(SeoAgent.name);

  async execute(ai: GoogleGenAI, summary: string): Promise<SeoOutput> {
    this.logger.log(`[SeoAgent] Generando metadatos para el nuevo resumen.`);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${SEO_AGENT_PROMPT}\n\nResumen a optimizar:\n${summary}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              seoTitle: { type: Type.STRING },
              seoDescription: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["seoTitle", "seoDescription", "tags"]
          }
        }
      });

      if (!response.text) throw new Error("Respuesta vacía del modelo SEO.");
      const parsed = JSON.parse(response.text);
      return SeoOutputSchema.parse(parsed);

    } catch (error) {
      this.logger.error(`[SeoAgent] Error al generar metadatos: ${error}`);
      throw error;
    }
  }
}
