import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { EDITOR_AGENT_PROMPT } from './prompts';
import { ResearchOutput } from './research.agent';

export const EditorOutputSchema = z.object({
  summary: z.string().describe("El resumen final limpio, neutral y estructurado en viñetas HTML o texto plano"),
});

export type EditorOutput = z.infer<typeof EditorOutputSchema>;

@Injectable()
export class EditorAgent {
  private readonly logger = new Logger(EditorAgent.name);

  async execute(ai: GoogleGenAI, title: string, researchData: ResearchOutput): Promise<EditorOutput> {
    this.logger.log(`[EditorAgent] Reescribiendo contenido basado en Research para: ${title}`);

    try {
      const payloadContext = `
Título original: ${title}
Hechos verificados: ${researchData.keyFacts.join(' | ')}
Entidades detectadas: ${researchData.entities.join(', ')}
Contexto base: ${researchData.context}
Sesgo reportado: ${researchData.biasDetected ? "Sí. Neutralizar completamente." : "No."}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `${EDITOR_AGENT_PROMPT}\n\nDatos de Investigación:\n${payloadContext}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING }
            },
            required: ["summary"]
          }
        }
      });

      if (!response.text) throw new Error("Respuesta vacía del modelo Editor.");
      const parsed = JSON.parse(response.text);
      return EditorOutputSchema.parse(parsed);

    } catch (error) {
      this.logger.error(`[EditorAgent] Error al redactar contenido: ${error}`);
      throw error;
    }
  }
}
