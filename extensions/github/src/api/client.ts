/**
 * GitHub API Client
 *
 * Octokit wrapper for authenticated GitHub API requests.
 */

import { Octokit } from 'octokit'
import type { GitHubOAuthTokens, GitHubUser } from '../oauth/types'

export interface GitHubClientOptions {
  accessToken: string
}

/**
 * Creates an authenticated Octokit instance.
 *
 * @param options - Client options with access token
 * @returns Configured Octokit instance
 */
export function createGitHubClient(options: GitHubClientOptions): Octokit {
  return new Octokit({
    auth: options.accessToken,
  })
}

/**
 * Creates a GitHub client from OAuth tokens.
 *
 * @param tokens - OAuth tokens from token exchange
 * @returns Configured Octokit instance
 */
export function createGitHubClientFromTokens(tokens: GitHubOAuthTokens): Octokit {
  return createGitHubClient({ accessToken: tokens.accessToken })
}

/**
 * Fetches the authenticated user's profile.
 *
 * @param client - Octokit instance
 * @returns User profile
 */
export async function getAuthenticatedUser(client: Octokit): Promise<GitHubUser> {
  const { data } = await client.rest.users.getAuthenticated()

  return {
    id: data.id,
    login: data.login,
    name: data.name,
    email: data.email,
    avatar_url: data.avatar_url,
  }
}
