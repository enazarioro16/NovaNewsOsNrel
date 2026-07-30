import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

export interface AIProcessingResult {
  summary: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  semanticEmbedding: number[];
}

const StructuredOutputSchema = z.object({
  summary: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  tags: z.array(z.string()),
});

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY' });

  async processArticle(title: string, content: string): Promise<AIProcessingResult> {
    this.logger.log(`[Semantic AI] Procesando artículo: ${title}`);
    
    let structuredData: z.infer<typeof StructuredOutputSchema>;
    let embedding: number[] = [];

    // Si no hay API KEY real, usamos el mock para no bloquear las pruebas si el usuario no tiene llave
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_KEY') {
      this.logger.warn('No GEMINI_API_KEY found, using mock implementation for Semantic Core');
      structuredData = {
        summary: `[AI Generated] Resumen de: ${title}. ${content.substring(0, 50)}...`,
        seoTitle: `${title} | NovaNews`,
        seoDescription: `Descubre todo sobre ${title} en NovaNews. Cobertura completa y verificada.`,
        tags: ['technology', 'news', 'ai-curated']
      };
      // Mock 768 vector
      embedding = new Array(768).fill(0.01);
    } else {
      try {
        // 1. Structured Output Generation (Gemini 2.5 Flash)
        const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Eres un editor experto B2C. Genera un resumen (máximo 3 viñetas), un título SEO, una descripción SEO y un arreglo de tags semánticos en formato JSON para la siguiente noticia:\n\nTítulo: ${title}\n\nContenido: ${content}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                summary: { type: "STRING" },
                seoTitle: { type: "STRING" },
                seoDescription: { type: "STRING" },
                tags: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["summary", "seoTitle", "seoDescription", "tags"]
            }
          }
        });

        if (!response.text) throw new Error("Empty response from LLM");
        
        const parsed = JSON.parse(response.text);
        // Validar con Zod
        structuredData = StructuredOutputSchema.parse(parsed);

        // 2. Embedding Generation (text-embedding-004)
        const embedResponse = await this.ai.models.embedContent({
          model: 'text-embedding-004',
          contents: structuredData.summary,
        });

        if (!embedResponse.embeddings || embedResponse.embeddings.length === 0) {
          throw new Error("Failed to generate embedding");
        }

        embedding = embedResponse.embeddings[0].values || new Array(768).fill(0.01);

      } catch (error) {
        this.logger.error(`Error en LLM/Embedding: ${error}`);
        throw error;
      }
    }

    return {
      ...structuredData,
      semanticEmbedding: embedding
    };
  }
}
