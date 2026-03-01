# GitHub CLI

Use `gh` directly for all GitHub operations.

## Authentication

If `gh` fails with an authentication error:

```bash
bunx @syner/github create-app-token | gh auth login --with-token
```

Then retry the command.

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
