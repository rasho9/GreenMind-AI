import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '@/services/auth';

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const location = useLocation();
  const { status, user, bootstrap } = useAuthStore();

  useEffect(() => {
    if (status === 'loading') void bootstrap();
  }, [bootstrap, status]);

  if (status === 'loading') {
    return (
      <div
        className="grid min-h-screen place-items-center bg-canvas"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm font-semibold text-muted shadow-card">
          <span className="size-4 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
          Securing your workspace…
        </div>
      </div>
    );
  }
  if (status !== 'authenticated' || !user) {
    return (
      <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
    );
  }
  if (roles && !roles.includes(user.role))
    return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
