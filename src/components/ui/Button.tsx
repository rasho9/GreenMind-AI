import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] font-semibold transition-all duration-200 will-change-transform disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-10 px-3.5 text-sm' : 'h-12 px-4.5 text-sm',
        variant === 'primary' &&
          'bg-success text-white shadow-sm hover:-translate-y-px hover:bg-success-text hover:shadow-md active:translate-y-0 active:scale-[0.985]',
        variant === 'secondary' &&
          'border border-border bg-card text-text-primary shadow-sm hover:-translate-y-px hover:border-success/45 hover:bg-success-soft/55 hover:shadow-md active:translate-y-0',
        variant === 'outline' &&
          'border border-success/50 bg-transparent text-success-text hover:-translate-y-px hover:border-success hover:bg-success-soft/55 active:translate-y-0',
        variant === 'ghost' &&
          'text-text-secondary hover:bg-success-soft hover:text-success-text',
        variant === 'danger' &&
          'bg-danger text-white shadow-sm hover:-translate-y-px hover:bg-danger-text hover:shadow-md active:translate-y-0 active:scale-[0.985]',
        className,
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle size={17} className="animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon}
    </button>
  );
}
