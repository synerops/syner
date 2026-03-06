---
name: syner-gh-auth
description: Authenticate gh CLI using GitHub App tokens. Use BEFORE any gh command (issues, PRs, API calls). Use when gh auth fails, when "not logged in" errors appear, or proactively before GitHub operations.
tools: [Bash]
metadata:
  author: syner
  version: "0.1.1"
---

# GitHub CLI Authentication

Authenticate `gh` using secure, expirable GitHub App tokens.

## When to Use

- Before running any `gh` command
- When you see "not logged into any GitHub hosts" error
- When `gh auth status` shows no authentication
- Proactively before creating PRs, issues, or API calls

## Authenticate

One command that checks and fixes auth if needed:

```bash
gh auth status 2>&1 || bunx @syner/github create-app-token | gh auth login --with-token
```

| Part | What it does |
|------|--------------|
| `gh auth status` | Check if authenticated |
| `2>&1` | Redirect stderr so `\|\|` can see errors |
| `\|\|` | If auth fails, run the next part |
| `bunx @syner/github create-app-token` | Generate short-lived token |
| `\| gh auth login --with-token` | Authenticate gh with that token |

## Then use gh normally:

```bash
# Issues
gh issue create --title "Title" --body "Description"
gh issue list
gh issue comment 123 --body "Comment"

# Pull Requests
gh pr create --title "Title" --body "Description"
gh pr list
gh pr view 456

# API
gh api /user
gh api repos/{owner}/{repo}/issues
```

## Why GitHub App Auth?

- **No stored tokens** - Generated on demand, expires quickly
- **Fine-grained permissions** - Only what the App installation allows
- **Audit trail** - Actions attributed to the App, not a user
- **Secure by default** - No long-lived credentials to leak

## Troubleshooting

If authentication fails:

1. Check `GITHUB_APP_ID` and `GITHUB_PRIVATE_KEY` env vars are set
2. Verify the App is installed on the target repository
3. Check App permissions include required scopes
