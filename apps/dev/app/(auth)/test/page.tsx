'use client'

/**
 * GitHub OAuth Test Page
 *
 * Development-only UI for testing the GitHub OAuth flow and content fetching.
 */

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface ConnectionStatus {
  connected: boolean
  error?: string
}

interface FileResult {
  content: string
  sha: string
  path: string
  cache: {
    hits: number
    misses: number
    size: number
  }
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export default function GitHubTestPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<ConnectionStatus>({ connected: false })
  const [isLoading, setIsLoading] = useState(true)

  // Content fetching state
  const [owner, setOwner] = useState('synerops')
  const [repo, setRepo] = useState('syner')
  const [path, setPath] = useState('README.md')
  const [fileResult, setFileResult] = useState<FileResult | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setStatus({ connected: false, error: decodeErrorMessage(error) })
      setIsLoading(false)
      return
    }

    const connected = document.cookie
      .split('; ')
      .find((row) => row.startsWith('github_connected='))
      ?.split('=')[1] === 'true'

    setStatus({ connected })
    setIsLoading(false)
  }, [searchParams])

  function decodeErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      access_denied: 'You denied access to your GitHub account',
      missing_params: 'Missing required parameters in callback',
      invalid_state: 'Invalid state parameter (possible CSRF attack)',
      invalid_nonce: 'Invalid nonce (session expired or CSRF attack)',
      token_exchange_failed: 'Failed to exchange code for token',
    }
    return errorMessages[error] ?? `Unknown error: ${error}`
  }

  function handleConnect() {
    window.location.href = '/api/auth/github?origin=dev&returnUrl=/test'
  }

  function handleDisconnect() {
    document.cookie = 'github_connected=; path=/; max-age=0'
    document.cookie = 'github_access_token=; path=/; max-age=0'
    setStatus({ connected: false })
    setFileResult(null)
  }

  async function handleFetchContent() {
    setIsFetching(true)
    setFetchError(null)
    setFileResult(null)

    try {
      const params = new URLSearchParams({ owner, repo, path })
      const response = await fetch(`/api/github/content?${params}`)
      const data = await response.json()

      if (!response.ok) {
        setFetchError(data.error ?? 'Failed to fetch content')
        return
      }

      setFileResult(data)
    } catch {
      setFetchError('Network error')
    } finally {
      setIsFetching(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        <p className="text-sm text-neutral-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 max-w-2xl w-full">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">GitHub OAuth Test</h1>
        <p className="text-neutral-500 text-sm">
          Test OAuth flow and content fetching with cache.
        </p>
      </div>

      {status.error && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-300">{status.error}</p>
        </div>
      )}

      {status.connected ? (
        <div className="w-full flex flex-col gap-6">
          {/* Connection status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 dark:border-green-900 dark:bg-green-950">
              <GitHubIcon className="h-4 w-4 text-green-700 dark:text-green-300" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Connected
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Disconnect
            </button>
          </div>

          {/* Fetch form */}
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <h2 className="text-sm font-medium mb-4">Fetch Markdown File</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Owner</label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                  placeholder="owner"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Repo</label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                  placeholder="repo"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Path</label>
                <input
                  type="text"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="w-full rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                  placeholder="README.md"
                />
              </div>
            </div>
            <button
              onClick={handleFetchContent}
              disabled={isFetching}
              className="w-full rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50"
            >
              {isFetching ? 'Fetching...' : 'Fetch Content'}
            </button>
          </div>

          {/* Error */}
          {fetchError && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950 p-4">
              <p className="text-sm text-red-700 dark:text-red-300">{fetchError}</p>
            </div>
          )}

          {/* Result */}
          {fileResult && (
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <span className="text-sm font-mono">{fileResult.path}</span>
                <span className="text-xs text-neutral-500">
                  Cache: {fileResult.cache.hits} hits / {fileResult.cache.misses} misses / {fileResult.cache.size} entries
                </span>
              </div>
              <pre className="p-4 text-sm overflow-auto max-h-96 whitespace-pre-wrap font-mono bg-white dark:bg-neutral-950">
                {fileResult.content}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <GitHubIcon className="h-5 w-5" />
          Connect with GitHub
        </button>
      )}
    </div>
  )
}
