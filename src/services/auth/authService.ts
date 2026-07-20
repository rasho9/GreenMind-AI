import { apiClient } from '@/services/api';
import { clientEnvironment } from '@/services/platform/environment';
import {
  tokenManager,
  validateEmail,
  validateStrongPassword,
} from '@/services/security';
import type { AuthSession, SignInPayload } from './types';

const delay = (milliseconds = 650) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

function assertValid(value: true | string) {
  if (value !== true) throw new Error(value);
}

function mockSession(email: string): AuthSession {
  return {
    user: {
      id: 'demo-user-alex',
      name: 'Alex Morgan',
      email,
      role: 'user',
      emailVerified: true,
      phoneVerified: false,
    },
    // Demo adapter only. Real access tokens are accepted from the API and remain memory-only.
    accessToken: `demo.${crypto.randomUUID()}.memory-only`,
    expiresAt: new Date(Date.now() + 15 * 60 * 1_000).toISOString(),
  };
}

/**
 * Auth transport boundary. In production, `/auth/refresh` sets/reads a Secure,
 * HttpOnly refresh cookie and returns a short-lived access token; no credentials
 * are persisted by the browser application.
 */
export const authService = {
  async signIn(payload: SignInPayload): Promise<AuthSession> {
    assertValid(validateEmail(payload.email));
    if (!payload.password) throw new Error('Enter your password.');
    if (clientEnvironment.apiBaseUrl) {
      const session = await apiClient.request<AuthSession>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
          remember: payload.remember,
        }),
        skipAuthRefresh: true,
        retryCount: 0,
      });
      tokenManager.setAccessToken(session.accessToken);
      return session;
    }
    await delay();
    const session = mockSession(payload.email.trim().toLowerCase());
    tokenManager.setAccessToken(session.accessToken);
    return session;
  },
  async signUp(payload: { name: string; email: string; password: string }) {
    assertValid(validateEmail(payload.email));
    assertValid(validateStrongPassword(payload.password));
    if (clientEnvironment.apiBaseUrl) {
      return apiClient.request<void>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...payload, name: payload.name.trim() }),
        skipAuthRefresh: true,
        retryCount: 0,
      });
    }
    await delay();
  },
  async refresh(): Promise<AuthSession | null> {
    if (!clientEnvironment.apiBaseUrl) return null;
    try {
      const session = await apiClient.request<AuthSession>('/auth/refresh', {
        method: 'POST',
        skipAuthRefresh: true,
        retryCount: 0,
      });
      tokenManager.setAccessToken(session.accessToken);
      return session;
    } catch {
      tokenManager.clear();
      return null;
    }
  },
  async logout() {
    try {
      if (clientEnvironment.apiBaseUrl) {
        await apiClient.request<void>('/auth/logout', {
          method: 'POST',
          skipAuthRefresh: true,
          retryCount: 0,
        });
      }
    } finally {
      tokenManager.clear();
    }
  },
  async requestPasswordReset(email: string) {
    assertValid(validateEmail(email));
    if (clientEnvironment.apiBaseUrl) {
      return apiClient.request<void>('/auth/password/reset-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuthRefresh: true,
        retryCount: 0,
      });
    }
    await delay();
  },
  async resetPassword(password: string) {
    assertValid(validateStrongPassword(password));
    if (clientEnvironment.apiBaseUrl) {
      return apiClient.request<void>('/auth/password/reset', {
        method: 'POST',
        body: JSON.stringify({ password }),
        skipAuthRefresh: true,
        retryCount: 0,
      });
    }
    await delay();
  },
  async changePassword(currentPassword: string, nextPassword: string) {
    if (!currentPassword) throw new Error('Enter your current password.');
    assertValid(validateStrongPassword(nextPassword));
    if (clientEnvironment.apiBaseUrl) {
      return apiClient.request<void>('/auth/password/change', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, nextPassword }),
        retryCount: 0,
      });
    }
    await delay();
  },
};
