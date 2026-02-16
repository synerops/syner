/**
 * GitHub OAuth Initiation Route
 *
 * GET /api/auth/github?origin=md
 *
 * Initiates the GitHub OAuth flow by redirecting to GitHub's authorization page.
 * The `origin` parameter specifies which Syner domain to redirect back to after auth.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  createAuthorizationUrl,
  generateNonce,
  resolveOrigin,
  type GitHubOAuthConfig,
  type GitHubOAuthState,
} from '@syner/github'

function getOAuthConfig(): GitHubOAuthConfig {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing GitHub OAuth credentials (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)')
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3002'

  return {
    clientId,
    clientSecret,
    redirectUri: `${baseUrl}/api/auth/github/callback`,
  }
}

export async function GET(request: NextRequest) {
  try {
    const config = getOAuthConfig()
    const searchParams = request.nextUrl.searchParams

    // Get origin key from query params (e.g., "md", "app", "bot")
    const originKey = searchParams.get('origin')
    const returnUrl = searchParams.get('returnUrl')

    // Build state with origin and nonce for CSRF protection
    const state: GitHubOAuthState = {
      origin: originKey ?? 'dev',
      returnUrl: returnUrl ?? undefined,
      nonce: generateNonce(),
    }

    // Store nonce in cookie for validation on callback
    const authUrl = createAuthorizationUrl(config, state)

    const response = NextResponse.redirect(authUrl)

    // Set nonce cookie for state validation (HttpOnly, Secure, SameSite=Lax)
    response.cookies.set('github_oauth_nonce', state.nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    })

    return response
  } catch (error) {
    console.error('GitHub OAuth initiation error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate GitHub OAuth' },
      { status: 500 }
    )
  }
}
