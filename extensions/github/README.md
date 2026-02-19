# @syner/github

GitHub OAuth and API integration for Syner OS. Enables users to connect their GitHub account and provides KV-cached access to repository content.

## Overview

This extension provides two main capabilities for Syner OS agents:

1. **OAuth Flow**: Connect users' GitHub accounts via syner.dev
2. **Content API**: Read repository files with ETag-based caching using KV store

Agents use this to fetch markdown files from GitHub while respecting rate limits through intelligent caching.

```typescript
import { createGitHubClient, getFileContent } from '@syner/github'
import { createUpstashKv } from '@syner/upstash/context/kv'

const client = createGitHubClient({ accessToken })
const kv = createUpstashKv()
const file = await getFileContent({ client, kv, owner, repo, path })
```

## Setup

### 1. Register a GitHub App

1. Go to [GitHub Developer Settings](https://github.com/settings/apps)
2. Click **New GitHub App**
3. Configure:
   - **App name**: Your app name
   - **Homepage URL**: Your app URL
   - **Callback URL**: `https://your-domain/api/auth/github/callback`
4. Under Permissions:
   - **Repository permissions** → Contents: Read-only
5. Click **Create GitHub App**
6. Generate a client secret

### 2. Configure Environment Variables

```env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

### 3. Install the Package

```bash
bun add @syner/github
```

## API

### OAuth

| Function | Description |
|----------|-------------|
| `createAuthorizationUrl(config, state)` | Generate OAuth authorization URL |
| `exchangeCodeForToken(config, code)` | Exchange auth code for tokens |
| `decodeState(encoded)` | Decode state parameter |

### Content

| Function | Description |
|----------|-------------|
| `createGitHubClient(options)` | Create Octokit client with rate limiting |
| `getFileContent(options)` | Fetch file with ETag caching via KV |

### KV Cache Utilities

| Function | Description |
|----------|-------------|
| `contentCacheKey(owner, repo, ref, path)` | Generate KV key |
| `getCachedContent(options, key, fetcher)` | ETag revalidation with KV |

## License

MIT