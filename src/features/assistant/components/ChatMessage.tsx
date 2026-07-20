import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  ListChecks,
  RotateCcw,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import type {
  AssistantFeedback,
  ChatMessage as ChatMessageType,
} from '../types';

type ChatMessageProps = {
  message: ChatMessageType;
  onCopy: (message: ChatMessageType) => void;
  onShare: (message: ChatMessageType) => void;
  onRegenerate: (message: ChatMessageType) => void;
  onFeedback: (messageId: string, feedback: AssistantFeedback) => void;
  onFollowUp: (prompt: string) => void;
};

function BulletList({
  items,
  icon: Icon = CheckCircle2,
  tone = 'brand',
}: {
  items: string[];
  icon?: typeof CheckCircle2;
  tone?: 'brand' | 'warning';
}) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-xs leading-5 text-muted">
          <Icon
            size={15}
            className={cn(
              'mt-0.5 shrink-0',
              tone === 'warning' ? 'text-[#bb7b29]' : 'text-brand',
            )}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function AssistantResponseCard({
  message,
  onCopy,
  onShare,
  onRegenerate,
  onFeedback,
  onFollowUp,
}: Omit<ChatMessageProps, 'message'> & { message: ChatMessageType }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const response = message.response;
  if (!response) {
    return (
      <div className="rounded-[20px] border border-line bg-surface p-4 text-sm leading-6 text-ink shadow-card">
        {message.content}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-card">
      <div className="border-b border-line bg-[linear-gradient(110deg,rgb(var(--surface)),rgb(var(--brand-soft)/.42))] px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-[11px] bg-brand text-white shadow-[0_7px_17px_rgb(34_121_81_/_0.18)]">
              <Sparkles size={15} />
            </span>
            <div>
              <p className="text-xs font-extrabold">GreenMind AI</p>
              <p className="mt-0.5 text-[10px] text-muted">
                Context-aware garden guidance
              </p>
            </div>
          </div>
          {typeof response.confidence === 'number' && (
            <Badge className="bg-brand-soft/70 text-brand-dark">
              {response.confidence}% confidence
            </Badge>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-[15px] font-semibold leading-7 text-ink">
          {message.content}
        </p>
        {response.detailedExplanation.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            className="focus-ring mt-5 flex w-full items-center justify-between rounded-xl border border-line bg-canvas/52 px-3 py-2.5 text-left text-xs font-extrabold text-ink hover:border-brand/25 hover:bg-brand-soft/38"
          >
            <span>Detailed explanation</span>
            <ChevronDown
              size={15}
              className={cn('transition-transform', isExpanded && 'rotate-180')}
            />
          </button>
        )}
        {isExpanded && response.detailedExplanation.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 px-1 pb-1 pt-4"
          >
            {response.detailedExplanation.map((paragraph) => (
              <p key={paragraph} className="text-xs leading-6 text-muted">
                {paragraph}
              </p>
            ))}
          </motion.div>
        )}
        {response.table && (
          <div className="mt-5 overflow-hidden rounded-[17px] border border-line">
            <p className="border-b border-line bg-canvas/55 px-3.5 py-2.5 text-[11px] font-extrabold text-ink">
              {response.table.caption}
            </p>
            <div className="overflow-x-auto">
              <table className="data-table w-full min-w-[450px] text-left text-[11px]">
                <thead className="bg-surface text-muted">
                  <tr>
                    {response.table.columns.map((column) => (
                      <th key={column} className="px-3.5 py-2.5 font-bold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {response.table.rows.map((row) => (
                    <tr key={row.join('-')} className="border-t border-line/70">
                      {row.map((cell) => (
                        <td
                          key={cell}
                          className="px-3.5 py-2.5 leading-5 text-ink/80"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {response.codeBlock && (
          <div className="mt-5 overflow-hidden rounded-[17px] border border-[#294839] bg-[#163625]">
            <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2 text-[10px] font-bold text-[#b9ddc4]">
              <span>{response.codeBlock.language}</span>
              <span>Care note template</span>
            </div>
            <pre className="overflow-x-auto p-3.5 font-mono text-[11px] leading-5 text-[#e0f5e6]">
              <code>{response.codeBlock.code}</code>
            </pre>
          </div>
        )}
        {(response.quickTips.length > 0 || response.warnings.length > 0) && (
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {response.quickTips.length > 0 && (
              <div className="rounded-[17px] border border-line bg-canvas/46 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-extrabold">
              <Sparkles size={14} className="text-brand" /> Quick tips
            </p>
            <div className="mt-3">
              <BulletList items={response.quickTips} />
            </div>
              </div>
            )}
            {response.warnings.length > 0 && (
              <div className="rounded-[17px] border border-[#eddeb9] bg-[#fffaf0] p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-extrabold text-[#95651f]">
              <AlertTriangle size={14} /> Watch-outs
            </p>
            <div className="mt-3">
              <BulletList
                items={response.warnings}
                icon={AlertTriangle}
                tone="warning"
              />
            </div>
              </div>
            )}
          </div>
        )}
        {response.recommendedActions.length > 0 && (
          <div className="mt-5 rounded-[17px] border border-brand/15 bg-brand-soft/34 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-brand-dark">
            <ListChecks size={15} /> Recommended actions
          </p>
          <div className="mt-3">
            <BulletList items={response.recommendedActions} />
          </div>
          </div>
        )}
        {(response.relatedPlants.length > 0 || response.sources.length > 0) && (
          <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-end sm:justify-between">
          {response.relatedPlants.length > 0 && <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Related plants
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {response.relatedPlants.map((plant) => (
                <span
                  key={plant}
                  className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[11px] font-semibold text-brand-dark"
                >
                  {plant}
                </span>
              ))}
            </div>
          </div>}
          {response.sources.length > 0 && <div className="sm:max-w-[230px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              Sources
            </p>
            <div className="mt-2 space-y-1">
              {response.sources.map((source) => (
                <p
                  key={source.label}
                  className="flex gap-1.5 text-[10px] leading-4 text-muted"
                >
                  <BookOpen size={12} className="mt-0.5 shrink-0 text-brand" />
                  <span>
                    <b className="text-ink">{source.label}</b> · {source.detail}
                  </span>
                </p>
              ))}
            </div>
          </div>}
        </div>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="px-2"
              aria-label="Copy response"
              onClick={() => onCopy(message)}
            >
              <Clipboard size={15} />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="px-2"
              aria-label="Regenerate response"
              onClick={() => onRegenerate(message)}
            >
              <RotateCcw size={15} />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn(
                'px-2',
                message.feedback === 'like' && 'text-brand',
              )}
              aria-label="Like response"
              onClick={() => onFeedback(message.id, 'like')}
            >
              <ThumbsUp
                size={15}
                fill={message.feedback === 'like' ? 'currentColor' : 'none'}
              />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn(
                'px-2',
                message.feedback === 'dislike' && 'text-[#bd5548]',
              )}
              aria-label="Dislike response"
              onClick={() => onFeedback(message.id, 'dislike')}
            >
              <ThumbsDown
                size={15}
                fill={message.feedback === 'dislike' ? 'currentColor' : 'none'}
              />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="px-2"
              aria-label="Share response"
              onClick={() => onShare(message)}
            >
              <Share2 size={15} />
            </Button>
          </div>
          <p className="text-[10px] font-semibold text-muted">
            {message.createdAt}
          </p>
        </div>
      </div>
      {response.followUps.length > 0 && <div className="border-t border-line bg-canvas/45 px-4 py-3 sm:px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
          Continue the conversation
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {response.followUps.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onFollowUp(prompt)}
              className="focus-ring rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:border-brand/30 hover:bg-brand-soft hover:text-brand-dark"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>}
    </div>
  );
}

export function ChatMessage({ message, ...handlers }: ChatMessageProps) {
  if (message.role === 'user') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="ml-auto max-w-[84%] sm:max-w-[70%]"
      >
        <div className="rounded-[20px] rounded-br-md bg-[#1a4b32] px-4 py-3 text-sm leading-6 text-white shadow-[0_9px_20px_rgb(20_65_43_/_0.15)]">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="mt-1.5 pr-1 text-right text-[10px] font-medium text-muted">
          You · {message.createdAt}
        </p>
      </motion.article>
    );
  }
  if (message.error) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
        role="alert"
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-danger/10 text-danger">
            <AlertTriangle size={13} />
          </span>
          <p className="text-[11px] font-extrabold text-danger">GreenMind AI unavailable</p>
        </div>
        <div className="rounded-[20px] border border-danger/25 bg-danger/5 p-4 text-sm leading-6 text-ink shadow-card">
          {message.error}
        </div>
      </motion.article>
    );
  }
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-lg bg-brand-soft text-brand">
          <Sparkles size={13} />
        </span>
        <p className="text-[11px] font-extrabold text-brand-dark">
          GreenMind AI
        </p>
      </div>
      {message.isStreaming ? (
        <div className="rounded-[20px] border border-line bg-surface p-4 shadow-card">
          <p className="text-sm leading-6 text-ink">
            {message.content}
            <span className="ml-1 inline-flex gap-0.5 align-middle">
              <i className="size-1 rounded-full bg-brand animate-bounce" />
              <i className="size-1 rounded-full bg-brand animate-bounce [animation-delay:120ms]" />
              <i className="size-1 rounded-full bg-brand animate-bounce [animation-delay:240ms]" />
            </span>
          </p>
        </div>
      ) : (
        <AssistantResponseCard message={message} {...handlers} />
      )}
    </motion.article>
  );
}
