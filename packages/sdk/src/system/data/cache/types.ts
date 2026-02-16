/**
 * Cache Types
 *
 * Defines the cache capability interface with HTTP caching metadata support.
 * Used for ETag-based revalidation and rate limit optimization.
 */

/**
 * Cache entry with HTTP caching metadata
 */
export interface CacheEntry<T = unknown> {
  /** The cached data */
  data: T

  /** When this entry was cached (Unix ms) */
  cachedAt: number

  /** When this entry expires (Unix ms) */
  expiresAt?: number

  /** HTTP ETag for conditional requests */
  etag?: string

  /** HTTP Last-Modified for conditional requests */
  lastModified?: string

  /** Extensible metadata */
  metadata?: Record<string, unknown>
}

/**
 * Cache statistics for observability
 */
export interface CacheStats {
  hits: number
  misses: number
  size: number
  bytes?: number
}

/**
 * Cache capability interface
 *
 * Provides a storage-agnostic cache abstraction supporting:
 * - HTTP ETag/Last-Modified metadata
 * - TTL-based expiration
 * - Pattern-based invalidation
 * - Usage statistics
 */
export interface Cache {
  /**
   * Retrieve a cached entry by key.
   * Returns null if not found or expired.
   */
  get<T = unknown>(key: string): Promise<CacheEntry<T> | null>

  /**
   * Store an entry in the cache.
   *
   * @param key - Cache key
   * @param entry - Entry data (cachedAt will be set automatically)
   * @param ttl - Time to live in seconds (overrides entry.expiresAt)
   */
  set<T = unknown>(
    key: string,
    entry: Omit<CacheEntry<T>, 'cachedAt'>,
    ttl?: number
  ): Promise<void>

  /**
   * Delete an entry from the cache.
   * Returns true if the entry existed.
   */
  delete(key: string): Promise<boolean>

  /**
   * Check if a key exists and is not expired.
   */
  has(key: string): Promise<boolean>

  /**
   * Invalidate entries matching a glob pattern.
   * Returns the number of entries invalidated.
   *
   * @param pattern - Glob pattern (e.g., "github:*:owner/repo:*")
   */
  invalidate(pattern: string): Promise<number>

  /**
   * Get cache statistics.
   */
  stats(): Promise<CacheStats>
}
