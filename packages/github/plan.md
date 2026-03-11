---
name: github
description: Converts plans to GitHub issues
platform: github
input: .syner/plan.json
tools: [Bash]
---

# GitHub Plan

Convert a plan output into GitHub issues.

## Input

JSON plan at `{input}` (default: `.syner/plan.json`)

## Process

1. Read the plan JSON
2. Check status:
   - `planned` → continue
   - `empty` → print "No actionable items" and exit
   - `needs_clarification` → print clarifications and exit
   - `error` → print error message and exit
3. Take `items[0]` only (iterative, one at a time)
4. Create issue with `gh`

## Execution

```bash
# Read plan
PLAN=$(cat .syner/plan.json)
STATUS=$(echo "$PLAN" | jq -r '.status')

if [ "$STATUS" != "planned" ]; then
  echo "Status: $STATUS"
  exit 0
fi

# Extract first item
ITEM=$(echo "$PLAN" | jq '.items[0]')
ID=$(echo "$ITEM" | jq -r '.id')
TITLE=$(echo "$ITEM" | jq -r '.title')
TARGET=$(echo "$ITEM" | jq -r '.target | join(", ")')
CONTEXT=$(echo "$ITEM" | jq -r '.context')
ACTION=$(echo "$ITEM" | jq -r '.action')
VERIFY=$(echo "$ITEM" | jq -r '.verify')

# Create issue
gh issue create \
  --title "[$ID] $TITLE" \
  --label "claude" \
  --body "$(cat <<EOF
## Target
$TARGET

## Context
$CONTEXT

## Action
$ACTION

## Verify
$VERIFY
EOF
)"
```

## Output

Print the created issue URL.

## Why One Item at a Time

- Item #3 might be invalid after #1 changes the codebase
- Allows plan adjustment based on learnings
- Matches how a human PM would work
