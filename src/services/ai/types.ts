export type AIContextItem = {
  module: string;
  label: string;
  detail: string;
};

export type AITask =
  'assistant' | 'recommendations' | 'plant-doctor' | 'diary-analysis';

export type AIConversationTurn = {
  role: 'user' | 'assistant';
  content: string;
};

export type AIImage = {
  /** A validated, compressed image data URL accepted only for Plant Doctor. */
  dataUrl: string;
};

/** Provider-neutral request contract for the secure GreenMind AI route. */
export type AIStreamRequest = {
  input: string;
  context?: AIContextItem[];
  conversationId?: string;
  history?: AIConversationTurn[];
  images?: AIImage[];
  task?: AITask;
};

/** Provider-neutral SSE envelope emitted by /api/ai/respond. */
export type AIStreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'complete'; responseId?: string }
  | { type: 'error'; message: string };
