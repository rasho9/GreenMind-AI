import { useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '../store/useAuthStore';

const configuredTimeout = Number(
  import.meta.env.VITE_SESSION_IDLE_TIMEOUT_MS ?? 900_000,
);
const inactivityTimeout = Number.isFinite(configuredTimeout)
  ? Math.max(60_000, configuredTimeout)
  : 900_000;

/** Ends a client session after inactivity; the API must enforce its own expiry too. */
export function SessionTimeoutGuard({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const signOut = useAuthStore((state) => state.signOut);
  const showToast = useAppStore((state) => state.showToast);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (status !== 'authenticated') return;
    let timeout: number;
    const reset = () => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        void signOut().finally(() => {
          showToast(
            'Your session ended after inactivity. Please sign in again.',
            'info',
          );
          navigate('/sign-in', {
            replace: true,
            state: { from: location.pathname, reason: 'timeout' },
          });
        });
      }, inactivityTimeout);
    };
    const events: Array<keyof WindowEventMap> = [
      'pointerdown',
      'keydown',
      'scroll',
      'touchstart',
    ];
    events.forEach((event) =>
      window.addEventListener(event, reset, { passive: true }),
    );
    reset();
    return () => {
      window.clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, reset));
    };
  }, [location.pathname, navigate, showToast, signOut, status]);

  return <>{children}</>;
}
