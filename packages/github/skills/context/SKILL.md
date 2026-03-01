---
name: syner-github-context
description: Context from GitHub issues, PRs, and repository info. Use when the task involves code review, issue tracking, pull requests, or repository data.
---

Gather context from GitHub relevant to the current task.

## What This Provides

- Open issues and their status
- Pull request details and review status
- Repository information and recent activity
- Code search results

## Authentication

If `gh` fails with an authentication error, authenticate first:

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

## How to Gather

Use the `gh` CLI to fetch relevant information:

```bash
# List open issues
gh issue list --state open

# List pull requests
gh pr list --state open

# View repository info
gh repo view

# Search code
gh search code "query" --repo owner/repo

# View specific issue or PR
gh issue view <number>
gh pr view <number>
```

## Output

Condense findings into a brief summary focusing on what's relevant to the task:

- Relevant issues (number, title, status, assignee)
- Relevant PRs (number, title, review status, CI status)
- Blocking items or dependencies
- Recent activity that affects the task
