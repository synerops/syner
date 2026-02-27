# GitHub Authentication

Use `bun run github exec -- gh <command>` for all GitHub operations.

This wraps the `gh` CLI with GitHub App authentication, injecting `GH_TOKEN` automatically.

## Examples

```bash
# Issues
bun run github exec -- gh issue create --title "Bug" --body "Description"
bun run github exec -- gh issue comment 123 --body "Comment text"

# Pull Requests
bun run github exec -- gh pr create --title "Feature" --body "Changes"
bun run github exec -- gh pr view 456

# API calls
bun run github exec -- gh api /user
```

## Why

- Avoids storing personal access tokens
- Uses fine-grained GitHub App permissions
- Actions are attributed to the app, not a user
