import { create } from 'zustand';
import { assistantSeedResponse } from '../services/assistantService';
import type { AssistantFeedback, ChatMessage, Conversation } from '../types';

const initialConversations: Conversation[] = [
  {
    id: 'tomato-leaves',
    title: 'Tomato leaves after humid weather',
    updatedAt: 'Today',
    pinned: true,
    favorite: true,
    messages: [
      {
        id: 'tomato-question',
        role: 'user',
        content:
          'My tomato leaves are yellow after the humid weather. What should I check first?',
        createdAt: '09:42',
      },
      {
        id: 'tomato-answer',
        role: 'assistant',
        content: assistantSeedResponse.summary,
        response: assistantSeedResponse,
        createdAt: '09:42',
      },
    ],
  },
  {
    id: 'balcony-plan',
    title: 'Balcony planting plan for July',
    updatedAt: 'Yesterday',
    pinned: true,
    favorite: false,
    messages: [
      {
        id: 'balcony-question',
        role: 'user',
        content: 'Recommend beginner-friendly plants for my balcony.',
        createdAt: '17:20',
      },
      {
        id: 'balcony-answer',
        role: 'assistant',
        content:
          'A balcony plan can balance sunlight, container size, and your available care time.',
        createdAt: '17:20',
      },
    ],
  },
  {
    id: 'basil-care',
    title: 'Keeping basil productive indoors',
    updatedAt: '12 Jul',
    pinned: false,
    favorite: false,
    messages: [],
  },
];

type AssistantState = {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  createConversation: (title: string) => Conversation;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    update: Partial<ChatMessage>,
  ) => void;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  togglePinned: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setFeedback: (
    conversationId: string,
    messageId: string,
    feedback: AssistantFeedback,
  ) => void;
};

/** Session-level AI workspace state; connect this to authenticated conversation storage later. */
export const useAssistantStore = create<AssistantState>((set) => ({
  conversations: initialConversations,
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  createConversation: (title) => {
    const conversation: Conversation = {
      id: `conversation-${Date.now()}`,
      title,
      updatedAt: 'Just now',
      pinned: false,
      favorite: false,
      messages: [],
    };
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: conversation.id,
    }));
    return conversation;
  },
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              updatedAt: 'Just now',
              messages: [...conversation.messages, message],
            }
          : conversation,
      ),
    })),
  updateMessage: (conversationId, messageId, update) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === messageId ? { ...message, ...update } : message,
              ),
            }
          : conversation,
      ),
    })),
  renameConversation: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === id ? { ...conversation, title } : conversation,
      ),
    })),
  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter(
        (conversation) => conversation.id !== id,
      ),
      activeConversationId:
        state.activeConversationId === id ? null : state.activeConversationId,
    })),
  togglePinned: (id) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === id
          ? { ...conversation, pinned: !conversation.pinned }
          : conversation,
      ),
    })),
  toggleFavorite: (id) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === id
          ? { ...conversation, favorite: !conversation.favorite }
          : conversation,
      ),
    })),
  setFeedback: (conversationId, messageId, feedback) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === messageId ? { ...message, feedback } : message,
              ),
            }
          : conversation,
      ),
    })),
}));
