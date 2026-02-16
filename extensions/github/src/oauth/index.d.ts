/**
 * @syner/github OAuth type declarations
 */

export interface GitHubOAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes?: string[]
}

export interface GitHubOAuthState {
  origin: string
  returnUrl?: string
  nonce: string
}

export interface GitHubOAuthTokens {
  accessToken: string
  tokenType: string
  scope: string
  refreshToken?: string
  refreshTokenExpiresIn?: number
  expiresIn?: number
}

export interface GitHubTokenResponse {
  access_token: string
  token_type: string
  scope: string
  refresh_token?: string
  refresh_token_expires_in?: number
  expires_in?: number
}

export interface GitHubUser {
  id: number
  login: string
  name: string | null
  email: string | null
  avatar_url: string
}

export type OriginKey = 'app' | 'md' | 'bot' | 'dev' | 'design'

export declare function createAuthorizationUrl(
  config: GitHubOAuthConfig,
  state: GitHubOAuthState
): string

export declare function exchangeCodeForToken(
  config: GitHubOAuthConfig,
  code: string
): Promise<GitHubOAuthTokens>

export declare function decodeState(encodedState: string): GitHubOAuthState | null

export declare function generateNonce(): string

export declare function resolveOrigin(key: string | null | undefined): string

export declare function isValidOriginKey(key: string | null | undefined): key is OriginKey

export declare function getOriginKeys(): OriginKey[]
