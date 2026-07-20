import { create } from 'zustand';
import {
  authService,
  type AuthSession,
  type AuthUser,
  type SignInPayload,
} from '@/services/auth';
import { apiClient } from '@/services/api';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  expiresAt: string | null;
  bootstrap: () => Promise<void>;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
  clearSession: () => void;
  setSession: (session: AuthSession) => void;
};

const applySession = (session: AuthSession) => ({
  status: 'authenticated' as const,
  user: session.user,
  expiresAt: session.expiresAt,
});

/** Authentication state contains identity metadata only—never a token. */
export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,
  expiresAt: null,
  bootstrap: async () => {
    const session = await authService.refresh();
    set(
      session
        ? applySession(session)
        : { status: 'unauthenticated', user: null, expiresAt: null },
    );
  },
  signIn: async (payload) => {
    const session = await authService.signIn(payload);
    set(applySession(session));
  },
  signOut: async () => {
    await authService.logout();
    set({ status: 'unauthenticated', user: null, expiresAt: null });
  },
  clearSession: () =>
    set({ status: 'unauthenticated', user: null, expiresAt: null }),
  setSession: (session) => set(applySession(session)),
}));

apiClient.setRefreshHandler(async () => {
  const session = await authService.refresh();
  if (!session) {
    useAuthStore.getState().clearSession();
    return false;
  }
  useAuthStore.getState().setSession(session);
  return true;
});
