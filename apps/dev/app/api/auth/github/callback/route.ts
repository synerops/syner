/**
 * GitHub OAuth Callback Route
 *
 * GET /api/auth/github/callback?code=...&state=...
 *
 * Handles the OAuth callback from GitHub:
 * 1. Validates state (CSRF protection)
 * 2. Exchanges code for tokens
 * 3. Stores token in cookie
 * 4. Redirects to resolved origin
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  exchangeCodeForToken,
  decodeState,
  resolveOrigin,
  type GitHubOAuthConfig,
} from '@syner/github'

function getOAuthConfig(): GitHubOAuthConfig {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing GitHub OAuth credentials')
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
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle GitHub errors
  if (error) {
    console.error('GitHub OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/test?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  // Validate required parameters
  if (!code || !stateParam) {
    return NextResponse.redirect(
      new URL('/test?error=missing_params', request.url)
    )
  }

  // Decode and validate state
  const state = decodeState(stateParam)
  if (!state) {
    return NextResponse.redirect(
      new URL('/test?error=invalid_state', request.url)
    )
  }

  // Validate nonce (CSRF protection)
  const storedNonce = request.cookies.get('github_oauth_nonce')?.value
  if (!storedNonce || storedNonce !== state.nonce) {
    return NextResponse.redirect(
      new URL('/test?error=invalid_nonce', request.url)
    )
  }

  try {
    const config = getOAuthConfig()

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(config, code)

    // Resolve the origin URL from the key
    const originUrl = resolveOrigin(state.origin)

    // Build redirect URL
    const redirectUrl = new URL(state.returnUrl ?? '/test', originUrl)

    // In development, stay on localhost
    const isDevelopment = process.env.NODE_ENV !== 'production'
    const finalRedirectUrl = isDevelopment
      ? new URL(state.returnUrl ?? '/test', request.url)
      : redirectUrl

    const response = NextResponse.redirect(finalRedirectUrl)

    // Store access token in HttpOnly cookie
    response.cookies.set('github_access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // Clear the nonce cookie
    response.cookies.delete('github_oauth_nonce')

    // Set a flag cookie to indicate successful auth (readable by client)
    response.cookies.set('github_connected', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch (err) {
    console.error('GitHub OAuth callback error:', err)
    return NextResponse.redirect(
      new URL('/test?error=token_exchange_failed', request.url)
    )
  }
}
