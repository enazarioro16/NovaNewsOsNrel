export interface IFactCheckProvider {
  /**
   * Verifica la factualidad de un contenido contra una base de conocimiento confiable.
   * Por ahora es solo un contrato. No se implementa en Sprint 6.
   */
  verifyClaims(content: string): Promise<FactCheckResult>;
}

export interface FactCheckResult {
  isVerified: boolean;
  confidence: number;
  falseClaimsFound: string[];
  sourcesReferenced: string[];
}
