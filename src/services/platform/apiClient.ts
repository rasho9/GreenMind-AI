export type ApiErrorCode =
  'OFFLINE' | 'TIMEOUT' | 'NETWORK' | 'HTTP' | 'INVALID_RESPONSE';

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

type RequestOptions = RequestInit & { timeoutMs?: number };

/** Small fetch boundary with offline and timeout handling shared by future providers. */
export async function requestJson<T>(
  url: string,
  { timeoutMs = 10_000, headers, ...options }: RequestOptions = {},
): Promise<T> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new ApiError(
      'You appear to be offline. Check your connection and retry.',
      'OFFLINE',
    );
  }
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      headers: { Accept: 'application/json', ...headers },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ApiError(
        `The service could not complete this request (${response.status}).`,
        'HTTP',
        response.status,
      );
    }
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
      throw new ApiError('The request timed out. Please try again.', 'TIMEOUT');
    }
    throw new ApiError('A network error occurred. Please retry.', 'NETWORK');
  } finally {
    window.clearTimeout(timeout);
  }
}
