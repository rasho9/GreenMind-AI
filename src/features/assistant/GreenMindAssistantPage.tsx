import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircleMore, Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import {
  AssistantHeader,
  AssistantToolRail,
  AssistantWelcome,
  ChatComposer,
  ChatMessage,
  ConversationSidebar,
  MobileConversationControls,
} from './components';
import { greenMindAssistantService } from './services/assistantService';
import {
  conversationExportService,
  type ConversationExportAction,
} from './services/conversationExportService';
import { smartContextService } from './services/smartContextService';
import { useAssistantStore } from './store/useAssistantStore';
import type {
  ChatMessage as ChatMessageType,
  Conversation,
  SmartContext,
} from './types';

type ComposerAttachment = { name: string; type: string };

function conversationTitle(message: string) {
  const compact = message.replace(/\s+/g, ' ').trim();
  return compact.length > 42 ? `${compact.slice(0, 42).trim()}...` : compact;
}

export function GreenMindAssistantPage() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    createConversation,
    addMessage,
    updateMessage,
    renameConversation,
    deleteConversation,
    togglePinned,
    toggleFavorite,
    setFeedback,
  } = useAssistantStore();
  const [context, setContext] = useState<SmartContext[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [notice, setNotice] = useState('');
  const [searchParams] = useSearchParams();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const consumedPromptRef = useRef<string | null>(null);
  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ),
    [activeConversationId, conversations],
  );

  useEffect(() => {
    void smartContextService.getContext().then(setContext);
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeConversation?.messages.length, isStreaming]);

  const streamResponse = useCallback(
    async (
      conversationId: string,
      prompt: string,
      assistantMessageId: string,
      attachment?: ComposerAttachment,
      history: ChatMessageType[] = [],
    ) => {
      setIsStreaming(true);
      let streamedContent = '';
      try {
        for await (const chunk of greenMindAssistantService.streamResponse({
          message: prompt,
          context,
          attachments: attachment ? [attachment] : undefined,
          history: history
            .filter((message) => !message.isStreaming && message.content.trim())
            .map((message) => ({
              role: message.role,
              content: message.content,
            })),
          conversationId,
        })) {
          if (chunk.type === 'text') {
            streamedContent += chunk.delta;
            updateMessage(conversationId, assistantMessageId, {
              content: streamedContent,
              isStreaming: true,
            });
          } else {
            updateMessage(conversationId, assistantMessageId, {
              content: chunk.response.summary,
              response: chunk.response,
              isStreaming: false,
            });
          }
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'I could not prepare a garden response right now. Please try again.';
        updateMessage(conversationId, assistantMessageId, {
          content: message,
          error: message,
          isStreaming: false,
        });
        setNotice(message);
      } finally {
        setIsStreaming(false);
      }
    },
    [context, updateMessage],
  );

  const sendMessage = useCallback(
    async (prompt: string, attachment?: ComposerAttachment) => {
      const conversation =
        activeConversation ?? createConversation(conversationTitle(prompt));
      const history = activeConversation?.messages ?? [];
      const now = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const userMessage: ChatMessageType = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: attachment
          ? `${prompt}\n\nAttached: ${attachment.name}`
          : prompt,
        createdAt: now,
      };
      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        createdAt: now,
        isStreaming: true,
      };
      setNotice('');
      addMessage(conversation.id, userMessage);
      addMessage(conversation.id, assistantMessage);
      await streamResponse(
        conversation.id,
        prompt,
        assistantMessage.id,
        attachment,
        history,
      );
    },
    [activeConversation, addMessage, createConversation, streamResponse],
  );

  const regenerateResponse = (message: ChatMessageType) => {
    if (!activeConversation || isStreaming) return;
    const messageIndex = activeConversation.messages.findIndex(
      (item) => item.id === message.id,
    );
    const precedingUserMessage = activeConversation.messages
      .slice(0, messageIndex)
      .reverse()
      .find((item) => item.role === 'user');
    if (!precedingUserMessage) return;
    setNotice('Regenerating this answer with your current garden context.');
    updateMessage(activeConversation.id, message.id, {
      content: '',
      response: undefined,
      error: undefined,
      isStreaming: true,
      feedback: undefined,
    });
    void streamResponse(
      activeConversation.id,
      precedingUserMessage.content,
      message.id,
      undefined,
      activeConversation.messages.slice(0, messageIndex),
    );
  };

  const copyMessage = async (message: ChatMessageType) => {
    await navigator.clipboard?.writeText(message.content);
    setNotice('Response copied to your clipboard.');
  };

  const shareMessage = async (message: ChatMessageType) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GreenMind AI guidance',
          text: message.content,
        });
        setNotice('Sharing options opened.');
      } catch {
        setNotice('Sharing was cancelled.');
      }
      return;
    }
    await copyMessage(message);
  };

  const exportConversation = async (
    conversation: Conversation | undefined,
    action: ConversationExportAction = 'export',
  ) => {
    if (!conversation) return;
    setNotice(await conversationExportService.perform(conversation, action));
  };

  const startNewChat = () => {
    setActiveConversation(null);
    setNotice(
      'New conversation ready. Your workspace context remains available.',
    );
  };

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (!prompt || consumedPromptRef.current === prompt) return;
    consumedPromptRef.current = prompt;
    void sendMessage(prompt);
  }, [searchParams, sendMessage]);

  return (
    <div className="pb-3">
      <section className="overflow-hidden rounded-[28px] border border-line bg-surface shadow-elevated">
        <div className="flex min-h-[720px]">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewChat={startNewChat}
            onSelect={setActiveConversation}
            onDelete={deleteConversation}
            onToggleFavorite={toggleFavorite}
          />
          <div className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_55%_0%,rgb(var(--brand-soft)/.45),transparent_27%),rgb(var(--canvas)/.48)]">
            <MobileConversationControls onNewChat={startNewChat} />
            <AssistantHeader
              conversation={activeConversation}
              context={context}
              onRename={(title) =>
                activeConversation &&
                renameConversation(activeConversation.id, title)
              }
              onDelete={() =>
                activeConversation && deleteConversation(activeConversation.id)
              }
              onTogglePinned={() =>
                activeConversation && togglePinned(activeConversation.id)
              }
              onToggleFavorite={() =>
                activeConversation && toggleFavorite(activeConversation.id)
              }
              onExport={() => void exportConversation(activeConversation)}
            />
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 px-4 sm:px-6">
                <AnimatePresence mode="wait">
                  {activeConversation ? (
                    <motion.div
                      key={activeConversation.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mx-auto w-full max-w-4xl space-y-6 py-7 sm:py-9"
                    >
                      {activeConversation.messages.length ? (
                        activeConversation.messages.map((message) => (
                          <ChatMessage
                            key={message.id}
                            message={message}
                            onCopy={(item) => void copyMessage(item)}
                            onShare={(item) => void shareMessage(item)}
                            onRegenerate={regenerateResponse}
                            onFeedback={(messageId, feedback) =>
                              setFeedback(
                                activeConversation.id,
                                messageId,
                                feedback,
                              )
                            }
                            onFollowUp={(prompt) => void sendMessage(prompt)}
                          />
                        ))
                      ) : (
                        <div className="grid min-h-[370px] place-items-center rounded-[22px] border border-dashed border-line bg-surface/55 p-8 text-center">
                          <div>
                            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                              <MessageCircleMore size={22} />
                            </span>
                            <p className="mt-4 text-sm font-extrabold">
                              Start this garden conversation
                            </p>
                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted">
                              Ask about care, disease, a growing plan, or
                              anything in your connected workspace.
                            </p>
                          </div>
                        </div>
                      )}
                      <div ref={messageEndRef} />
                    </motion.div>
                  ) : (
                    <AssistantWelcome
                      key="welcome"
                      onPrompt={(prompt) => void sendMessage(prompt)}
                    />
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {notice && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                    className="mx-4 mb-2 rounded-xl border border-brand/15 bg-brand-soft/45 px-3.5 py-2.5 text-xs font-semibold text-brand-dark sm:mx-6"
                  >
                    {notice}
                  </motion.p>
                )}
              </AnimatePresence>
              <ChatComposer
                isStreaming={isStreaming}
                onSend={sendMessage}
                onVoice={() =>
                  setNotice(
                    'Voice input is prepared as a browser integration point and will be connected in a future release.',
                  )
                }
              />
            </div>
          </div>
          <AssistantToolRail
            context={context}
            onPrompt={(prompt) => void sendMessage(prompt)}
          />
        </div>
      </section>
      <div className="mt-5 flex flex-col gap-3 rounded-[18px] border border-brand/15 bg-brand-soft/34 px-5 py-4 text-xs leading-5 text-brand-dark sm:flex-row sm:items-center">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-surface text-brand shadow-sm">
          <Sparkles size={16} />
        </span>
        <span>
          <b>Live AI is server-routed.</b> Requests stream through the secure
          GreenMind API route with conversation history and selected workspace
          context. If the service is unavailable, GreenMind continues with
          structured local guidance for this demo session.
        </span>
      </div>
    </div>
  );
}
