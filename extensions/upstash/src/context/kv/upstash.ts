/**
 * Upstash Redis KV Implementation
 *
 * Implements the OSP's Kv interface using Upstash Redis.
 * Provides key-value storage with prefix-based listing.
 *
 * Redis Key Structure:
 * - kv:{key} → KvEntry (string, JSON serialized)
 */

import { Redis } from '@upstash/redis'
import type {
  Kv,
  KvEntry,
  KvContext,
  KvActions,
} from '@osprotocol/schema/context/kv'

const DEFAULT_TTL = 30 * 24 * 60 * 60 // 30 days in seconds
const KV_PREFIX = 'kv:'

export interface UpstashKvOptions {
  /** Upstash Redis client instance. If not provided, uses Redis.fromEnv() */
  redis?: Redis
  /** Default TTL in seconds (default: 30 days) */
  defaultTtl?: number
  /** Key prefix for all kv entries (default: "kv:") */
  prefix?: string
}

/**
 * Creates a Kv implementation backed by Upstash Redis.
 *
 * @example
 * ```ts
 * import { createUpstashKv } from '@syner/upstash/context/kv'
 *
 * const kv = createUpstashKv()
 *
 * // Set a value
 * await kv.set('user:123', { name: 'Alice', role: 'admin' })
 *
 * // Get a value
 * const entry = await kv.get<User>('user:123')
 *
 * // List keys with prefix
 * const userKeys = await kv.list('user:')
 * ```
 */
export function createUpstashKv(options: UpstashKvOptions = {}): Kv {
  const redis = options.redis ?? Redis.fromEnv()
  const defaultTtl = options.defaultTtl ?? DEFAULT_TTL
  const prefix = options.prefix ?? KV_PREFIX

  const prefixedKey = (key: string) => `${prefix}${key}`

  return {
    async get<T = unknown>(key: string): Promise<KvEntry<T> | null> {
      const entry = await redis.get<KvEntry<T>>(prefixedKey(key))
      
      if (!entry) {
        return null
      }

      // Check if expired (if metadata contains expiresAt)
      const expiresAt = entry.metadata?.expiresAt as number | undefined
      if (expiresAt && Date.now() > expiresAt) {
        await redis.del(prefixedKey(key))
        return null
      }

      return entry
    },

    async set<T = unknown>(key: string, value: T): Promise<KvEntry<T>> {
      const now = Date.now()
      
      const entry: KvEntry<T> = {
        key,
        value,
        metadata: {
          createdAt: now,
          expiresAt: now + defaultTtl * 1000,
        },
      }

      await redis.set(prefixedKey(key), entry, { ex: defaultTtl })
      
      return entry
    },

    async remove(key: string): Promise<boolean> {
      return (await redis.del(prefixedKey(key))) > 0
    },

    async list(prefixPattern?: string): Promise<string[]> {
      const pattern = prefixPattern 
        ? `${prefix}${prefixPattern}*`
        : `${prefix}*`
      
      const keys: string[] = []
      let cursor = '0'

      do {
        const [next, found] = await redis.scan(cursor, {
          match: pattern,
          count: 100,
        })
        cursor = next

        // Strip the internal prefix from keys before returning
        keys.push(...found.map(k => k.slice(prefix.length)))
      } while (cursor !== '0')

      return keys
    },
  }
}

/**
 * Creates a read-only KvContext from a full Kv implementation
 */
export function createKvContext(kv: Kv): KvContext {
  return {
    get: kv.get.bind(kv),
    list: kv.list.bind(kv),
  }
}

/**
 * Creates write-only KvActions from a full Kv implementation
 */
export function createKvActions(kv: Kv): KvActions {
  return {
    set: kv.set.bind(kv),
    remove: kv.remove.bind(kv),
  }
}