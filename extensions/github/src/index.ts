/**
 * @syner/github - GitHub OAuth and API Integration
 *
 * Extends Syner OS with GitHub integration capabilities:
 * - OAuth authentication flow
 * - API client (Octokit wrapper)
 * - Cache layer for rate limit optimization (placeholder)
 */

// OAuth
export {
  createAuthorizationUrl,
  exchangeCodeForToken,
  decodeState,
  generateNonce,
  resolveOrigin,
  isValidOriginKey,
  getOriginKeys,
  type OriginKey,
  type GitHubOAuthConfig,
  type GitHubOAuthState,
  type GitHubOAuthTokens,
  type GitHubTokenResponse,
  type GitHubUser,
} from './oauth'

// API
export {
  createGitHubClient,
  createGitHubClientFromTokens,
  getAuthenticatedUser,
  type GitHubClientOptions,
} from './api'

// Cache (placeholder for G6)
export {
  createConditionalHeaders,
  extractCacheHeaders,
  type CacheEntry,
  type CacheOptions,
} from './cache'
