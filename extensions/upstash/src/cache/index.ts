/**
 * Upstash Cache Module
 *
 * Provides an Upstash Redis-backed implementation of the SDK's Cache interface.
 */

export { createUpstashCache, type UpstashCacheOptions } from './upstash'
export type { Cache, CacheEntry, CacheStats } from '@syner/sdk/system/data/cache'
