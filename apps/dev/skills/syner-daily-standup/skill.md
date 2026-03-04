---
name: syner-daily-standup
description: Generate the daily standup report by analyzing GitHub activity and vault notes. Use on scheduled runs or when you need a status overview.
metadata:
  author: syner
  version: "1.1"
allowed-tools:
  - Bash(gh issue list *)
  - Bash(gh pr list *)
  - Bash(gh api *)
  - Bash(date *)
  - Bash(mkdir *)
  - Write
  - Glob
  - Read
---

# Daily Standup

Generate the daily standup report.

## Sources

### GitHub - What's open

```bash
# Issues assigned to me
gh issue list --assignee @me --state open --json number,title,updatedAt,labels

# My open PRs
gh pr list --author @me --state open --json number,title,createdAt,reviewRequests

# PRs waiting for my review
gh pr list --search "review-requested:@me" --json number,title,author,createdAt
```

### GitHub - What happened yesterday

```bash
# Issues I closed
gh issue list --assignee @me --state closed --json number,title,closedAt | jq '[.[] | select(.closedAt > "YYYY-MM-DD")]'

# PRs I merged
gh pr list --author @me --state merged --json number,title,mergedAt | jq '[.[] | select(.mergedAt > "YYYY-MM-DD")]'

# My commits (replace YYYY-MM-DD with yesterday's date)
gh api /search/commits -X GET -f q="author:@me committer-date:>=YYYY-MM-DD" --jq '.items[:10] | .[].commit.message'
```

### Notes

- `Glob apps/*/vaults/**/*.md`
- Read and analyze: find pending items, blockers, or anything needing attention

## Criteria

- **Stale**: 7+ days without activity
- **Exclude**: labels `blocked`, `waiting-external`
- **Prioritize**: what can be unblocked today
- **Highlight**: PRs waiting for review (mine or others')

## Output

Write the standup report to:

```
reports/standup-YYYY-MM-DD.md
```

Create the `reports/` directory if it doesn't exist.

### Format

```markdown
# Standup YYYY-MM-DD

## Yesterday
- [Brief list of completed items]

## Today
- [What's planned / priority items]

## Blockers
- [Any blockers, or "None"]
```

Max 15 lines. If nothing notable: "✅ All clear"

The workflow will handle creating a GitHub issue from this file if needed.
