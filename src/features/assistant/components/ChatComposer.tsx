import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus, Mic, Paperclip, Send, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { normalizeText, validateSafeText } from '@/services/security';

type ComposerValues = { message: string };
type ComposerAttachment = { name: string; type: string };

type ChatComposerProps = {
  isStreaming: boolean;
  onSend: (message: string, attachment?: ComposerAttachment) => Promise<void>;
  onVoice: () => void;
};

export function ChatComposer({
  isStreaming,
  onSend,
  onVoice,
}: ChatComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<ComposerAttachment>();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<ComposerValues>({ defaultValues: { message: '' } });
  const message = watch('message');
  const messageField = register('message', {
    required: 'Write a garden question before sending.',
    maxLength: 1600,
    validate: (value) => validateSafeText(value, 'Message', 1600),
  });
  const submit = async ({ message: nextMessage }: ComposerValues) => {
    const trimmed = normalizeText(nextMessage, 1600);
    if (!trimmed || isStreaming) return;
    await onSend(trimmed, attachment);
    reset();
    setAttachment(undefined);
    setFocus('message');
  };
  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="border-t border-line bg-surface/84 px-4 py-3.5 backdrop-blur sm:px-6"
    >
      <div className="mx-auto max-w-4xl rounded-[20px] border border-line bg-canvas/60 p-2 shadow-[0_8px_25px_rgb(18_43_31_/_0.05)] transition-all focus-within:border-brand/35 focus-within:bg-surface focus-within:shadow-[0_0_0_4px_rgb(34_121_81_/_0.06)]">
        {attachment && (
          <div className="mx-1 mb-1 flex items-center justify-between rounded-xl bg-brand-soft/55 px-3 py-2 text-xs font-semibold text-brand-dark">
            <span className="truncate">Attached: {attachment.name}</span>
            <button
              type="button"
              onClick={() => setAttachment(undefined)}
              className="focus-ring rounded-md p-1"
              aria-label="Remove attachment"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <textarea
          {...messageField}
          rows={1}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              void handleSubmit(submit)();
            }
          }}
          placeholder="Ask anything about your garden..."
          aria-label="Message GreenMind AI"
          className="block max-h-36 min-h-[42px] w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-ink outline-none placeholder:text-muted/70"
        />
        {errors.message?.message && (
          <p role="alert" className="px-3 text-xs font-semibold text-danger">
            {errors.message.message}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <div className="flex items-center gap-0.5">
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              accept="image/*,.pdf,.txt"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setAttachment({ name: file.name, type: file.type });
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach a file"
            >
              <Paperclip size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload plant image"
            >
              <ImagePlus size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={onVoice}
              aria-label="Voice input placeholder"
            >
              <Mic size={16} />
            </Button>
            <span className="ml-1 hidden text-[10px] font-medium text-muted sm:inline">
              {message.length}/1600
            </span>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isStreaming}
            leftIcon={<Send size={15} />}
          >
            {isStreaming ? 'Thinking' : 'Send'}
          </Button>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-4xl text-center text-[10px] text-muted">
        GreenMind AI can make mistakes. Verify treatment, weather, and
        chemical-use guidance against local conditions.
      </p>
    </form>
  );
}
