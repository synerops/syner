/**
 * GitHub Content API
 *
 * Fetches file content from GitHub repositories using the authenticated user's token.
 * Uses in-memory KV store with ETag revalidation.
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createMemoryKv } from '@syner/sdk'
import { createGitHubClient, getFileContent } from '@syner/github'

// In-memory KV instance (shared across requests in the same process)
const kv = createMemoryKv({ maxSize: 100 })

// Stats tracking (since KV doesn't have built-in stats)
let hits = 0
let misses = 0

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
    
    // Track cache hits/misses
    const cacheKey = `github:content:${owner}/${repo}:${ref}:${path}`
    const cached = await kv.get(cacheKey)
    if (cached) {
      hits++
    } else {
      misses++
    }
    
    const file = await getFileContent({
      client,
      kv,
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

    // Get approximate cache size
    const keys = await kv.list()

    return NextResponse.json({
      content: file.content,
      sha: file.sha,
      path: file.path,
      cache: {
        hits,
        misses,
        size: keys.length,
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