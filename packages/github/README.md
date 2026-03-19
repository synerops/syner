# @syner/github

GitHub App authentication, Octokit client factories, issue/comment/label actions, webhook verification, and Vercel AI SDK tools for repository operations.

## Quick Start

```bash
bun add @syner/github
```

### Environment variables

```bash
GITHUB_APP_ID=123456                      # GitHub App ID
GITHUB_APP_INSTALLATION_ID=78901234       # Installation ID for target org
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA..." # Private key contents (or use PEM_PATH)
GITHUB_APP_PEM_PATH=/path/to/key.pem     # Alternative: path to PEM file
GITHUB_WEBHOOK_SECRET=whsec_...           # Webhook secret for signature verification
```

You need either `GITHUB_APP_PRIVATE_KEY` (key contents) or `GITHUB_APP_PEM_PATH` (file path), not both.

### Authenticate the GitHub CLI

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

This prints a short-lived installation token to stdout, designed to pipe into `gh auth login`.

### Make your first API call

```ts
import { createOctokit, createComment } from '@syner/github'

const octokit = createOctokit()

await createComment({
  octokit,
  owner: 'synerops',
  repo: 'syner',
  issueNumber: 42,
  body: 'Hello from @syner/github',
})
```

---

## For Developers

### Setup

1. Register a [GitHub App](https://docs.github.com/en/apps/creating-github-apps) with the permissions your use case needs (issues read/write, pull requests read/write, contents read, etc.)
2. Install the App on your organization or repository
3. Set the four environment variables above
4. Import from `@syner/github` — auth is handled automatically

### Package exports

| Import path | Contents |
|---|---|
| `@syner/github` | Everything (barrel re-export) |
| `@syner/github/octokit` | `getToken`, `createOctokit`, `createThrottledOctokit`, `clearTokenCache`, `isTokenValid`, `getTokenStatus` |
| `@syner/github/actions` | Issue CRUD, comment CRUD, labels, reactions, thread reading |
| `@syner/github/events` | Webhook signature verification, event type definitions |
| `@syner/github/tools` | Vercel AI SDK tools, `createAllTools` factory |

### Token lifecycle

`getToken()` generates a GitHub App installation token and caches it for 55 minutes (tokens expire at 60 minutes). Concurrent calls during a cache miss are deduplicated — only one API request is made.

```ts
import { getToken, isTokenValid, getTokenStatus, clearTokenCache } from '@syner/github/octokit'

// Get a token (cached automatically)
const token = await getToken()

// Check cache status
isTokenValid()              // boolean
getTokenStatus()            // { cached: boolean, expiresIn?: number }

// Force refresh (e.g., after key rotation)
clearTokenCache()
```

### Octokit factories

Two factories, both pre-wired with GitHub App auth:

```ts
import { createOctokit, createThrottledOctokit } from '@syner/github/octokit'

// Standard — no rate limit handling
const octokit = createOctokit()

// Throttled — auto-retries on rate limits
const throttled = createThrottledOctokit({
  onRateLimit: (retryAfter, retryCount) => {
    console.log(`Rate limit hit, retry #${retryCount + 1} after ${retryAfter}s`)
  },
  onSecondaryRateLimit: (retryAfter) => {
    console.log(`Abuse limit, retry after ${retryAfter}s`)
  },
})
```

`createThrottledOctokit` uses `@octokit/plugin-throttling`. It retries primary rate limits up to 2 times and always retries secondary (abuse) limits.

### Webhook integration

Wire webhook verification into your route handler:

```ts
import { verifyWebhookSignature, extractWebhookHeaders } from '@syner/github/events'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const { signature, event, deliveryId } = extractWebhookHeaders(request.headers)

  const valid = verifyWebhookSignature({
    payload: rawBody,
    signature: signature!,
    secret: process.env.GITHUB_WEBHOOK_SECRET!,
  })

  if (!valid) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Process the event...
  const payload = JSON.parse(rawBody)
}
```

Signature verification uses HMAC-SHA256 with timing-safe comparison. The `extractWebhookHeaders` helper works with both `Headers` objects and plain `Record<string, string>`.

### Architecture

```
GitHub App
  |
  ├── Webhooks ──> verifyWebhookSignature() ──> syner.bot event handler
  |
  └── API calls
        |
        ├── getToken() ──> cached installation token ──> CLI (gh auth)
        |
        ├── createOctokit() ──> actions (comments, issues, labels)
        |
        └── createThrottledOctokit() ──> tools (AI SDK) ──> agent execution
```

### Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Missing required environment variables: GITHUB_APP_ID or GITHUB_APP_INSTALLATION_ID` | Env vars not set | Set `GITHUB_APP_ID` and `GITHUB_APP_INSTALLATION_ID` |
| `Missing private key: set GITHUB_APP_PRIVATE_KEY or GITHUB_APP_PEM_PATH` | Neither key var is set | Set one of the two private key variables |
| 401 from GitHub API | Token expired or wrong App credentials | Check App ID and installation ID match; `clearTokenCache()` if rotating keys |
| 403 from actions/tools | App lacks required permissions | Check App installation permissions in GitHub settings |
| 404 from `removeLabel` | Label not on the issue | Check issue labels before removing |
