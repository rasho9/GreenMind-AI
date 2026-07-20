import { getPasswordStrength } from '../utils/password';
import { passwordRequirements } from '@/services/security';

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const { score, label, color } = getPasswordStrength(password);
  const requirements = passwordRequirements(password);
  return (
    <div className="mt-2.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${level <= score ? color : 'bg-line'}`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-muted">
        Password strength: <span className="font-bold text-ink">{label}</span>
      </p>
      <ul
        className="mt-2 grid gap-1 text-[11px] text-muted sm:grid-cols-2"
        aria-label="Password requirements"
      >
        {requirements.map((requirement) => (
          <li
            key={requirement.label}
            className={requirement.met ? 'text-brand-dark' : undefined}
          >
            <span aria-hidden="true">{requirement.met ? '✓' : '•'}</span>{' '}
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
