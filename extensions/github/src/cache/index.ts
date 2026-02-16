/**
 * GitHub Cache Module
 *
 * ETag-based caching for GitHub API requests.
 */

export { contentCacheKey, repoCacheKey, repoInvalidationPattern } from './keys'

export {
  getCachedContent,
  createConditionalHeaders,
  extractCacheHeaders,
  type CachedFetchOptions,
  type CachedFetchResult,
} from './cache'
