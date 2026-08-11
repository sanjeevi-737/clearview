const TTL_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 100;

type CacheEntry<T> = { value: T; expiresAt: number };

class LruCache {
  private readonly map = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key);
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value as T;
  }

  set(key: string, value: unknown): void {
    this.map.delete(key);
    this.map.set(key, { value, expiresAt: Date.now() + TTL_MS });
    if (this.map.size > MAX_ENTRIES) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
  }
}

const cache = new LruCache();

export function createCacheKey(userId: string, url: string): string {
  return `${userId}:${url.toLowerCase()}`;
}

export const cacheService = {
  getCachedAnalysis<T>(userId: string, url: string): T | undefined {
    return cache.get<T>(createCacheKey(userId, url));
  },
  setCachedAnalysis<T>(userId: string, url: string, value: T): void {
    cache.set(createCacheKey(userId, url), value);
  },
};
