export class ClientRateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super(`Please wait ${retryAfterSeconds}s before trying again.`);
    this.name = 'ClientRateLimitError';
  }
}

type WindowState = { startedAt: number; attempts: number };

/** A UX guard only. Production enforcement must also happen at the API gateway. */
export class ClientRateLimiter {
  private readonly buckets = new Map<string, WindowState>();

  consume(key: string, maxAttempts: number, windowMs: number) {
    const now = Date.now();
    const current = this.buckets.get(key);
    const bucket =
      !current || now - current.startedAt >= windowMs
        ? { startedAt: now, attempts: 0 }
        : current;
    if (bucket.attempts >= maxAttempts) {
      throw new ClientRateLimitError(
        Math.max(1, Math.ceil((windowMs - (now - bucket.startedAt)) / 1_000)),
      );
    }
    bucket.attempts += 1;
    this.buckets.set(key, bucket);
  }
}

export const clientRateLimiter = new ClientRateLimiter();
