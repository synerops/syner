---
name: syner-enhance-skills
description: Improve an existing skill by auditing and applying fixes. Use when asked to "enhance skill", "improve skill", "fix skill issues", or when code-reviewer detects skill file changes. Delegates to syner-skill-reviewer for audit, then proposes and applies fixes with user confirmation.
agent: dev
metadata:
  author: syner
  version: "0.2.0"
tools: [Read, Glob, Grep, Edit, AskUserQuestion, Skill]
---

# Skill Enhancer

Audit a skill and apply fixes with user confirmation.

This skill wraps `/syner-skill-reviewer` (audit-only) and adds the fix layer. Review reports, you decide. Enhance applies.

## Process

1. **Invoke audit**: Run `/syner-skill-reviewer` on the target skill
2. **Parse findings**: Extract issues by severity (Critical, Warning, Suggestion)
3. **Propose fixes**: For each finding, generate a concrete fix
4. **Confirm with user**: Use `AskUserQuestion` to confirm changes
5. **Apply fixes**: Use `Edit` to apply approved changes

## Input

The skill name or path. Examples:
- `syner-skill-reviewer`
- `skills/syner/SKILL.md`
- `.claude/skills/my-skill/SKILL.md`

If no skill specified, use `AskUserQuestion` to ask which skill to enhance.

## Step 1: Audit

Invoke the reviewer skill:

```
Skill(skill="syner-skill-reviewer", args="<skill-name> deep")
```

Always request "deep" review to get all findings.

## Step 2: Parse and Prioritize

From the audit output, extract:
- **Critical** issues — must fix (identity confusion, injection risk)
- **Warning** issues — should fix (vague tools, fragile paths)
- **Suggestion** issues — nice to fix (conventions, frontmatter)

## Step 3: Generate Fixes

For each finding, determine the concrete change:

| Finding Type | Fix Approach |
|--------------|--------------|
| First-person voice (A1) | Rewrite to imperative form |
| Identity patterns (A2) | Remove "You are", use directives |
| Heading tone (A3) | Rename to descriptive heading |
| Tool specificity (B1) | Add explicit tool names |
| Path resolution (B2) | Anchor to project root |
| Skill references (B3) | Use `/skill-name` format |
| Missing input handling (B4) | Add default or AskUserQuestion |
| Output structure (B5) | Describe output qualities, remove rigid placeholder templates |
| Description quality (B6) | Replace trigger lists with value-describing sentences |
| Missing delegation (B7) | Add execution contract for multi-step operations |

## Step 4: Confirm Changes

Present all proposed changes to the user:

```
AskUserQuestion with options:
- "Apply all fixes" (recommended)
- "Review each fix individually"
- "Apply critical only"
- "Cancel"
```

If user chooses individual review, present each fix one at a time.

## Step 5: Apply Fixes

Use `Edit` to apply each approved change. After all edits:

1. Read the modified file to verify changes
2. Optionally re-run `/syner-skill-reviewer` to confirm issues resolved

## Output

```
## Enhanced: `[skill-name]`

### Applied
- [A1] Rewrote "What I Do" → "Process"
- [B2] Anchored paths to project root

### Skipped (user choice)
- [C2] Frontmatter additions

### Verification
Re-audit shows: [X issues remaining | clean]
```

## Edge Cases

- **No findings**: Report skill is clean, no changes needed
- **User cancels all**: Acknowledge and exit without changes
- **Partial apply fails**: Report which edits failed, leave file in consistent state

## Boundaries

Validate against `/syner-boundaries`:
- **Route, Don't Hoard** — Delegate audit to `/syner-skill-reviewer`
- **Suggest, Don't Enforce** — Confirm before applying fixes
- **Self-Verification** — Verify changes were applied
- **Observable Work** — Report what was changed
