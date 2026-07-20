import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { secureStorage } from '@/services/security';

const consentKey = 'greenmind:privacy-consent';

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    void secureStorage
      .get<{ choice: string }>(consentKey)
      .then((value) => setVisible(!value));
  }, []);
  const saveChoice = (choice: 'essential' | 'all') => {
    void secureStorage.set(consentKey, {
      choice,
      savedAt: new Date().toISOString(),
    });
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <section
      className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-[22px] border border-line bg-surface p-4 shadow-elevated sm:bottom-5 sm:p-5"
      role="dialog"
      aria-modal="false"
      aria-label="Privacy choices"
    >
      <div className="flex gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-brand-soft text-brand">
          <Cookie size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold text-ink">
            Your privacy, clearly explained
          </p>
          <p className="mt-1 text-sm leading-6 text-muted">
            GreenMind uses essential session storage for this demo. Optional
            analytics remain off until you choose otherwise.
          </p>
          <p className="mt-2 text-xs font-semibold text-muted">
            <Link
              to="/privacy"
              className="focus-ring rounded text-brand hover:text-brand-dark"
            >
              Privacy Policy
            </Link>{' '}
            ·{' '}
            <Link
              to="/cookies"
              className="focus-ring rounded text-brand hover:text-brand-dark"
            >
              Cookie Policy
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => saveChoice('essential')}
              leftIcon={<ShieldCheck size={16} />}
            >
              Essential only
            </Button>
            <Button onClick={() => saveChoice('all')}>
              Accept preferences
            </Button>
          </div>
        </div>
        <button
          type="button"
          className="focus-ring h-fit rounded-lg p-1 text-muted hover:bg-canvas hover:text-ink"
          aria-label="Dismiss privacy choices"
          onClick={() => saveChoice('essential')}
        >
          <X size={17} />
        </button>
      </div>
    </section>
  );
}
