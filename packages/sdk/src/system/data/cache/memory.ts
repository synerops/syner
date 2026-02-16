/**
 * In-Memory Cache Implementation
 *
 * LRU cache with TTL support for development and testing.
 * Production deployments should use a persistent cache like Vercel KV.
 */

import type { Cache, CacheEntry, CacheStats } from './types'

export interface MemoryCacheOptions {
  /** Maximum number of entries (default: 1000) */
  maxSize?: number
}

/**
 * Creates an in-memory cache with LRU eviction.
 *
 * @param options - Cache configuration
 * @returns Cache instance
 *
 * @example
 * ```ts
 * const cache = createMemoryCache({ maxSize: 500 })
 * await cache.set('key', { data: 'value' }, 3600)
 * const entry = await cache.get('key')
 * ```
 */
export function createMemoryCache(options: MemoryCacheOptions = {}): Cache {
  const { maxSize = 1000 } = options
  const store = new Map<string, CacheEntry>()
  let hits = 0
  let misses = 0

  function isExpired(entry: CacheEntry): boolean {
    if (!entry.expiresAt) return false
    return Date.now() > entry.expiresAt
  }

  function evictIfNeeded(): void {
    if (store.size >= maxSize) {
      // LRU: delete oldest entry (first in Map iteration order)
      const oldestKey = store.keys().next().value
      if (oldestKey !== undefined) {
        store.delete(oldestKey)
      }
    }
  }

  return {
    async get<T>(key: string): Promise<CacheEntry<T> | null> {
      const entry = store.get(key) as CacheEntry<T> | undefined

      if (!entry || isExpired(entry)) {
        if (entry) store.delete(key)
        misses++
        return null
      }

      hits++
      // Move to end for LRU (most recently used)
      store.delete(key)
      store.set(key, entry)
      return entry
    },

    async set<T>(
      key: string,
      entry: Omit<CacheEntry<T>, 'cachedAt'>,
      ttl?: number
    ): Promise<void> {
      evictIfNeeded()
      const now = Date.now()
      store.set(key, {
        ...entry,
        cachedAt: now,
        expiresAt: ttl ? now + ttl * 1000 : entry.expiresAt,
      })
    },

    async delete(key: string): Promise<boolean> {
      return store.delete(key)
    },

    async has(key: string): Promise<boolean> {
      const entry = store.get(key)
      if (!entry) return false
      if (isExpired(entry)) {
        store.delete(key)
        return false
      }
      return true
    },

    async invalidate(pattern: string): Promise<number> {
      // Convert glob pattern to regex
      // Escape special regex chars except * and ?
      const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(
        '^' + escaped.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
      )

      let count = 0
      for (const key of store.keys()) {
        if (regex.test(key)) {
          store.delete(key)
          count++
        }
      }
      return count
    },

    async stats(): Promise<CacheStats> {
      return {
        hits,
        misses,
        size: store.size,
      }
    },
  }
}
