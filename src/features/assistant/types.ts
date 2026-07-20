import type { LucideIcon } from 'lucide-react';

export type AssistantRole = 'user' | 'assistant';
export type AssistantFeedback = 'like' | 'dislike';

export type ContextModule =
  | 'Plant Recommendations'
  | 'Plant Library'
  | 'Plant Doctor'
  | 'Weather'
  | 'Garden Diary'
  | 'Tasks'
  | 'Profile'
  | 'AI Marketplace';

export type SmartContext = {
  module: ContextModule;
  label: string;
  detail: string;
  active: boolean;
};

export type AssistantTable = {
  caption: string;
  columns: string[];
  rows: string[][];
};

export type AssistantCodeBlock = {
  language: string;
  code: string;
};

/**
 * A provider-neutral assistant result produced from the server-routed Responses API stream.
 */
export type AssistantResponse = {
  summary: string;
  detailedExplanation: string[];
  quickTips: string[];
  warnings: string[];
  recommendedActions: string[];
  relatedPlants: string[];
  sources: Array<{ label: string; detail: string }>;
  confidence?: number;
  followUps: string[];
  table?: AssistantTable;
  codeBlock?: AssistantCodeBlock;
};

export type ChatMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: string;
  response?: AssistantResponse;
  isStreaming?: boolean;
  error?: string;
  feedback?: AssistantFeedback;
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: string;
  pinned: boolean;
  favorite: boolean;
  messages: ChatMessage[];
};

export type AssistantRequest = {
  message: string;
  context: SmartContext[];
  attachments?: Array<{ name: string; type: string }>;
  history?: Array<{ role: AssistantRole; content: string }>;
  conversationId: string;
};

export type AssistantStreamChunk =
  | { type: 'text'; delta: string }
  | { type: 'complete'; response: AssistantResponse };

export type AssistantTool = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  context: ContextModule;
  prompt: string;
};
