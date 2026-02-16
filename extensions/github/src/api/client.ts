/**
 * GitHub API Client
 *
 * Octokit wrapper with automatic rate limit handling.
 * Uses @octokit/plugin-throttling for:
 * - Primary rate limit (5000 req/hour)
 * - Secondary rate limit (abuse detection)
 */

import { Octokit } from 'octokit'
import { throttling } from '@octokit/plugin-throttling'
import type { GitHubOAuthTokens, GitHubUser } from '../oauth/types'

/** Type alias for the GitHub client */
export type GitHubClient = Octokit

// Create throttled Octokit class
const ThrottledOctokit = Octokit.plugin(throttling)

export interface GitHubClientOptions {
  accessToken: string
  /** Callback when rate limit is hit */
  onRateLimit?: (retryAfter: number, retryCount: number) => void
  /** Callback when secondary rate limit is hit */
  onSecondaryRateLimit?: (retryAfter: number) => void
}

/**
 * Creates an authenticated Octokit instance with throttling.
 *
 * @param options - Client options with access token and callbacks
 * @returns Configured Octokit instance with rate limit handling
 *
 * @example
 * ```ts
 * const client = createGitHubClient({
 *   accessToken: token,
 *   onRateLimit: (retryAfter, count) => {
 *     console.log(`Rate limit hit, retry #${count + 1} after ${retryAfter}s`)
 *   },
 * })
 * ```
 */
export function createGitHubClient(options: GitHubClientOptions): GitHubClient {
  const { accessToken, onRateLimit, onSecondaryRateLimit } = options

  return new ThrottledOctokit({
    auth: accessToken,
    throttle: {
      onRateLimit: (retryAfter, opts, octokit, retryCount) => {
        onRateLimit?.(retryAfter, retryCount)
        octokit.log.warn(
          `Rate limit hit for ${opts.method} ${opts.url}, retry #${retryCount + 1} after ${retryAfter}s`
        )
        // Retry up to 2 times
        return retryCount < 2
      },
      onSecondaryRateLimit: (retryAfter, opts, octokit) => {
        onSecondaryRateLimit?.(retryAfter)
        octokit.log.warn(
          `Secondary rate limit for ${opts.method} ${opts.url}, retry after ${retryAfter}s`
        )
        return true
      },
    },
  }) as GitHubClient
}

/**
 * Creates a GitHub client from OAuth tokens.
 *
 * @param tokens - OAuth tokens from token exchange
 * @returns Configured Octokit instance with throttling
 */
export function createGitHubClientFromTokens(tokens: GitHubOAuthTokens): GitHubClient {
  return createGitHubClient({ accessToken: tokens.accessToken })
}

/**
 * Fetches the authenticated user's profile.
 *
 * @param client - Octokit instance
 * @returns User profile
 */
export async function getAuthenticatedUser(client: GitHubClient): Promise<GitHubUser> {
  const { data } = await client.rest.users.getAuthenticated()

  return {
    id: data.id,
    login: data.login,
    name: data.name,
    email: data.email,
    avatar_url: data.avatar_url,
  }
}
