export type AIContextItem = {
  module: string;
  label: string;
  detail: string;
};

export type OpenAIStreamRequest = {
  input: string;
  context: AIContextItem[];
  conversationId?: string;
  attachment?: { name: string; type: string };
};

export type OpenAIStreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'complete'; responseId?: string }
  | { type: 'error'; message: string };
