/**
 * GitHub Cache Key Generators
 *
 * Standardized key generation for GitHub API response caching.
 * Keys follow the pattern: github:{type}:{owner}/{repo}:{ref}:{path}
 */

/**
 * Generate cache key for GitHub file content.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param ref - Git ref (branch, tag, or SHA)
 * @param path - File path within the repository
 */
export function contentCacheKey(
  owner: string,
  repo: string,
  ref: string,
  path: string
): string {
  return `github:content:${owner}/${repo}:${ref}:${path}`
}

/**
 * Generate cache key for repository metadata.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 */
export function repoCacheKey(owner: string, repo: string): string {
  return `github:repo:${owner}/${repo}`
}

/**
 * Generate pattern for invalidating all cache entries for a repository.
 * Used when receiving webhook push events.
 *
 * @param owner - Repository owner
 * @param repo - Repository name
 */
export function repoInvalidationPattern(owner: string, repo: string): string {
  return `github:*:${owner}/${repo}:*`
}
