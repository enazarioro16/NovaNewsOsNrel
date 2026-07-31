import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

export interface FactCheckResult {
  score: number;
  reasoning: string;
  flaggedClaims: string[];
}

@Injectable()
export class FactCheckerAgent {
  private readonly logger = new Logger(FactCheckerAgent.name);

  constructor(private readonly configService: ConfigService) {}

  async execute(ai: GoogleGenAI, title: string, content: string): Promise<FactCheckResult> {
    try {
      this.logger.log(`Iniciando validación de hechos (Grounding) para: ${title}`);
      
      const prompt = `
        Eres un verificador de hechos (Fact-Checker) implacable para una agencia de noticias.
        Tu tarea es analizar el siguiente artículo y asignar un puntaje de veracidad (0 a 100).
        Busca alucinaciones, datos sin sustento, o afirmaciones dudosas.
        
        TÍTULO: ${title}
        CONTENIDO: ${content}
        
        Devuelve estrictamente un objeto JSON con esta estructura:
        {
          "score": 85,
          "reasoning": "Breve explicación de por qué asignaste ese puntaje.",
          "flaggedClaims": ["Afirmación dudosa 1", "Afirmación dudosa 2"]
        }
      `;

      // Idealmente aquí usaríamos Google Search Grounding si estuviera habilitado en el SDK:
      // tools: [{ googleSearch: {} }]
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Baja temperatura para análisis objetivo
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Respuesta vacía del FactCheckerAgent');
      }

      return JSON.parse(text) as FactCheckResult;
    } catch (error) {
      this.logger.error(`Error en FactCheckerAgent: ${error}`);
      // Fallback seguro: Si falla el agente, asumimos puntaje bajo para forzar revisión humana
      return {
        score: 50,
        reasoning: 'Error interno en la validación de hechos. Requiere revisión humana.',
        flaggedClaims: ['Validación automática fallida.'],
      };
    }
  }
}
