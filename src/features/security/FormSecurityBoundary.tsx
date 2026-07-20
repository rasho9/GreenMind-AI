import { useRef, type FormEvent, type ReactNode } from 'react';
import { hasUnsafeInput } from '@/services/security';
import { useAppStore } from '@/store/appStore';

/**
 * A defence-in-depth guard for every existing form. Individual schemas still
 * own business validation; this boundary blocks unsafe markup and rapid repeat
 * submissions before they reach a feature handler.
 */
export function FormSecurityBoundary({ children }: { children: ReactNode }) {
  const lastSubmission = useRef(new WeakMap<HTMLFormElement, number>());
  const showToast = useAppStore((state) => state.showToast);

  const validateSubmission = (event: FormEvent<HTMLDivElement>) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const now = Date.now();
    const lastAttempt = lastSubmission.current.get(form) ?? 0;
    if (now - lastAttempt < 500) {
      event.preventDefault();
      event.stopPropagation();
      showToast('That request is already being submitted.', 'info');
      return;
    }
    const fields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input:not([type="password"]):not([type="checkbox"]):not([type="radio"]), textarea',
      ),
    );
    const unsafeField = fields.find(
      (field) => !field.disabled && hasUnsafeInput(field.value),
    );
    if (unsafeField) {
      event.preventDefault();
      event.stopPropagation();
      unsafeField.focus();
      showToast(
        'For your security, HTML and unsafe request content were blocked.',
        'warning',
      );
      return;
    }
    lastSubmission.current.set(form, now);
  };

  return <div onSubmitCapture={validateSubmission}>{children}</div>;
}
