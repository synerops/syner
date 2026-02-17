# Developer Hub

Documentation site and API gateway for Syner OS (syner.dev).

## Routes

| Path | Method | Description |
|------|--------|-------------|
| `/api/auth/github` | GET | Initiate GitHub OAuth flow |
| `/api/auth/github/callback` | GET | OAuth callback handler |
| `/api/github/content` | GET | Fetch file content from GitHub repos |
| `/api/search` | GET | Documentation search (Fumadocs/Orama) |
| `/llms-full.txt` | GET | Full documentation export for LLMs |

## Structure

```
app/
├── api/
│   ├── auth/github/       # OAuth flow
│   ├── github/content/    # Content API
│   └── search/            # Docs search
├── docs/[[...slug]]/      # Documentation pages
└── llms-full.txt/         # LLM export route
```

## Testing

```bash
# Initiate OAuth (redirects to GitHub)
curl -s http://localhost:3002/api/auth/github?origin=dev

# Fetch GitHub content (requires auth)
curl -s "http://localhost:3002/api/github/content?owner=synerops&repo=syner&path=README.md"

# Search docs
curl -s "http://localhost:3002/api/search?q=sdk" | jq .
```

## Environment

| Variable | Purpose |
|----------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret |
