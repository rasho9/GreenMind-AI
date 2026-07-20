import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Heart,
  MessageSquarePlus,
  Pin,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Button, EmptyState } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Conversation } from '../types';

type ConversationSidebarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

function ConversationList({
  label,
  conversations,
  activeConversationId,
  onSelect,
  onDelete,
  onToggleFavorite,
}: Omit<ConversationSidebarProps, 'onNewChat'> & { label: string }) {
  if (!conversations.length) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <div className="space-y-1">
        {conversations.map((conversation) => {
          const active = conversation.id === activeConversationId;
          return (
            <div key={conversation.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={cn(
                  'focus-ring w-full rounded-xl px-3 py-2.5 pr-14 text-left transition-all',
                  active
                    ? 'bg-brand text-white shadow-[0_7px_17px_rgb(34_121_81_/_0.15)]'
                    : 'text-ink hover:bg-brand-soft/60',
                )}
              >
                <p className="truncate text-xs font-bold">
                  {conversation.title}
                </p>
                <p
                  className={`mt-1 text-[10px] ${active ? 'text-white/62' : 'text-muted'}`}
                >
                  {conversation.updatedAt} ·{' '}
                  {conversation.messages.length || 'New'} messages
                </p>
              </button>
              <div
                className={`absolute right-2 top-1/2 flex -translate-y-1/2 gap-0.5 ${active ? 'text-white/70' : 'text-muted opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100'}`}
              >
                <button
                  type="button"
                  className="focus-ring rounded-md p-1 hover:bg-black/10"
                  aria-label={
                    conversation.favorite
                      ? 'Remove conversation from favorites'
                      : 'Favorite conversation'
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(conversation.id);
                  }}
                >
                  <Heart
                    size={13}
                    fill={conversation.favorite ? 'currentColor' : 'none'}
                  />
                </button>
                <button
                  type="button"
                  className="focus-ring rounded-md p-1 hover:bg-black/10"
                  aria-label="Delete conversation"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(conversation.id);
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelect,
  onDelete,
  onToggleFavorite,
}: ConversationSidebarProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [conversations, query],
  );
  const pinned = filtered.filter((conversation) => conversation.pinned);
  const recent = filtered.filter((conversation) => !conversation.pinned);
  return (
    <aside className="hidden w-[270px] shrink-0 flex-col border-r border-line bg-surface/65 p-4 xl:flex">
      <Button
        type="button"
        onClick={onNewChat}
        leftIcon={<MessageSquarePlus size={17} />}
        className="w-full justify-start"
      >
        New chat
      </Button>
      <label className="focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 mt-4 flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-muted transition-all">
        <Search size={15} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search conversations"
          className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-muted/70"
          aria-label="Search conversations"
        />
      </label>
      <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
        <ConversationList
          label="Pinned"
          conversations={pinned}
          activeConversationId={activeConversationId}
          onSelect={onSelect}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
        <ConversationList
          label="Recent chats"
          conversations={recent}
          activeConversationId={activeConversationId}
          onSelect={onSelect}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
        />
        <AnimatePresence>
          {!filtered.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <EmptyState
                icon={<Sparkles size={20} />}
                title={conversations.length ? 'No chats found' : 'No chats yet'}
                description={
                  conversations.length
                    ? 'Try a different conversation title.'
                    : 'Start your first AI conversation.'
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-4 rounded-[17px] border border-brand/15 bg-brand-soft/40 p-3.5">
        <div className="flex items-center gap-2 text-xs font-extrabold text-brand-dark">
          <span className="grid size-6 place-items-center rounded-lg bg-surface text-brand shadow-sm">
            <Sparkles size={13} />
          </span>{' '}
          Context is ready
        </div>
        <p className="mt-2 text-[11px] leading-5 text-muted">
          Your garden signals can be included in the next answer.
        </p>
      </div>
    </aside>
  );
}

export function MobileConversationControls({
  onNewChat,
}: Pick<ConversationSidebarProps, 'onNewChat'>) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-surface/60 px-4 py-3 xl:hidden">
      <div className="flex items-center gap-2 text-xs font-bold text-brand-dark">
        <Pin size={14} className="text-brand" /> AI workspace
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onNewChat}
        leftIcon={<MessageSquarePlus size={15} />}
      >
        New chat
      </Button>
    </div>
  );
}
