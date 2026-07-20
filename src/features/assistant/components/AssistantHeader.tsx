import { useState } from 'react';
import {
  Check,
  Download,
  Pencil,
  Pin,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { Conversation, SmartContext } from '../types';

type AssistantHeaderProps = {
  conversation?: Conversation;
  context: SmartContext[];
  onRename: (title: string) => void;
  onDelete: () => void;
  onTogglePinned: () => void;
  onToggleFavorite: () => void;
  onExport: () => void;
};

export function AssistantHeader({
  conversation,
  context,
  onRename,
  onDelete,
  onTogglePinned,
  onToggleFavorite,
  onExport,
}: AssistantHeaderProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(conversation?.title ?? 'New conversation');
  const saveTitle = () => {
    const nextTitle = title.trim();
    if (nextTitle) onRename(nextTitle);
    setIsRenaming(false);
  };
  return (
    <header className="border-b border-line bg-surface/72 px-4 py-3.5 backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-brand-soft text-brand">
              <Sparkles size={14} />
            </span>
            {isRenaming && conversation ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  saveTitle();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  aria-label="Conversation title"
                  className="focus-ring h-8 w-52 rounded-lg border border-brand/35 bg-surface px-2 text-sm font-extrabold outline-none"
                />
                <button
                  type="submit"
                  className="focus-ring rounded-lg p-1.5 text-brand hover:bg-brand-soft"
                  aria-label="Save conversation title"
                >
                  <Check size={15} />
                </button>
              </form>
            ) : (
              <p className="truncate text-sm font-extrabold tracking-[-0.025em]">
                {conversation?.title ?? 'New conversation'}
              </p>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-brand-soft/45 px-2 py-1 text-[10px] font-bold text-brand-dark">
              <span className="size-1.5 rounded-full bg-brand" /> AI status ·
              ready
            </span>
            {context
              .filter((item) => item.active)
              .slice(0, 2)
              .map((item) => (
                <span
                  key={item.module}
                  title={item.detail}
                  className="hidden rounded-full border border-line bg-surface px-2 py-1 text-[10px] font-semibold text-muted sm:inline"
                >
                  {item.module}
                </span>
              ))}
          </div>
        </div>
        {conversation && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => {
                setTitle(conversation.title);
                setIsRenaming((value) => !value);
              }}
              aria-label="Rename conversation"
            >
              <Pencil size={15} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`px-2 ${conversation.pinned ? 'text-brand' : ''}`}
              onClick={onTogglePinned}
              aria-label={
                conversation.pinned ? 'Unpin conversation' : 'Pin conversation'
              }
            >
              <Pin
                size={15}
                fill={conversation.pinned ? 'currentColor' : 'none'}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`px-2 ${conversation.favorite ? 'text-[#d18b45]' : ''}`}
              onClick={onToggleFavorite}
              aria-label={
                conversation.favorite
                  ? 'Remove conversation from favorites'
                  : 'Favorite conversation'
              }
            >
              <Star
                size={15}
                fill={conversation.favorite ? 'currentColor' : 'none'}
              />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={onExport}
              aria-label="Export conversation"
            >
              <Download size={15} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2 hover:text-[#bd5548]"
              onClick={onDelete}
              aria-label="Delete conversation"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
