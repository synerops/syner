/**
 * In-Memory KV Implementation
 *
 * Simple in-memory implementation of the OSP Kv interface.
 * Useful for development, testing, and single-instance deployments.
 */

import type { Kv, KvEntry } from '@osprotocol/schema/context/kv'

export interface MemoryKvOptions {
  /** Maximum number of entries (default: 1000) */
  maxSize?: number
  /** Default TTL in seconds (default: 30 days) */
  defaultTtl?: number
}

/**
 * Creates an in-memory KV store.
 *
 * @example
 * ```ts
 * const kv = createMemoryKv({ maxSize: 100 })
 * 
 * await kv.set('key', { data: 'value' })
 * const entry = await kv.get('key')
 * ```
 */
export function createMemoryKv(options: MemoryKvOptions = {}): Kv {
  const maxSize = options.maxSize ?? 1000
  const defaultTtl = options.defaultTtl ?? 30 * 24 * 60 * 60

  const store = new Map<string, KvEntry>()

  // LRU eviction when maxSize is reached
  const evictOldest = () => {
    if (store.size >= maxSize) {
      const firstKey = store.keys().next().value
      if (firstKey) {
        store.delete(firstKey)
      }
    }
  }

  return {
    async get<T = unknown>(key: string): Promise<KvEntry<T> | null> {
      const entry = store.get(key) as KvEntry<T> | undefined
      
      if (!entry) {
        return null
      }

      // Check expiration
      const expiresAt = entry.metadata?.expiresAt as number | undefined
      if (expiresAt && Date.now() > expiresAt) {
        store.delete(key)
        return null
      }

      return entry
    },

    async set<T = unknown>(key: string, value: T): Promise<KvEntry<T>> {
      evictOldest()

      const now = Date.now()
      const entry: KvEntry<T> = {
        key,
        value,
        metadata: {
          createdAt: now,
          expiresAt: now + defaultTtl * 1000,
        },
      }

      store.set(key, entry as KvEntry)
      return entry
    },

    async remove(key: string): Promise<boolean> {
      return store.delete(key)
    },

    async list(prefix?: string): Promise<string[]> {
      const keys: string[] = []
      
      for (const key of store.keys()) {
        if (!prefix || key.startsWith(prefix)) {
          keys.push(key)
        }
      }
      
      return keys
    },
  }
}