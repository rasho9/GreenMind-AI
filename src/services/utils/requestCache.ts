type CacheEntry<T> = { value: T; expiresAt: number };

/**
 * Small in-memory TTL cache for provider reads. It intentionally stores no
 * user credentials or private data, and is cleared on a full page refresh.
 */
export class RequestCache {
  private readonly entries = new Map<string, CacheEntry<unknown>>();
  private readonly pending = new Map<string, Promise<unknown>>();

  async getOrLoad<T>(key: string, ttlMs: number, loader: () => Promise<T>) {
    const cached = this.entries.get(key) as CacheEntry<T> | undefined;
    if (cached && cached.expiresAt > Date.now()) return cached.value;

    const inFlight = this.pending.get(key) as Promise<T> | undefined;
    if (inFlight) return inFlight;

    const request = loader()
      .then((value) => {
        this.entries.set(key, { value, expiresAt: Date.now() + ttlMs });
        return value;
      })
      .finally(() => this.pending.delete(key));
    this.pending.set(key, request);
    return request;
  }

  invalidate(keyPrefix?: string) {
    if (!keyPrefix) return this.entries.clear();
    for (const key of this.entries.keys()) {
      if (key.startsWith(keyPrefix)) this.entries.delete(key);
    }
  }
}

export const requestCache = new RequestCache();
