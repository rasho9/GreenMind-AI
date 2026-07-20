import { RefreshCw, WifiOff } from 'lucide-react';
import { Button } from './Button';

type AsyncStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
};

/** Accessible failure state for provider errors, offline sessions, and timeouts. */
export function AsyncState({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
}: AsyncStateProps) {
  return (
    <section
      role="alert"
      className="grid min-h-[300px] place-items-center rounded-[22px] border border-dashed border-line bg-surface p-6 text-center"
    >
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-[16px] bg-brand-soft text-brand">
          <WifiOff size={22} />
        </span>
        <h2 className="mt-5 text-xl">{title}</h2>
        <p className="mt-3 text-sm text-muted">{description}</p>
        {onRetry && (
          <Button
            type="button"
            variant="secondary"
            onClick={onRetry}
            leftIcon={<RefreshCw size={17} />}
            className="mt-5"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </section>
  );
}
