/**
 * GitHub Cached Fetch
 *
 * ETag-based cache revalidation for GitHub API requests.
 * Optimizes rate limit usage by returning cached data on 304 Not Modified.
 */

import type { Cache } from '@osprotocol/schema/system/data'

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
 * Options for cached fetch operations
 */
export interface CachedFetchOptions {
  cache: Cache
  /** TTL in seconds (default: 30 days) */
  ttl?: number
  /** Key for bulk invalidation (e.g., "owner/repo" for GitHub) */
  invalidationKey?: string
}

/**
 * Fetch with ETag-based cache revalidation.
 *
 * Flow:
 * 1. Check cache for existing entry
 * 2. If cached, make conditional request with If-None-Match
 * 3. On 304 Not Modified, return cached data (no rate limit cost)
 * 4. On 200, update cache and return new data
 * 5. On cache miss, fetch fresh and cache
 *
 * @param options - Cache options (cache instance and TTL)
 * @param key - Cache key
 * @param fetcher - Function that performs the API request
 *   - Receives optional ETag for conditional request
 *   - Returns null on 304 Not Modified (use cached)
 *   - Returns CachedFetchResult on 200 (new data)
 *
 * @example
 * ```ts
 * const data = await getCachedContent(
 *   { cache },
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
  const { cache, ttl = DEFAULT_TTL, invalidationKey } = options

  // Build metadata for cache entry
  const metadata = invalidationKey ? { invalidationKey } : undefined

  // Check cache for existing entry
  const cached = await cache.get<T>(key)

  if (cached) {
    // Try revalidation with ETag
    const result = await fetcher(cached.etag)

    if (result === null) {
      // 304 Not Modified - return cached data
      return cached.data
    }

    // New content - update cache
    await cache.set(
      key,
      {
        data: result.data,
        etag: result.etag,
        lastModified: result.lastModified,
        metadata,
      },
      ttl
    )

    return result.data
  }

  // Cache miss - fetch fresh
  const result = await fetcher()

  if (result) {
    await cache.set(
      key,
      {
        data: result.data,
        etag: result.etag,
        lastModified: result.lastModified,
        metadata,
      },
      ttl
    )
    return result.data
  }

  return null
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
