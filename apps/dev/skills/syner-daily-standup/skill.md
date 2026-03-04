---
name: syner-daily-standup
description: Generate daily standup reports from GitHub activity and vault notes. Use when asked for "standup", "daily status", "what's pending", "what did I work on", or on scheduled CI runs. Also triggers for progress updates and blockers review.
metadata:
  author: syner
  version: "1.2"
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

Generate a concise standup report from GitHub activity and vault notes.

## Step 1: Get dates

```bash
# Today's date for the report filename
TODAY=$(date +%Y-%m-%d)

# Yesterday's date for filtering activity
YESTERDAY=$(date -d 'yesterday' +%Y-%m-%d)
```

Use `$TODAY` for the output filename and `$YESTERDAY` for filtering recent activity.

## Step 2: Gather GitHub activity

### What's currently open

```bash
# Issues assigned to me
gh issue list --assignee @me --state open --json number,title,updatedAt,labels

# My open PRs
gh pr list --author @me --state open --json number,title,createdAt,reviewRequests

# PRs waiting for my review
gh pr list --search "review-requested:@me" --json number,title,author,createdAt
```

### What happened since yesterday

```bash
# Issues I closed recently
gh issue list --assignee @me --state closed --json number,title,closedAt --limit 20

# PRs I merged recently
gh pr list --author @me --state merged --json number,title,mergedAt --limit 20

# My recent commits
gh api /search/commits -X GET -f q="author:@me committer-date:>=$YESTERDAY" --jq '.items[:10] | .[].commit.message'
```

Filter results to only include items from yesterday or today.

## Step 3: Check vault notes

```bash
# Discover all vault notes
Glob apps/*/vaults/**/*.md
```

Read relevant notes looking for:
- Pending items or TODOs
- Blockers mentioned
- Anything tagged with today's date

## Step 4: Write the report

```bash
mkdir -p reports
```

Write to `reports/standup-$TODAY.md` using this format:

```markdown
# Standup YYYY-MM-DD

## Yesterday
- [Completed items - issues closed, PRs merged, commits]

## Today
- [Priority items from open issues/PRs]
- [Items from vault notes needing attention]

## Blockers
- [Any blockers, or "None"]
```

Keep it under 15 lines. If nothing notable, just write "✅ All clear".

## Criteria

- **Stale**: Flag items with 7+ days without activity
- **Exclude**: Skip items with labels `blocked` or `waiting-external`
- **Prioritize**: What can be unblocked today
- **Highlight**: PRs waiting for review
