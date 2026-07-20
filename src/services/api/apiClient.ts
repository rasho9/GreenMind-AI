import { clientEnvironment } from '@/services/platform/environment';
import { tokenManager } from '@/services/security/tokenManager';

export type ApiErrorCode =
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'SERVER'
  | 'HTTP'
  | 'INVALID_RESPONSE';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiRequestOptions = RequestInit & {
  timeoutMs?: number;
  retryCount?: number;
  skipAuthRefresh?: boolean;
};

type RequestInterceptor = (
  request: RequestInit,
) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
let refreshHandler: (() => Promise<boolean>) | null = null;

function isRetryable(method?: string) {
  return ['GET', 'HEAD', 'OPTIONS'].includes((method ?? 'GET').toUpperCase());
}

function errorForStatus(status: number) {
  if (status === 401)
    return new ApiError(
      'Your session needs to be renewed. Please sign in again.',
      'UNAUTHORIZED',
      status,
    );
  if (status === 403)
    return new ApiError(
      'You do not have permission to use this service.',
      'FORBIDDEN',
      status,
    );
  if (status === 404)
    return new ApiError(
      'The requested service could not be found.',
      'NOT_FOUND',
      status,
    );
  if (status === 429)
    return new ApiError(
      'This service is busy. Please wait a moment and try again.',
      'RATE_LIMITED',
      status,
    );
  if (status >= 500)
    return new ApiError(
      'The service is temporarily unavailable. Please try again shortly.',
      'SERVER',
      status,
    );
  return new ApiError(
    `The service could not complete this request (${status}).`,
    'HTTP',
    status,
  );
}

const sleep = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

/**
 * Single browser API boundary. It adds a memory-only Bearer token, sends
 * cookies for server-managed refresh sessions, retries idempotent requests,
 * and retries an unauthorized request once after refresh.
 */
export const apiClient = {
  useRequest(interceptor: RequestInterceptor) {
    requestInterceptors.push(interceptor);
  },
  useResponse(interceptor: ResponseInterceptor) {
    responseInterceptors.push(interceptor);
  },
  setRefreshHandler(handler: (() => Promise<boolean>) | null) {
    refreshHandler = handler;
  },
  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ApiError(
        'You appear to be offline. Check your connection and retry.',
        'OFFLINE',
      );
    }
    const url = path.startsWith('http')
      ? path
      : `${clientEnvironment.apiBaseUrl ?? ''}${path}`;
    if (!url) {
      throw new ApiError('The API service is not configured.', 'NETWORK');
    }
    const {
      timeoutMs = 12_000,
      retryCount = 2,
      skipAuthRefresh,
      headers,
      ...init
    } = options;
    const controller = new AbortController();
    const callerSignal = init.signal;
    const abortFromCaller = () => controller.abort();
    callerSignal?.addEventListener('abort', abortFromCaller, { once: true });
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    const token = tokenManager.getAccessToken();
    let request: RequestInit = {
      ...init,
      credentials: 'include',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };
    try {
      for (const interceptor of requestInterceptors)
        request = await interceptor(request);
      let response: Response | undefined;
      for (let attempt = 0; attempt <= retryCount; attempt += 1) {
        try {
          response = await fetch(url, request);
          if (
            !response.ok &&
            isRetryable(request.method) &&
            response.status >= 500 &&
            attempt < retryCount
          ) {
            await sleep(250 * 2 ** attempt);
            continue;
          }
          break;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError')
            throw error;
          if (!isRetryable(request.method) || attempt === retryCount)
            throw error;
          await sleep(250 * 2 ** attempt);
        }
      }
      if (!response)
        throw new ApiError(
          'A network error occurred. Please retry.',
          'NETWORK',
        );
      if (response.status === 401 && !skipAuthRefresh && refreshHandler) {
        const refreshed = await refreshHandler();
        if (refreshed)
          return apiClient.request<T>(path, {
            ...options,
            skipAuthRefresh: true,
          });
      }
      for (const interceptor of responseInterceptors)
        response = await interceptor(response);
      if (!response.ok) {
        throw errorForStatus(response.status);
      }
      if (response.status === 204) return undefined as T;
      try {
        return (await response.json()) as T;
      } catch {
        throw new ApiError(
          'The service returned an unreadable response.',
          'INVALID_RESPONSE',
        );
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(
          'The request timed out. Please try again.',
          'TIMEOUT',
        );
      }
      throw new ApiError('A network error occurred. Please retry.', 'NETWORK');
    } finally {
      window.clearTimeout(timeout);
      callerSignal?.removeEventListener('abort', abortFromCaller);
    }
  },
};

apiClient.useRequest((request) => ({
  ...request,
  headers: { ...request.headers, 'X-Requested-With': 'GreenMindAI' },
}));
