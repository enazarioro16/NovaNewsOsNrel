import { Injectable, Logger } from '@nestjs/common';
import { SourceSelect } from '@novanews/database';

export interface ScoreFactors {
  credibility: number;
  recencyHours: number;
  wordCount: number;
  isTrending: boolean;
}

@Injectable()
export class ScoringEngine {
  private readonly logger = new Logger(ScoringEngine.name);

  /**
   * Calcula el Content Quality Score (0 - 100)
   */
  calculateScore(source: SourceSelect, factors: ScoreFactors): number {
    this.logger.log(`Calculando Score para fuente: ${source.name}`);
    
    let score = 0;
    
    // 1. Reputación de la fuente (Base)
    score += (source.credibilityScore || 0) * 0.4; // 40% peso
    
    // 2. Recencia (Penalizar artículos viejos)
    const recencyPenalty = Math.max(0, 20 - (factors.recencyHours * 2));
    score += recencyPenalty; // Hasta 20 puntos
    
    // 3. Longitud (Penalizar artículos muy cortos que sean probablemente ruido)
    const lengthBonus = factors.wordCount > 300 ? 15 : (factors.wordCount > 100 ? 5 : 0);
    score += lengthBonus; // Hasta 15 puntos
    
    // 4. Trending
    if (factors.isTrending) {
      score += 25; // 25 puntos
    }

    return Math.min(100, Math.max(0, score)); // Normalizar 0-100
  }
}
