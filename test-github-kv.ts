#!/usr/bin/env bun
/**
 * Test script for GitHub extension with KV
 * 
 * Tests the GitHub content fetching with KV-based caching.
 * 
 * Requirements:
 * - GITHUB_ACCESS_TOKEN (or you'll be prompted to authenticate)
 * - UPSTASH_REDIS_REST_URL (optional, will use memory KV if not set)
 * - UPSTASH_REDIS_REST_TOKEN (optional)
 */

import { createGitHubClient, getFileContent } from './extensions/github/src'
import { createUpstashKv } from './extensions/upstash/src/context/kv/upstash'
import { createMemoryKv } from './packages/sdk/src/context/kv/memory'

async function testGitHubWithKv() {
  console.log('🧪 Testing GitHub extension with KV...\n')

  // Check for GitHub token
  const accessToken = process.env.GITHUB_ACCESS_TOKEN
  if (!accessToken) {
    console.error('❌ Missing GITHUB_ACCESS_TOKEN')
    console.error('   Please set it or run the OAuth flow first')
    process.exit(1)
  }

  // Choose KV implementation based on environment
  let kv: Awaited<ReturnType<typeof createUpstashKv>>
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.log('📦 Using Upstash KV (Redis)')
    kv = createUpstashKv()
  } else {
    console.log('💾 Using Memory KV (no Upstash credentials found)')
    kv = createMemoryKv({ maxSize: 10 })
  }
  console.log()

  try {
    // Create GitHub client
    console.log('1️⃣ Creating GitHub client...')
    const client = createGitHubClient({ 
      accessToken,
      onRateLimit: (retryAfter, retryCount) => {
        console.log(`   ⚠️ Rate limited. Retry ${retryCount} after ${retryAfter}s`)
      }
    })
    console.log('   ✅ Client created\n')

    // Test fetching a file
    console.log('2️⃣ Fetching README.md from synerops/syner...')
    const file1 = await getFileContent({
      client,
      kv,
      owner: 'synerops',
      repo: 'syner',
      path: 'README.md',
      ref: 'main'
    })

    if (!file1) {
      throw new Error('Failed to fetch file')
    }

    console.log('   ✅ File fetched successfully')
    console.log(`   SHA: ${file1.sha}`)
    console.log(`   Size: ${file1.content.length} bytes`)
    console.log(`   First 100 chars: ${file1.content.substring(0, 100)}...`)
    console.log()

    // Test cache hit (fetch same file again)
    console.log('3️⃣ Fetching same file again (should use cache)...')
    const startTime = Date.now()
    
    const file2 = await getFileContent({
      client,
      kv,
      owner: 'synerops',
      repo: 'syner',
      path: 'README.md',
      ref: 'main'
    })

    const elapsed = Date.now() - startTime
    console.log(`   ✅ File fetched in ${elapsed}ms`)
    
    if (file2?.sha !== file1.sha) {
      throw new Error('SHA mismatch on cached fetch')
    }
    console.log('   ✅ Cache working correctly (same SHA)')
    console.log()

    // Test fetching different file
    console.log('4️⃣ Fetching package.json...')
    const file3 = await getFileContent({
      client,
      kv,
      owner: 'synerops',
      repo: 'syner',
      path: 'package.json',
      ref: 'main'
    })

    if (!file3) {
      throw new Error('Failed to fetch package.json')
    }

    console.log('   ✅ Different file fetched')
    console.log(`   SHA: ${file3.sha}`)
    
    // Parse and show version
    try {
      const pkg = JSON.parse(file3.content)
      console.log(`   Package: ${pkg.name}`)
      console.log(`   Scripts: ${Object.keys(pkg.scripts || {}).join(', ')}`)
    } catch {
      console.log('   (Could not parse package.json)')
    }
    console.log()

    // Check what's in cache
    console.log('5️⃣ Checking cached keys...')
    const cachedKeys = await kv.list('github:')
    console.log(`   ✅ Found ${cachedKeys.length} GitHub-related keys in cache`)
    if (cachedKeys.length > 0) {
      console.log(`   Keys:`)
      cachedKeys.slice(0, 5).forEach(key => {
        console.log(`     - ${key}`)
      })
    }
    console.log()

    console.log('✅ All GitHub + KV tests passed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run tests
testGitHubWithKv().catch(console.error)