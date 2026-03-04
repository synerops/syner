# Planning Mode

How syner breaks down complex work into atomic actions.

## When This Mode Activates

- User explicitly requests planning for a task
- Analysis produces multiple actionable findings
- Any input that needs to become an executable sequence

## The Flow

1. **Evaluate** - Read the input (analysis output, findings, any structured content)
2. **Classify** - Determine what type of content this is
3. **Decide** - Plan, skip, or clarify
4. **Output** - Checklist or explanation

## Classification & Decision

| Found | Decision | Action |
|-------|----------|--------|
| 0 actionable items | Skip | Report "Nothing to action" |
| 1 clear item | Skip planning | Can execute directly |
| N clear items | Plan | Generate checklist |
| Ambiguous items | Clarify | List what needs clarification |
| Parse error | Abort | Report error |

## What Makes an Item "Clear"

An item is actionable when you can answer:
1. **Target**: What file(s) or resource(s) to modify?
2. **Action**: What specific change to make?
3. **Verification**: How to confirm it worked?

### Clear Examples
- "Fix version format in 12 SKILL.md files" → Target: `**/SKILL.md`, Action: normalize to `"0.x.x"`, Verify: grep for old format returns nothing
- "Review PR #18 for merge readiness" → Target: PR #18, Action: review and comment, Verify: comment posted

### Ambiguous Examples
- "Consider improving the architecture" → What improvement? What outcome?
- "Evaluate if X is needed" → And then what? No defined action.
- "Look into performance issues" → Which issues? What metric defines success?

## Output Format

```markdown
## Plan

- [ ] `[ID]` Brief description <!-- target:path/pattern, verify:how -->
- [ ] `[ID]` Brief description <!-- target:path/pattern, verify:how -->
```

The HTML comment is optional metadata for the execution phase.

**Ordering:**
1. No-dependency items first
2. Group by type (not by target) when possible
3. Smallest scope items before larger ones

## Handling Ambiguity

When items are ambiguous, don't discard them. Report them separately:

```markdown
## Plan

- [ ] `[D3]` Normalize version format (12 files)

---

**Needs clarification** (excluded from plan):
- "Consider consolidating open issues" → What's the expected outcome?
```

This preserves information while keeping the plan executable.

## Execution

After planning, each item should be executed atomically:

1. One item = one action (one PR, one comment, one change)
2. Mark done after successful execution
3. If more items remain, continue
4. If no more items, report completion

**Key constraint:** Never batch multiple items into one action.

## Examples

### Input: Skill Review Findings

```
## Consistency Issues
- [D1] 2 skills use skill.md instead of SKILL.md
- [D3] 12 skills use non-standard version format
- [D4] 1 skill missing frontmatter
```

### Output: Plan

```markdown
## Plan

- [ ] `[D4]` Add frontmatter to update-syner-app <!-- target:apps/dev/skills/update-syner-app -->
- [ ] `[D3]` Normalize version format <!-- target:**/SKILL.md -->
- [ ] `[D1]` Rename skill.md to SKILL.md <!-- target:vercel-setup,syner-daily-standup -->
```

### Input: Mixed Clear and Ambiguous

```
## @claude
→ PR #18 open 2 days — assess if ready to merge
→ Consider consolidating the 5 open issues into themes
```

### Output: Plan with Clarification

```markdown
## Plan

- [ ] Review PR #18, comment assessment <!-- target:PR #18 -->

---

**Needs clarification**:
- "Consider consolidating the 5 open issues into themes" → What action? Create tracking issue? Add labels? Close duplicates?
```
