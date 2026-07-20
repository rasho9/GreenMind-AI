import type {
  AssistantRequest,
  AssistantStreamChunk,
  SmartContext,
} from '../types';

/** Server-side GPT-5.6 adapter contract. Do not expose provider credentials to the browser. */
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

// Planned adapters: OpenAI GPT-5.6, streaming, conversation memory, vision, weather, location,
// and function calling. Each adapter maps to the types above before React receives its result.
