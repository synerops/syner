/**
 * GitHub Content API
 *
 * Fetches file content from GitHub repositories using the authenticated user's token.
 * Uses in-memory cache with ETag revalidation.
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createMemoryCache } from '@syner/sdk/system/data/cache'
import { createGitHubClient, getFileContent } from '@syner/github'

// In-memory cache instance (shared across requests in the same process)
const cache = createMemoryCache({ maxSize: 100 })

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')
  const path = searchParams.get('path')
  const ref = searchParams.get('ref') ?? 'HEAD'

  if (!owner || !repo || !path) {
    return NextResponse.json(
      { error: 'Missing required params: owner, repo, path' },
      { status: 400 }
    )
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('github_access_token')?.value

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated. Connect with GitHub first.' },
      { status: 401 }
    )
  }

  try {
    const client = createGitHubClient({ accessToken })
    const file = await getFileContent({
      client,
      cache,
      owner,
      repo,
      path,
      ref,
    })

    if (!file) {
      return NextResponse.json(
        { error: 'File not found or not accessible' },
        { status: 404 }
      )
    }

    // Return file content and cache stats for debugging
    const stats = await cache.stats()

    return NextResponse.json({
      content: file.content,
      sha: file.sha,
      path: file.path,
      cache: {
        hits: stats.hits,
        misses: stats.misses,
        size: stats.size,
      },
    })
  } catch (error) {
    console.error('GitHub content fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content from GitHub' },
      { status: 500 }
    )
  }
}
