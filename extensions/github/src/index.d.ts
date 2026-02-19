/**
 * @syner/github type declarations
 */

import type { Octokit } from 'octokit'
import type { Kv } from '@osprotocol/schema/context/kv'

// ============================================================================
// OAuth Types
// ============================================================================

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

// ============================================================================
// API Types
// ============================================================================

export type GitHubClient = Octokit

export interface GitHubClientOptions {
  accessToken: string
  onRateLimit?: (retryAfter: number, retryCount: number) => void
  onSecondaryRateLimit?: (retryAfter: number) => void
}

export interface GetFileContentOptions {
  client: GitHubClient
  kv: Kv
  owner: string
  repo: string
  path: string
  ref?: string
}

export interface FileContent {
  content: string
  sha: string
  path: string
  encoding: 'utf-8' | 'base64'
}

// API Functions
export declare function createGitHubClient(options: GitHubClientOptions): GitHubClient

export declare function createGitHubClientFromTokens(tokens: GitHubOAuthTokens): GitHubClient

export declare function getAuthenticatedUser(client: GitHubClient): Promise<GitHubUser>

export declare function getFileContent(options: GetFileContentOptions): Promise<FileContent | null>

// ============================================================================
// Cache Types
// ============================================================================

export interface CachedFetchResult<T> {
  data: T
  etag?: string
  lastModified?: string
}

export interface CachedFetchOptions {
  kv: Kv
  ttl?: number
  invalidationKey?: string
}

// Cache Functions
export declare function contentCacheKey(
  owner: string,
  repo: string,
  ref: string,
  path: string
): string

export declare function repoCacheKey(owner: string, repo: string): string

export declare function repoInvalidationPattern(owner: string, repo: string): string

export declare function getCachedContent<T>(
  options: CachedFetchOptions,
  key: string,
  fetcher: (etag?: string) => Promise<CachedFetchResult<T> | null>
): Promise<T | null>

export declare function createConditionalHeaders(
  etag?: string,
  lastModified?: string
): Record<string, string>

export declare function extractCacheHeaders(headers: Headers): {
  etag?: string
  lastModified?: string
}
