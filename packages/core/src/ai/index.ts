// LLM Provider
export interface ILLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ILLMResponse {
  content: string;
  tokensUsed: number;
  model: string;
}

export interface ILLMProvider {
  generateText(messages: ILLMMessage[], model?: string, temperature?: number): Promise<ILLMResponse>;
}

// Knowledge & Vector Memory
export interface IEmbedding {
  vector: number[];
  dimensions: number;
}

export interface IVectorStore {
  saveEmbedding(id: string, embedding: IEmbedding, metadata?: any): Promise<void>;
  searchSimilar(embedding: IEmbedding, limit?: number): Promise<Array<{ id: string; score: number; metadata: any }>>;
}

export interface IKnowledgeCore {
  vectorizeText(text: string): Promise<IEmbedding>;
  queryKnowledgeBase(query: string, limit?: number): Promise<any[]>;
}

// Prompt Management
export interface IPromptTemplate {
  name: string;
  template: string;
  version: number;
}

export interface IPromptManager {
  getPrompt(name: string, variables: Record<string, string>): Promise<string>;
}
