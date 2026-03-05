# syner.bot - Agent Documentation

Technical reference for interacting with syner.bot.

## Architecture

```
/api/chat              ← Main agent (local only)
    ↓
/api/webhooks/github   ← GitHub webhook adapter
/api/webhooks/slack    ← (future) Slack adapter
```

## Local Development

### Chat Endpoint

**Status:** Ignored from deployment (`.gitignore`), local only.

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Your question here"}'
```

**Response:**
```json
{
  "text": "Agent response",
  "steps": 1,
  "toolCalls": [{"tool": "web_search", "args": {...}}]
}
```

### Available Tools

| Tool | Description | Model Required |
|------|-------------|----------------|
| `web_search` | Search the internet | claude-sonnet-4-5+ |
| `web_fetch` | Fetch URL content | claude-sonnet-4-5+ |

### Model

Currently using `claude-sonnet-4-5` which supports server tools.

## Webhooks (Production)

### GitHub

**Endpoint:** `POST /api/webhooks/github`

**Trigger:** Mention `@synerbot` in issues or PRs.

**Tools available:**
- `getRepoInfo` - Repository metadata
- `listDirectory` - List files
- `getFileContent` - Read files
- `searchCode` - Search code
- `createPullRequest` - Create PRs

**Security:** Webhook signature verification required.

## Environment Variables

```bash
ANTHROPIC_API_KEY=        # Required
GITHUB_APP_ID=            # For GitHub webhook
GITHUB_APP_INSTALLATION_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
```

## Adding New Tools

1. Server tools (Anthropic executes): Add to `/api/chat`
2. Client tools (we execute): Add to `@syner/github` or create new package
3. Webhook tools: Will eventually delegate to `/api/chat`
