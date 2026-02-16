/**
 * Cache Module
 *
 * Provides cache interface and implementations for storing
 * HTTP responses with ETag/Last-Modified metadata.
 */

export type { Cache, CacheEntry, CacheStats } from './types'
export { createMemoryCache, type MemoryCacheOptions } from './memory'
