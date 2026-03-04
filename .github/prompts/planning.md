# Planning Mode

Transform `@claude` findings into Acceptance Criteria. **Do NOT read or verify files.**

## Input

Issue body containing `### @claude` section with prioritized findings.

## Process

1. The issue body is already in your context (from the trigger)
2. Find the `### @claude` section - this has the prioritized action items
3. Transform each item → one checklist item (max 10)
4. Update the issue using `gh issue edit`
5. Swap labels: remove `needs-planning`, add `claude`

## Rules

- **NO file reading** — trust the findings as written
- **ONE item per finding** — keep atomic for single PRs
- **Include issue codes** — (B3), (D2), etc. for traceability
- **Max 10 items** — if more, take top priorities only

## Commands

```bash
# Get issue number from context
ISSUE_NUMBER=<from GitHub event context>

# Read current body
BODY=$(gh issue view $ISSUE_NUMBER --json body --jq '.body')

# Append Acceptance Criteria and update
gh issue edit $ISSUE_NUMBER --body "${BODY}

## Acceptance Criteria

- [ ] item 1
- [ ] item 2
"

# Swap labels
gh issue edit $ISSUE_NUMBER --remove-label "needs-planning" --add-label "claude"
```

## Acceptance Criteria Format

```markdown
## Acceptance Criteria

- [ ] `skill-name`: description of fix (CODE)
- [ ] `skill-name`: description of fix (CODE)
```

## Example

**Input (`### @claude` section):**
```
→ Highest-value fixes:
1. `syner-find-links` [B4] — missing input guard
2. `syner-daily-standup` [B2] — output path not anchored
3. `syner-backlog-reviewer` [B3] — fragile skill reference
```

**Output (append to issue):**
```markdown
## Acceptance Criteria

- [ ] `syner-find-links`: add AskUserQuestion fallback when no arguments (B4)
- [ ] `syner-daily-standup`: anchor output path to project root (B2)
- [ ] `syner-backlog-reviewer`: use `/skill-name` instead of Glob path (B3)
```

## Fallback

If no `### @claude` section or empty:
1. Comment on issue: "No actionable findings to plan."
2. Remove `needs-planning` label
3. Do NOT add `claude` label
