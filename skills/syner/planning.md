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
4. **Output** - Ready-to-use instruction

## Classification & Decision

| Found | Decision | Action |
|-------|----------|--------|
| 0 actionable items | Skip | Report "Nothing to action" |
| 1 clear item | Skip planning | Can execute directly |
| N clear items | Plan | Generate checklist |
| Ambiguous items | Clarify | List what needs clarification |
| Parse error | Abort | Report error |

## What Makes an Item "Clear"

An item is actionable when you can answer all four:

1. **Target**: What file(s) or resource(s) to modify?
2. **Context**: Why does this matter? What's the current state?
3. **Action**: What specific change to make?
4. **Verify**: How to confirm it worked?

### Clear Examples
- "Fix version format in 12 SKILL.md files" → Has target, context (ecosystem consistency), action (normalize), verify (grep)
- "Review PR #18 for merge readiness" → Has target (PR), context (open 2 days), action (review), verify (comment posted)

### Ambiguous Examples
- "Consider improving the architecture" → No target, no action, no verify
- "Evaluate if X is needed" → No action after evaluation
- "Look into performance issues" → No specific target or success metric

## Output Format

The output should be **ready-to-use** - a self-contained instruction that works in any context.

```markdown
Execute these items one at a time. After completing each, mark it done and proceed to the next.

## Plan

- [ ] `[ID]` Brief description
  Target: what files/resources to modify
  Context: why it matters, current state, relevant background
  Action: what to do specifically
  Verify: how to confirm it worked

- [ ] `[ID]` Brief description
  Target: ...
  Context: ...
  Action: ...
  Verify: ...

---

Needs clarification (excluded):
- "Item description" → What's unclear about it
```

**Ordering:**
1. No-dependency items first
2. Group by type (not by target) when possible
3. Smallest scope items before larger ones

## Handling Ambiguity

Don't discard ambiguous items. Report them separately so they can be clarified:

```markdown
## Plan

- [ ] `[D3]` Normalize version format
  Target: 12 SKILL.md files across apps/
  Context: Project is pre-1.0, versions like "1.1" are inflated
  Action: Change to "0.x.x" format
  Verify: All versions match "0.\d+.\d+"

---

Needs clarification (excluded):
- "Consider consolidating open issues" → What's the expected outcome? Create tracking issue? Add labels?
```

## Execution

After planning, each item should be executed atomically:

1. One item = one action (one PR, one comment, one change)
2. Mark done after successful execution
3. If more items remain, continue
4. If no more items, report completion

**Key constraint:** Never batch multiple items into one action.

## Example: Complete Planning Mode Output

### Input

```
## Consistency Issues
- [D1] 2 skills use skill.md instead of SKILL.md
- [D3] 12 skills use non-standard version format
- [D4] 1 skill missing frontmatter

## Per-Skill Issues
- [B2] vercel-setup has hardcoded paths
```

### Output

```markdown
Execute these items one at a time. After completing each, mark it done and proceed to the next.

## Plan

- [ ] `[D4]` Add frontmatter to update-syner-app
  Target: apps/dev/skills/update-syner-app/SKILL.md
  Context: This skill has no frontmatter - starts with "# Skill:". All other skills have standardized YAML frontmatter for discoverability.
  Action: Add frontmatter with name, description, metadata.version:"0.1.0"
  Verify: File starts with valid YAML frontmatter block

- [ ] `[D1]` Rename skill.md to SKILL.md
  Target: apps/bot/skills/vercel-setup/, apps/dev/skills/syner-daily-standup/
  Context: Ecosystem convention is SKILL.md (uppercase). These 2 skills use lowercase, breaking consistency.
  Action: Rename skill.md to SKILL.md in both locations
  Verify: Glob("**/skill.md") returns empty

- [ ] `[D3]` Normalize version format
  Target: 12 skills (syner-load-all, syner-find-ideas, syner-find-links, etc.)
  Context: Project is pre-1.0. Versions like "1.1" or "2.0" are inflated. Standard is "0.x.x" semver.
  Action: Change all to "0.x.x" format (e.g., "1.1" → "0.1.1")
  Verify: All versions match pattern "0.\d+.\d+"

- [ ] `[B2]` Remove hardcoded paths in vercel-setup
  Target: apps/bot/skills/vercel-setup/SKILL.md (lines 47, 70)
  Context: Contains "/Users/ronny/synerops/syner/apps/bot" - only works on one machine.
  Action: Replace absolute paths with relative navigation from project root
  Verify: No absolute user paths in file
```
