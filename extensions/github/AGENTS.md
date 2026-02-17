# @syner/github

GitHub OAuth and API integration. Provides OAuth flow and cached content fetching.

## Usage

### OAuth

```typescript
import { createAuthorizationUrl, exchangeCodeForToken } from '@syner/github/oauth'

// Generate auth URL
const url = createAuthorizationUrl(config, { origin: 'dev', nonce, returnUrl })

// Exchange code for tokens
const tokens = await exchangeCodeForToken(config, code)
```

### Content API

```typescript
import { createGitHubClient, getFileContent } from '@syner/github'
import { createUpstashCache } from '@syner/upstash/system/data/cache'

const cache = createUpstashCache()
const client = createGitHubClient({ accessToken })

const file = await getFileContent({
  client,
  cache,
  owner: 'synerops',
  repo: 'syner',
  path: 'README.md',
})
// Returns: { content, sha, path, encoding }
```

## Key Files

| File | Purpose |
|------|---------|
| `src/oauth/client.ts` | `createAuthorizationUrl`, `exchangeCodeForToken` |
| `src/api/client.ts` | `createGitHubClient` with rate limit handling |
| `src/api/content.ts` | `getFileContent` with ETag caching |
| `src/cache/cache.ts` | `getCachedContent` revalidation logic |

## Environment

Requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` for OAuth.
