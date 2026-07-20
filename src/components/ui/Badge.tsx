import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-success/20 bg-success-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-success-text',
        className,
      )}
      {...props}
    />
  );
}
