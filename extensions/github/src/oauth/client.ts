/**
 * GitHub OAuth Client
 *
 * Handles OAuth authorization flow with GitHub.
 */

import type { GitHubOAuthConfig, GitHubOAuthState, GitHubOAuthTokens, GitHubTokenResponse } from './types'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

/**
 * Default OAuth scopes for Syner GitHub integration.
 * - repo: Full repository access (read/write)
 * - read:user: Read user profile
 * - user:email: Read user email addresses
 */
const DEFAULT_SCOPES = ['repo', 'read:user', 'user:email']

/**
 * Creates a GitHub OAuth authorization URL.
 *
 * @param config - OAuth configuration
 * @param state - State object (will be JSON-encoded and base64-encoded)
 * @returns Authorization URL to redirect the user to
 */
export function createAuthorizationUrl(
  config: GitHubOAuthConfig,
  state: GitHubOAuthState
): string {
  const scopes = config.scopes ?? DEFAULT_SCOPES
  const encodedState = Buffer.from(JSON.stringify(state)).toString('base64url')

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: scopes.join(' '),
    state: encodedState,
  })

  return `${GITHUB_AUTHORIZE_URL}?${params.toString()}`
}

/**
 * Decodes the state parameter from the OAuth callback.
 *
 * @param encodedState - Base64url-encoded state string
 * @returns Decoded state object, or null if invalid
 */
export function decodeState(encodedState: string): GitHubOAuthState | null {
  try {
    const decoded = Buffer.from(encodedState, 'base64url').toString('utf-8')
    return JSON.parse(decoded) as GitHubOAuthState
  } catch {
    return null
  }
}

/**
 * Exchanges an authorization code for access tokens.
 *
 * @param config - OAuth configuration
 * @param code - Authorization code from GitHub callback
 * @returns OAuth tokens
 * @throws Error if token exchange fails
 */
export async function exchangeCodeForToken(
  config: GitHubOAuthConfig,
  code: string
): Promise<GitHubOAuthTokens> {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as GitHubTokenResponse | { error: string; error_description?: string }

  if ('error' in data) {
    throw new Error(`GitHub OAuth error: ${data.error} - ${data.error_description ?? 'Unknown error'}`)
  }

  return {
    accessToken: data.access_token,
    tokenType: data.token_type,
    scope: data.scope,
    refreshToken: data.refresh_token,
    refreshTokenExpiresIn: data.refresh_token_expires_in,
    expiresIn: data.expires_in,
  }
}

/**
 * Generates a cryptographically secure nonce for state validation.
 *
 * @returns Random nonce string
 */
export function generateNonce(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64url')
}
