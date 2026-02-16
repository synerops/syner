/**
 * GitHub Content API
 *
 * File content retrieval with ETag caching.
 */

import type { Cache } from '@syner/sdk/system/data/cache'
import type { GitHubClient } from './client'
import {
  contentCacheKey,
  getCachedContent,
  type CachedFetchResult,
} from '../cache'

export interface GetFileContentOptions {
  client: GitHubClient
  cache: Cache
  owner: string
  repo: string
  path: string
  /** Branch, tag, or SHA (default: HEAD) */
  ref?: string
}

export interface FileContent {
  content: string
  sha: string
  path: string
  encoding: 'utf-8' | 'base64'
}

/**
 * Get file content with ETag caching.
 *
 * Uses conditional requests (If-None-Match) to avoid
 * rate limit consumption when content hasn't changed.
 *
 * @param options - File content options
 * @returns File content or null if not found
 *
 * @example
 * ```ts
 * const file = await getFileContent({
 *   client,
 *   cache,
 *   owner: 'synerops',
 *   repo: 'syner',
 *   path: 'README.md',
 *   ref: 'main',
 * })
 *
 * if (file) {
 *   console.log(file.content)
 * }
 * ```
 */
export async function getFileContent(
  options: GetFileContentOptions
): Promise<FileContent | null> {
  const { client, cache, owner, repo, path, ref = 'HEAD' } = options
  const key = contentCacheKey(owner, repo, ref, path)

  return getCachedContent<FileContent>(
    { cache, invalidationKey: `${owner}/${repo}` },
    key,
    async (etag?: string) => {
      try {
        const response = await client.request(
          'GET /repos/{owner}/{repo}/contents/{path}',
          {
            owner,
            repo,
            path,
            ref,
            headers: etag ? { 'If-None-Match': etag } : {},
          }
        )

        // Handle array response (directory listing)
        if (Array.isArray(response.data)) {
          return null // Not a file
        }

        const data = response.data
        if (data.type !== 'file' || !data.content) {
          return null
        }

        const result: CachedFetchResult<FileContent> = {
          data: {
            content:
              data.encoding === 'base64'
                ? Buffer.from(data.content, 'base64').toString('utf-8')
                : data.content,
            sha: data.sha,
            path: data.path,
            encoding: 'utf-8',
          },
          etag: response.headers.etag,
          lastModified: response.headers['last-modified'],
        }

        return result
      } catch (error: unknown) {
        // 304 Not Modified - return null to signal "use cached"
        if (isHttpError(error, 304)) {
          return null
        }
        // 404 Not Found - file doesn't exist
        if (isHttpError(error, 404)) {
          return null
        }
        throw error
      }
    }
  )
}

function isHttpError(error: unknown, status: number): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: number }).status === status
  )
}
