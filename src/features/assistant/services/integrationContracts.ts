import type {
  AssistantRequest,
  AssistantStreamChunk,
  SmartContext,
} from '../types';

/** Server-side AI adapter contract. Provider credentials never reach the browser. */
export interface GreenMindAssistantClient {
  streamResponse(
    request: AssistantRequest,
  ): AsyncGenerator<AssistantStreamChunk, void, undefined>;
}

export interface ConversationMemoryClient {
  load(
    conversationId: string,
  ): Promise<Array<{ role: string; content: string }>>;
  save(
    conversationId: string,
    messages: Array<{ role: string; content: string }>,
  ): Promise<void>;
}

export interface AssistantVisionClient {
  analyze(
    image: File,
  ): Promise<{ summary: string; detectedSubjects: string[] }>;
}

export interface AssistantToolClient {
  execute(tool: string, input: Record<string, unknown>): Promise<unknown>;
}

export interface ContextResolver {
  getContext(): Promise<SmartContext[]>;
}

// Streaming, memory, vision, weather, location, and function-calling adapters map to these
// contracts before React receives provider data.
