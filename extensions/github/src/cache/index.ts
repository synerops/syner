/**
 * GitHub Cache Module
 *
 * ETag-based caching for GitHub API requests using KV store.
 */

export { contentCacheKey, repoCacheKey, repoInvalidationPattern } from './keys'

export {
  getCachedContent,
  invalidateCache,
  createConditionalHeaders,
  extractCacheHeaders,
  type CachedFetchOptions,
  type CachedFetchResult,
} from './cache'