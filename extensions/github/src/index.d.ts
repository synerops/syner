/**
 * @syner/github type declarations
 */

import type { Octokit } from 'octokit'

// OAuth Types
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

// OAuth Functions
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

// API Types
export interface GitHubClientOptions {
  accessToken: string
}

// API Functions
export declare function createGitHubClient(options: GitHubClientOptions): Octokit

export declare function createGitHubClientFromTokens(tokens: GitHubOAuthTokens): Octokit

export declare function getAuthenticatedUser(client: Octokit): Promise<GitHubUser>

// Cache Types
export interface CacheEntry<T> {
  data: T
  etag?: string
  lastModified?: string
  cachedAt: number
}

export interface CacheOptions {
  ttl?: number
}

// Cache Functions
export declare function createConditionalHeaders(
  etag?: string,
  lastModified?: string
): Record<string, string>

export declare function extractCacheHeaders(headers: Headers): {
  etag?: string
  lastModified?: string
}
