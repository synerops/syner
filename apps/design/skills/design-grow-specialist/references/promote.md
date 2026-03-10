# Promote Mode

**Level:** L2 → L3
**Threshold:** Very High (requires criticality + autonomy-readiness)

## Purpose

Elevate a custom specialist to autonomous subagent. This is the highest level — the specialist becomes capable of independent execution, not just guidance.

## When to Promote

- Specialist affects ≥10 components (or critical path for every feature)
- Consulted in every new design work (not optional)
- Can define its own tools and execution steps
- Ready for background/autonomous execution
- User confirms criticality (manual approval required)

## Process

### 1. Load Custom Specialist

**Read:** `.syner/artifacts/design-grow-specialist/specialists/[name].md`

### 2. Load Tracking Data

**Read:** `.syner/ops/design-grow-specialist/tracking.md`

**Verify:**
- Components affected ≥ 10
- Usage frequency (consulted in every feature? or occasional?)
- No major issues (complaints, scope creep, confusion)

### 3. Validate Criticality

**Questions to answer:**

**1. Is it critical for EVERY feature/component?**
```
Review recent work:
- Last 5 components created → was this specialist consulted? [Y/N for each]
- If <4/5 → Not critical enough
- If 5/5 → Critical
```

**2. Can it execute autonomously?**
```
Current: Design Lead coordinates this specialist
Future: Can it run background checks? Make PRs? Auto-review?

If specialist just provides guidance → Not ready
If specialist can verify, check, enforce → Ready
```

**3. Does it need dedicated tools?**
```
What tools would this specialist use independently?
- Read, Grep, Glob (basic)
- Bash for checks/validation
- Write for reports
- Skill for delegation

If unclear → Not ready
If clear list → Ready
```

### 4. Define Subagent Frontmatter

Transform specialist → subagent by adding:

```yaml
---
name: [name]
description: [Concise: what decisions/actions it performs]
tools: [Read, Grep, Glob, Bash, Write, Skill]  # Based on needs
model: sonnet  # or opus if complex
background: true/false  # Can it run in CI?
evolved_from: [specialist name]
level: L3
graduated: YYYY-MM-DD (to L2)
promoted: YYYY-MM-DD (to L3)
---
```

**Key decisions:**

**`tools:`**
- Start conservative (Read, Grep, Glob)
- Add Bash if it needs to check/validate
- Add Write if it creates reports/artifacts
- Add Skill if it delegates to other specialists

**`model:`**
- `sonnet` for most (fast, cheap, good judgment)
- `opus` only if highly complex multi-domain synthesis

**`background:`**
- `true` if it can run in CI/workflows without human in loop
- `false` if it needs human confirmation (initially most will be false)

### 5. Adapt Content Structure

**Subagent needs more than specialist:**

Add sections:

#### **Core Loop**
```markdown
## Core Loop

Request → Analyze → Decide/Execute → Verify → Report
```

#### **When to Invoke**
```markdown
## When to Invoke

**Manual:**
- Creating new component in apps/design
- Extending @syner/ui design system
- PR review for design system changes

**Automatic (future):**
- CI check on PRs touching packages/ui/
- Pre-commit hook for component files
```

#### **Execution Steps**
```markdown
## Execution Steps

1. **Context:** Read component + design system files
2. **Analyze:** Check against decision criteria
3. **Decide:** Apply framework, cite rationale
4. **Verify:** Ensure decision is documented
5. **Report:** Comment on PR / output decision log
```

#### **Background Execution (if applicable)**
```markdown
## Background Execution

If invoked in CI:
1. Read PR files
2. Grep for design system patterns
3. Check against criteria
4. Write review comment
5. Pass/fail based on decision framework
```

### 6. Create Subagent File

**Location:** `apps/design/agents/[name].md`

**Structure:** Same as specialist + new sections above

**Key differences:**

| Specialist (L2) | Subagent (L3) |
|-----------------|---------------|
| Provides guidance | Executes autonomously |
| Coordinated by Design Lead | Invoked independently |
| "You decide X" | "You analyze → decide → verify" |
| Examples only | Examples + execution steps |

### 7. Update Tracking

**Move from Custom Specialists (L2) to Subagents (L3):**

```markdown
## Subagents (L3)

### design-system-evolution
Status: subagent
Level: L3
Created: 2025-03-10 (proposal)
Graduated: 2025-03-12 (specialist)
Promoted: 2025-03-15 (subagent)
Components affected: 12
Background capable: false (requires Design Lead for now)
Model: sonnet
Tools: Read, Grep, Glob, Bash, Write
```

### 8. Archive Specialist File

```bash
mkdir -p .syner/ops/design-grow-specialist/archive
mv .syner/artifacts/design-grow-specialist/specialists/[name].md .syner/ops/design-grow-specialist/archive/[name]-specialist-archived-YYYY-MM-DD.md
```

### 9. Trigger Symlink Update

**Note for user:**
```
Run /syner-fix-symlinks to propagate to .claude/agents/
```

Or auto-invoke if skill has permission:
```bash
/syner-fix-symlinks
```

### 10. Update Design Lead Agent

**Read:** `apps/design/agents/design.md`

**Add to subagent list:**
```markdown
| Subagent | Role | When to delegate |
|----------|------|------------------|
| `design-system-evolution` | Decides design system extensions | New components, @syner/ui changes |
```

## Output Template

```markdown
## Promotion Complete 🚀

**Subagent:** [Name]
**Level:** L2 (Custom Specialist) → L3 (Autonomous Subagent)

**Criticality:**
- Components affected: [count]
- Used in: [X/Y] recent features
- Critical path: [Yes/No]

**Autonomy:**
- Tools: [list]
- Model: [sonnet/opus]
- Background: [true/false]

**File:** `agents/[name].md`

**Next Steps:**
1. Run `/syner-fix-symlinks` to propagate
2. Invoke directly: `Agent("[name]", "task...")`
3. Design Lead will delegate automatically when relevant

**Evolution:**
- L0: [Date] ([X] observations)
- L1: [Date] ([X] consultations)
- L2: [Date] ([X] components)
- L3: [Date] (promoted)

**Archived:**
- Specialist file → `.syner/ops/design-grow-specialist/archive/[name]-specialist-archived-YYYY-MM-DD.md`
```

## Flags

**`--force`**
Skip component count threshold (use with extreme caution).

**`--background`**
Mark as background-capable immediately (default: false initially).

**`--dry-run`**
Show what would be created without writing files.

## Edge Cases

**Specialist doesn't meet threshold:**
- Don't promote
- Output: "Needs [N] more components. Current: [X], required: 10"
- Suggest: Keep using as specialist

**Specialist is consulted but not critical:**
- It's useful but not every-feature-level critical
- Don't promote yet
- Track for longer period

**Tools needed are unclear:**
- This means autonomy isn't ready
- Keep as specialist
- Wait until execution pattern is clearer

**Multiple specialists could be consolidated:**
- If 2+ specialists overlap and both are ready for promotion
- Consider merging before promoting
- Run `/design-grow-specialist audit` first

## Context Loading

Full:
- Read specialist file
- Read all tracking data
- Grep all components affected
- Read design.md (to update subagent list)
- Read generic specialist if applicable

## Validation

Before promoting:
- [ ] Components affected ≥ 10
- [ ] Critical for every/most features
- [ ] Tools clearly defined
- [ ] Execution steps documented
- [ ] Can verify its own output
- [ ] User confirmed criticality

## Philosophy

**Promotion is rare.** Most specialists stay at L2 forever. That's OK.

**Autonomous execution is a privilege.** Only promote when specialist has proven it can operate reliably without constant supervision.

**Background capability comes later.** Even subagents start with `background: false`. Prove reliability first, then enable automation.

## Meta

**If a specialist reaches L3, it's no longer just guidance — it's infrastructure.**

It should be maintained, versioned, and tested like any critical system component.

Consider:
- Adding evals (via `/skill-creator` if available)
- Documenting failure modes
- Creating rollback plan if it causes issues
