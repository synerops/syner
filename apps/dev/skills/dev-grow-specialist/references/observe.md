# observe — Log an ecosystem friction

Record when building, reviewing, testing, or maintaining failed or was unclear.

## When to Use

- Skill creation required fixes afterward
- Review missed an issue that caused problems
- Test methodology was unclear
- Same maintenance task repeated
- Workflow failed for unclear reasons
- Missing tool forced manual work

**Don't filter.** If it felt like friction, observe it.

## Input

```bash
/dev-grow-specialist observe
/dev-grow-specialist observe --type scaffolding
/dev-grow-specialist observe --type review --context "skill-reviewer missed injection risk"
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--type` | Friction type (scaffolding, review, testing, maintenance, workflow, tooling) | Prompted |
| `--context` | Additional context | None |

## Process

### 1. Gather Information

If not provided via flags, prompt for:

```
What happened? (the friction)
Type: [scaffolding/review/testing/maintenance/workflow/tooling]
Context: (what you were building/reviewing/testing)
What would have helped? (optional - your intuition)
```

### 2. Create Entry

Format:

```markdown
## [Date] - [Type]

**Friction:** [What happened]
**Context:** [What you were working on]
**Would have helped:** [Your intuition, if any]

---
```

### 3. Append to Observations

Location: `.syner/ops/dev-grow-specialist/observations.md`

Create file if it doesn't exist with header:

```markdown
# Dev Ecosystem Friction Observations

Raw observations of when ecosystem building failed.
These will be reviewed for patterns → proposals → specialists.

---

```

### 4. Output Confirmation

```
Observed: [type] friction
  "[brief description]"

Total observations: [N]
  - scaffolding: [n]
  - review: [n]
  - testing: [n]
  - maintenance: [n]
  - workflow: [n]
  - tooling: [n]

Run `/dev-grow-specialist review` when you have 3+ of a type.
```

## Friction Types Reference

| Type | Signals | Example |
|------|---------|---------|
| `scaffolding` | "Skill was missing...", "Had to fix structure", "Inconsistent with others" | Created skill missing frontmatter fields |
| `review` | "Review didn't catch...", "Passed but broke", "Missed issue" | syner-skill-reviewer missed prompt injection risk |
| `testing` | "Test was unclear", "Output unpredictable", "Don't know how to validate" | Unclear how to test agent behavior |
| `maintenance` | "Same fix again", "This keeps happening", "Repeated task" | Symlinks broke same way as last time |
| `workflow` | "CI failed", "Unclear why", "Root cause unknown" | Workflow failed, data flow issue |
| `tooling` | "Had to do manually", "Missing automation", "No tool for this" | Manually checked all symlinks |

## Examples

### Scaffolding Friction

```
/dev-grow-specialist observe --type scaffolding

Friction: Created skill with wrong directory structure, had to move files
Context: Building new-skill-name, used wrong pattern
Would have helped: Checklist or validator for skill structure
```

### Review Friction

```
/dev-grow-specialist observe --type review

Friction: syner-skill-reviewer passed a skill that had hardcoded paths
Context: Reviewing workflow-reviewer skill
Would have helped: Check for environment-specific paths
```

### Testing Friction

```
/dev-grow-specialist observe --type testing

Friction: Don't know how to verify agent delegation works correctly
Context: Testing syner agent routing
Would have helped: Clear test methodology for agent behavior
```

### Maintenance Friction

```
/dev-grow-specialist observe --type maintenance

Friction: Symlinks broke after adding new skill, same issue as last month
Context: Added dev-grow-specialist, symlinks not created
Would have helped: Automatic symlink creation on skill add
```

## Edge Cases

**Unsure of type:**
→ Use your best guess. Review will reclassify if needed.

**Multiple types in one friction:**
→ Log the primary friction. Note others in context.

**Very minor friction:**
→ Log it anyway. Patterns emerge from small things.

**Same friction as before:**
→ Log it again. Repetition is signal.

## Output Template

```
Observed: [type] friction
  "[first 50 chars of friction]..."

Total observations: [N]
  - scaffolding: [n]
  - review: [n]
  - testing: [n]
  - maintenance: [n]
  - workflow: [n]
  - tooling: [n]

[If type has 3+:]
Pattern detected in [type]. Run `/dev-grow-specialist review` to analyze.
```
