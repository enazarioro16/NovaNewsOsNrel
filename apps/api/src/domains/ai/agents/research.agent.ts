import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { RESEARCH_AGENT_PROMPT } from './prompts';

export const ResearchOutputSchema = z.object({
  entities: z.array(z.string()).describe("Lista de entidades clave (personas, empresas, lugares)"),
  keyFacts: z.array(z.string()).describe("Lista de los hechos fundamentales y verificables"),
  biasDetected: z.boolean().describe("¿Se detecta algún sesgo fuerte o lenguaje sensacionalista?"),
  context: z.string().describe("Contexto breve del artículo para ayudar al editor"),
});

export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;

@Injectable()
export class ResearchAgent {
  private readonly logger = new Logger(ResearchAgent.name);

  async execute(ai: GoogleGenAI, title: string, content: string): Promise<ResearchOutput> {
    this.logger.log(`[ResearchAgent] Analizando: ${title}`);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${RESEARCH_AGENT_PROMPT}\n\nTítulo: ${title}\nContenido original: ${content}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              entities: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
              biasDetected: { type: Type.BOOLEAN },
              context: { type: Type.STRING }
            },
            required: ["entities", "keyFacts", "biasDetected", "context"]
          }
        }
      });

      if (!response.text) throw new Error("Respuesta vacía del modelo Research.");
      const parsed = JSON.parse(response.text);
      return ResearchOutputSchema.parse(parsed);

    } catch (error) {
      this.logger.error(`[ResearchAgent] Error al analizar contenido: ${error}`);
      throw error;
    }
  }
}
