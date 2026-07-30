import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ResearchAgent } from './agents/research.agent';
import { EditorAgent } from './agents/editor.agent';
import { SeoAgent } from './agents/seo.agent';

export interface AIProcessingResult {
  summary: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  semanticEmbedding: number[];
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY' });

  constructor(
    private readonly researchAgent: ResearchAgent,
    private readonly editorAgent: EditorAgent,
    private readonly seoAgent: SeoAgent
  ) {}

  async processArticle(title: string, content: string): Promise<AIProcessingResult> {
    this.logger.log(`[Multi-Agent Pipeline] Iniciando procesamiento para: ${title}`);
    
    // Fallback/Mock para dev local sin API Key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MOCK_KEY') {
      this.logger.warn('No GEMINI_API_KEY found, using mock implementation for Multi-Agent Core');
      return {
        summary: `[AI Generated] Resumen de: ${title}. ${content.substring(0, 50)}...`,
        seoTitle: `${title} | NovaNews`,
        seoDescription: `Descubre todo sobre ${title} en NovaNews. Cobertura completa y verificada.`,
        tags: ['technology', 'news', 'ai-curated'],
        semanticEmbedding: new Array(768).fill(0.01)
      };
    }

    try {
      // 1. Research Agent: Extrae hechos y entidades
      this.logger.log(`[Step 1] Invocando ResearchAgent...`);
      const researchData = await this.researchAgent.execute(this.ai, title, content);

      // 2. Editor Agent: Reescribe el artículo basándose en los hechos (Bias-free)
      this.logger.log(`[Step 2] Invocando EditorAgent...`);
      const editorData = await this.editorAgent.execute(this.ai, title, researchData);

      // 3. SEO Agent: Genera metadatos a partir del resumen estructurado
      this.logger.log(`[Step 3] Invocando SeoAgent...`);
      let seoData;
      try {
        seoData = await this.seoAgent.execute(this.ai, editorData.summary);
      } catch (seoError) {
        this.logger.warn(`[Step 3] SeoAgent falló, usando fallback. Error: ${seoError}`);
        seoData = {
          seoTitle: title.substring(0, 60),
          seoDescription: editorData.summary.substring(0, 160),
          tags: researchData.entities.slice(0, 5) // Usar entidades como tags si falla
        };
      }

      // 4. Embedding Generation (text-embedding-004)
      this.logger.log(`[Step 4] Generando Vector Semántico...`);
      let embedding: number[] = new Array(768).fill(0.01);
      try {
        const embedResponse = await this.ai.models.embedContent({
          model: 'text-embedding-004',
          contents: editorData.summary,
        });
        if (embedResponse.embeddings && embedResponse.embeddings.length > 0) {
          embedding = embedResponse.embeddings[0].values || embedding;
        }
      } catch (embedError) {
        this.logger.warn(`[Step 4] Embedding falló, usando vector vacío. Error: ${embedError}`);
      }

      this.logger.log(`[Multi-Agent Pipeline] Procesamiento exitoso.`);
      
      return {
        summary: editorData.summary,
        seoTitle: seoData.seoTitle,
        seoDescription: seoData.seoDescription,
        tags: seoData.tags,
        semanticEmbedding: embedding
      };

    } catch (error) {
      this.logger.error(`[Multi-Agent Pipeline] Fallo Crítico: ${error}`);
      throw error;
    }
  }
}
