/**
 * Upstash Redis Cache Implementation
 *
 * Implements the SDK's Cache interface using Upstash Redis with Set-based
 * indexing for efficient pattern invalidation.
 *
 * Redis Key Structure:
 * - cache:{key} → CacheEntry (string, JSON serialized)
 * - cache:index:{invalidationKey} → Set of cache keys
 */

import { Redis } from '@upstash/redis'
import type {
  Cache,
  CacheEntry,
  CacheStats,
} from '@osprotocol/schema/system/data'

const DEFAULT_TTL = 30 * 24 * 60 * 60 // 30 days in seconds
const INDEX_PREFIX = 'cache:index:'
const CACHE_PREFIX = 'cache:'

export interface UpstashCacheOptions {
  /** Upstash Redis client instance. If not provided, uses Redis.fromEnv() */
  redis?: Redis
  /** Default TTL in seconds (default: 30 days) */
  defaultTtl?: number
  /** Key prefix for all cache entries (default: "cache:") */
  prefix?: string
}

/**
 * Creates a Cache implementation backed by Upstash Redis.
 *
 * Uses Set-based indexing for O(n) invalidation where n is the number
 * of keys in the invalidation group (not total cache size).
 *
 * @example
 * ```ts
 * import { createUpstashCache } from '@syner/upstash/cache'
 *
 * const cache = createUpstashCache()
 *
 * // Set with invalidation key for grouped invalidation
 * await cache.set('github:content:owner/repo:main:README.md', {
 *   data: { content: '# Hello' },
 *   metadata: { invalidationKey: 'owner/repo' },
 * })
 *
 * // Later: invalidate all keys for the repo
 * const count = await cache.invalidate('owner/repo')
 * ```
 */
export function createUpstashCache(options: UpstashCacheOptions = {}): Cache {
  const redis = options.redis ?? Redis.fromEnv()
  const defaultTtl = options.defaultTtl ?? DEFAULT_TTL
  const prefix = options.prefix ?? CACHE_PREFIX

  // Per-instance stats (reset on cold start)
  let hits = 0
  let misses = 0

  const prefixedKey = (key: string) => `${prefix}${key}`
  const indexKey = (invKey: string) => `${INDEX_PREFIX}${invKey}`

  return {
    async get<T>(key: string): Promise<CacheEntry<T> | null> {
      const entry = await redis.get<CacheEntry<T>>(prefixedKey(key))

      if (!entry) {
        misses++
        return null
      }

      // Check if expired (belt and suspenders - Redis TTL should handle this)
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        await redis.del(prefixedKey(key))
        misses++
        return null
      }

      hits++
      return entry
    },

    async set<T>(
      key: string,
      entry: Omit<CacheEntry<T>, 'cachedAt'>,
      ttl?: number
    ): Promise<void> {
      const now = Date.now()
      const expireSeconds = ttl ?? defaultTtl

      const fullEntry: CacheEntry<T> = {
        ...entry,
        cachedAt: now,
        expiresAt: ttl ? now + ttl * 1000 : entry.expiresAt,
      }

      const pKey = prefixedKey(key)
      await redis.set(pKey, fullEntry, { ex: expireSeconds })

      // Index for invalidation if invalidationKey is provided
      const invKey = entry.metadata?.invalidationKey as string | undefined
      if (invKey) {
        const idxKey = indexKey(invKey)
        await redis.sadd(idxKey, pKey)
        // Index TTL is 1 hour longer than cache entries to ensure cleanup
        await redis.expire(idxKey, expireSeconds + 3600)
      }
    },

    async delete(key: string): Promise<boolean> {
      const pKey = prefixedKey(key)

      // Remove from index if it has an invalidationKey
      const entry = await redis.get<CacheEntry>(pKey)
      if (entry?.metadata?.invalidationKey) {
        await redis.srem(
          indexKey(entry.metadata.invalidationKey as string),
          pKey
        )
      }

      return (await redis.del(pKey)) > 0
    },

    async has(key: string): Promise<boolean> {
      return (await redis.exists(prefixedKey(key))) === 1
    },

    async invalidate(pattern: string): Promise<number> {
      // Fast path: treat pattern as invalidationKey (Set-based lookup)
      const idxKey = indexKey(pattern)
      const keys = await redis.smembers(idxKey)

      if (keys.length > 0) {
        await redis.del(...keys)
        await redis.del(idxKey)
        return keys.length
      }

      // Slow path: SCAN for glob patterns (when pattern contains * or ?)
      if (pattern.includes('*') || pattern.includes('?')) {
        let cursor = '0'
        let count = 0

        do {
          const [next, found] = await redis.scan(cursor, {
            match: `${prefix}${pattern}`,
            count: 100,
          })
          cursor = next

          if (found.length > 0) {
            await redis.del(...found)
            count += found.length
          }
        } while (cursor !== '0')

        return count
      }

      return 0
    },

    async stats(): Promise<CacheStats> {
      // Note: dbsize() returns total Redis keys, not just cache keys
      const size = await redis.dbsize()
      return { hits, misses, size }
    },
  }
}
