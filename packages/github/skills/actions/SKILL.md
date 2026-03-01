---
name: syner-github-actions
description: GitHub operations like creating PRs, commenting on issues, and managing repository state. Use when the task requires making changes to GitHub.
---

Execute actions on GitHub.

## Available Actions

- Create and manage issues
- Create and manage pull requests
- Comment on issues and PRs
- Assign reviewers and labels
- Merge PRs
- Create releases

## Authentication

If `gh` fails with an authentication error, authenticate first:

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

## How to Execute

### Issues

```bash
# Create issue
gh issue create --title "Title" --body "Description"

# Comment on issue
gh issue comment <number> --body "Comment text"

# Close issue
gh issue close <number>

# Assign issue
gh issue edit <number> --add-assignee username
```

### Pull Requests

```bash
# Create PR
gh pr create --title "Title" --body "Description"

# Request review
gh pr edit <number> --add-reviewer username

# Merge PR
gh pr merge <number> --merge

# Add labels
gh pr edit <number> --add-label "label-name"
```

### Releases

```bash
# Create release
gh release create v1.0.0 --title "Release v1.0.0" --notes "Release notes"
```

## Verification

After each action, verify success:

```bash
# Verify issue
gh issue view <number>

# Verify PR
gh pr view <number>

# Verify release
gh release view v1.0.0
```
