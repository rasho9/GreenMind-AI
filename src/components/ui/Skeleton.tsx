import { cn } from '@/lib/cn';

/** Lightweight, accessible placeholder for route and card loading states. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block animate-pulse rounded-[var(--radius-control)] bg-[linear-gradient(90deg,rgb(var(--line)),rgb(var(--brand-soft)),rgb(var(--line)))] bg-[length:200%_100%] [animation-duration:1.6s]',
        className,
      )}
    />
  );
}
