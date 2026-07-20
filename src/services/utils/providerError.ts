/**
 * Provider-independent error shape. UI code can present one friendly message
 * whether the request came from GreenMind, OpenWeather, OpenAI, or Perenual.
 */
export type ProviderErrorCode =
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'CONFIGURATION'
  | 'NETWORK'
  | 'INVALID_RESPONSE'
  | 'UNKNOWN';

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly code: ProviderErrorCode,
    public readonly status?: number,
    public readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

/** Converts transport errors into copy that is safe and useful for end users. */
export function toProviderError(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error;
  const status =
    typeof error === 'object' && error && 'status' in error
      ? Number(error.status)
      : undefined;
  if (status === 401)
    return new ProviderError(
      'The connected service rejected its API key.',
      'UNAUTHORIZED',
      status,
    );
  if (status === 403)
    return new ProviderError(
      'This service is not permitted for the current configuration.',
      'FORBIDDEN',
      status,
    );
  if (status === 404)
    return new ProviderError(
      'The requested service or record was not found.',
      'NOT_FOUND',
      status,
    );
  if (status === 429)
    return new ProviderError(
      'This service is busy. Please wait a moment and try again.',
      'RATE_LIMITED',
      status,
    );
  return new ProviderError(
    error instanceof Error
      ? error.message
      : 'The service could not complete this request.',
    'UNKNOWN',
    status,
  );
}

export function getProviderErrorMessage(error: unknown) {
  return toProviderError(error).message;
}
