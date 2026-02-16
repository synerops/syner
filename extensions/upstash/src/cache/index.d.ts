/**
 * Upstash Cache Module Type Declarations
 */

import type { Redis } from '@upstash/redis'
import type {
  Cache,
  CacheEntry,
  CacheStats,
} from '@syner/sdk/system/data/cache'

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
 */
export function createUpstashCache(options?: UpstashCacheOptions): Cache

export type { Cache, CacheEntry, CacheStats }
