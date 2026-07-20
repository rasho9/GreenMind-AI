import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function AuthInput({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: AuthInputProps) {
  const inputId = id ?? props.name;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={inputId} className="text-[13px] font-semibold text-ink">
          {label}
        </label>
        {hint && <span className="text-[11px] text-muted">{hint}</span>}
      </div>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          'focus-ring h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink shadow-[0_1px_2px_rgb(22_51_34_/_0.02)] transition-all placeholder:text-muted/65 hover:border-brand/25 focus:border-brand/60 focus:shadow-[0_0_0_3px_rgb(34_121_81_/_0.09)]',
          error
            ? 'border-[#d96757] focus:border-[#d96757] focus:ring-[#d96757]/30'
            : 'border-line',
          className,
        )}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-[#c8584b]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

type PasswordInputProps = Omit<AuthInputProps, 'type'>;

export function PasswordInput({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = id ?? props.name;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={inputId} className="text-[13px] font-semibold text-ink">
          {label}
        </label>
        {hint && <span className="text-[11px] text-muted">{hint}</span>}
      </div>
      <div className="relative">
        <input
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'focus-ring h-11 w-full rounded-xl border bg-surface py-0 pl-3.5 pr-11 text-sm text-ink shadow-[0_1px_2px_rgb(22_51_34_/_0.02)] transition-all placeholder:text-muted/65 hover:border-brand/25 focus:border-brand/60 focus:shadow-[0_0_0_3px_rgb(34_121_81_/_0.09)]',
            error
              ? 'border-[#d96757] focus:border-[#d96757] focus:ring-[#d96757]/30'
              : 'border-line',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="focus-ring absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-muted transition-colors hover:text-brand-dark"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-[#c8584b]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
