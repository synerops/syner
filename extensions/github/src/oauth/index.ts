/**
 * GitHub OAuth Module
 */

export {
  createAuthorizationUrl,
  exchangeCodeForToken,
  decodeState,
  generateNonce,
} from './client'

export { resolveOrigin, isValidOriginKey, getOriginKeys, type OriginKey } from './origins'

export type {
  GitHubOAuthConfig,
  GitHubOAuthState,
  GitHubOAuthTokens,
  GitHubTokenResponse,
  GitHubUser,
} from './types'
