/**
 * GitHub Cached Fetch with KV Store
 *
 * ETag-based cache revalidation for GitHub API requests using OSP KV interface.
 * Optimizes rate limit usage by returning cached data on 304 Not Modified.
 */

import type { Kv } from '@osprotocol/schema/context/kv'

/** Default TTL: 30 days in seconds */
const DEFAULT_TTL = 30 * 24 * 60 * 60

/**
 * Result from a cached fetch operation
 */
export interface CachedFetchResult<T> {
  data: T
  etag?: string
  lastModified?: string
}

/**
 * Cached data structure stored in KV
 */
interface CachedData<T> {
  data: T
  etag?: string
  lastModified?: string
  invalidationKey?: string
  cachedAt: number
}

/**
 * Options for cached fetch operations
 */
export interface CachedFetchOptions {
  kv: Kv
  /** TTL in seconds (default: 30 days) */
  ttl?: number
  /** Key for bulk invalidation (e.g., "owner/repo" for GitHub) */
  invalidationKey?: string
}

/**
 * Fetch with ETag-based cache revalidation using KV store.
 *
 * Flow:
 * 1. Check KV store for existing entry
 * 2. If cached, make conditional request with If-None-Match
 * 3. On 304 Not Modified, return cached data (no rate limit cost)
 * 4. On 200, update cache and return new data
 * 5. On cache miss, fetch fresh and cache
 *
 * @param options - Cache options (KV instance and TTL)
 * @param key - Cache key
 * @param fetcher - Function that performs the API request
 *   - Receives optional ETag for conditional request
 *   - Returns null on 304 Not Modified (use cached)
 *   - Returns CachedFetchResult on 200 (new data)
 *
 * @example
 * ```ts
 * const data = await getCachedContent(
 *   { kv },
 *   'github:content:owner/repo:main:README.md',
 *   async (etag) => {
 *     const response = await client.request('GET /repos/{owner}/{repo}/contents/{path}', {
 *       owner, repo, path, ref,
 *       headers: etag ? { 'If-None-Match': etag } : {},
 *     })
 *     return {
 *       data: response.data,
 *       etag: response.headers.etag,
 *     }
 *   }
 * )
 * ```
 */
export async function getCachedContent<T>(
  options: CachedFetchOptions,
  key: string,
  fetcher: (etag?: string) => Promise<CachedFetchResult<T> | null>
): Promise<T | null> {
  const { kv, ttl = DEFAULT_TTL, invalidationKey } = options

  // Check KV store for existing entry
  const cached = await kv.get<CachedData<T>>(key)

  if (cached) {
    // Try revalidation with ETag
    const result = await fetcher(cached.value.etag)

    if (result === null) {
      // 304 Not Modified - return cached data
      return cached.value.data
    }

    // New content - update cache
    const newData: CachedData<T> = {
      data: result.data,
      etag: result.etag,
      lastModified: result.lastModified,
      invalidationKey,
      cachedAt: Date.now(),
    }
    
    await kv.set(key, newData)
    return result.data
  }

  // Cache miss - fetch fresh
  const result = await fetcher()

  if (result) {
    const newData: CachedData<T> = {
      data: result.data,
      etag: result.etag,
      lastModified: result.lastModified,
      invalidationKey,
      cachedAt: Date.now(),
    }
    
    await kv.set(key, newData)
    return result.data
  }

  return null
}

/**
 * Invalidate all cache entries matching an invalidation key pattern.
 * 
 * @param kv - KV store instance
 * @param pattern - Invalidation key pattern (e.g., "owner/repo")
 * @returns Number of entries invalidated
 */
export async function invalidateCache(
  kv: Kv,
  pattern: string
): Promise<number> {
  // List all keys matching the pattern
  const keys = await kv.list(`github:${pattern}`)
  
  // Remove all matching keys
  let count = 0
  for (const key of keys) {
    if (await kv.remove(key)) {
      count++
    }
  }
  
  return count
}

/**
 * Creates conditional request headers for ETag revalidation.
 */
export function createConditionalHeaders(
  etag?: string,
  lastModified?: string
): Record<string, string> {
  const headers: Record<string, string> = {}

  if (etag) {
    headers['If-None-Match'] = etag
  }
  if (lastModified) {
    headers['If-Modified-Since'] = lastModified
  }

  return headers
}

/**
 * Extracts cache headers from a response.
 */
export function extractCacheHeaders(headers: Headers): {
  etag?: string
  lastModified?: string
} {
  return {
    etag: headers.get('etag') ?? undefined,
    lastModified: headers.get('last-modified') ?? undefined,
  }
}