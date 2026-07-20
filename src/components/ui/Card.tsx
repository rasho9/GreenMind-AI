import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'typography-card rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-success/35 hover:shadow-[var(--shadow-card-hover)] motion-reduce:transform-none sm:p-7 lg:p-8',
        className,
      )}
      {...props}
    />
  );
}
