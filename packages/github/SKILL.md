---
name: github-cli
description: Use gh CLI directly for all GitHub operations including issues, PRs, and API calls. Use when interacting with GitHub from the command line.
tools: Bash
metadata:
  author: syner
  version: "0.1.0"
---

# GitHub CLI

Use `gh` directly for all GitHub operations.

## Prerequisites

Before using `gh`, check auth status:

```bash
gh auth status
```

If not authenticated (or token invalid), authenticate first:

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

## Examples

```bash
# Issues
gh issue create --title "Bug" --body "Description"
gh issue comment 123 --body "Comment text"

# Pull Requests
gh pr create --title "Feature" --body "Changes"
gh pr view 456

# API calls
gh api /user
```

## Why GitHub App Auth?

- No personal access tokens stored
- Fine-grained permissions per installation
- Actions attributed to the app, not a user

## References

- [planning.md](planning.md) - How planning mode works with issues and PRs
