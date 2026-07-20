export type AIContextItem = {
  module: string;
  label: string;
  detail: string;
};

export type OpenAITask =
  | 'assistant'
  | 'recommendations'
  | 'plant-doctor'
  | 'diary-analysis';

export type OpenAIConversationTurn = {
  role: 'user' | 'assistant';
  content: string;
};

export type OpenAIImage = {
  /** A validated, compressed image data URL. It is only accepted for Plant Doctor. */
  dataUrl: string;
};

export type OpenAIStreamRequest = {
  input: string;
  context?: AIContextItem[];
  conversationId?: string;
  history?: OpenAIConversationTurn[];
  images?: OpenAIImage[];
  task?: OpenAITask;
};

export type OpenAIStreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'complete'; responseId?: string }
  | { type: 'error'; message: string };
