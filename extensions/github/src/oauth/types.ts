/**
 * GitHub OAuth Types
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

export interface GitHubTokenResponse {
  access_token: string
  token_type: string
  scope: string
  refresh_token?: string
  refresh_token_expires_in?: number
  expires_in?: number
}

export interface GitHubOAuthTokens {
  accessToken: string
  tokenType: string
  scope: string
  refreshToken?: string
  refreshTokenExpiresIn?: number
  expiresIn?: number
}

export interface GitHubUser {
  id: number
  login: string
  name: string | null
  email: string | null
  avatar_url: string
}
