# Planning Implementation

How planning mode operates when working with issues and PRs.

## Labels as State Machine

| Label | State | Action |
|-------|-------|--------|
| `needs-planning` | Analysis done, needs plan | Generate checklist, swap to `claude` |
| `claude` + checklist | Plan exists, ready to execute | Execute next unchecked item |
| `claude` + no checklist | Ad-hoc request | Respond directly (legacy behavior) |

## Planning Mode in Issues

When an issue has `needs-planning`:

1. Read issue body (findings/analysis)
2. Apply planning mode (see `skills/syner/planning.md`)
3. Update issue body with generated plan
4. Remove `needs-planning`, add `claude`

## Execution Mode in Issues

When an issue has `claude` AND body contains `## Plan` with checkboxes:

1. Parse checklist from issue body
2. Find first unchecked item (`- [ ]`)
3. Execute that ONE item:
   - Read Target, Context, Action, Verify
   - Perform the action
   - Create branch + commits
   - Create PR referencing the issue
4. Update issue: mark checkbox `- [x]`
5. Evaluate remaining items:
   - More items → keep `claude` label
   - No more items → remove `claude`, close issue

## PR Creation

After executing an item, create PR with:

```markdown
## Summary
[What was done]

## Issue
Addresses item from #[issue-number]

## Verify
[How to confirm it worked]
```

## Item Format

Each checklist item in the issue:

```markdown
- [ ] `[ID]` Brief description
  Target: what to modify
  Context: why it matters
  Action: what to do
  Verify: how to confirm
```

## Workflows

These workflows create issues with `needs-planning`:

- `skill-review.yml` - Ecosystem consistency
- `daily-standup.yml` - Actionable standup items

## The Loop

```
Workflow creates issue + [needs-planning]
        ↓
claude.yml triggers → planning mode → checklist + [claude]
        ↓
claude.yml triggers → execute item 1 → PR
        ↓
Human approves PR
        ↓
Workflow re-evaluates → execute item 2 → PR
        ↓
... repeat until done
```
