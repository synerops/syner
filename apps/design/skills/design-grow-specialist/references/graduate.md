# Graduate Mode

**Level:** L1 → L2
**Threshold:** High (requires 5+ consultations + validation)

## Purpose

Promote a mature proposal to a custom specialist. This means it's been consulted, refined, and proven valuable enough to formalize.

## When to Graduate

- Proposal has ≥5 consultations (tracked in `tracking.md`)
- 3-condition test still passes after real usage
- Scope is clear and stable (not changing dramatically between consultations)
- User confirms readiness (manual approval required initially)

## Process

### 1. Load Proposal

**Read:** `.syner/ops/design-grow-specialist/proposals/[name].md`

### 2. Load Tracking Data

**Read:** `.syner/ops/design-grow-specialist/tracking.md`

**Verify:**
- Consultation count ≥ 5
- No red flags (e.g., scope changing every consultation)

### 3. Re-validate Test de 3 Condiciones

Based on actual usage (not just initial observations):

**1. Requires JUDGMENT, not information?**
```
Review consultation history:
- Did consultations involve DECISIONS or just INFORMATION lookup?
- If mostly "what does the design system say?" → FAIL (that's just reading docs)
- If mostly "should I break this pattern here?" → PASS (that's judgment)
```

**2. Is RECURRING?**
```
Check:
- How many different components/features consulted this?
- Is it needed in every new component? Every feature? Or just edge cases?
- If <3 components → FAIL
- If ≥5 components → PASS
```

**3. Has CONCRETE evidence?**
```
List actual files/PRs where this specialist was consulted:
- File references should be in tracking data
- If no concrete references → FAIL
- If well-documented consultations → PASS
```

**All 3 pass → Continue**
**Any fail → Don't graduate, return to refinement**

### 4. Check Format Evolution

**Meta-metric:** Has the proposal's format evolved beyond generic template?

**Indicators:**
- Custom decision tree added
- Project-specific examples integrated
- Format adapted to make consultations faster
- Structure reflects actual usage patterns

**If yes:** This is a point in favor of graduation (shows real adaptation)

### 5. Adapt from Generic (if applicable)

If proposal evolved from a generic specialist (e.g., `agency-design-ux-architect`):

**Read:** `~/.claude/agents/[generic].md`

**Transform (NOT copy-paste):**

| Generic Template | → | Custom Specialist |
|------------------|---|-------------------|
| Generic identity/role | → | Project-specific identity |
| Abstract examples | → | Actual project components |
| Broad scope | → | Focused project scope |
| Generic tools/methods | → | Stack-specific (Next.js, @syner/ui) |

**Example:**
```markdown
# Generic says:
"Design CSS design systems with variables, spacing scales..."

# Custom says:
"Design token extensions for @syner/ui, maintaining semantic token architecture.
See: packages/ui/src/tokens/semantic.ts"
```

### 6. Create Custom Specialist File

**Location:** `.syner/artifacts/design-grow-specialist/specialists/[name].md`

**Template:**
```markdown
---
name: [Specialist Name]
description: [One-line: what decisions it makes]
evolved_from: [Generic name or "new pattern"]
level: L2
created: YYYY-MM-DD
graduated: YYYY-MM-DD
consultations: [count]
components_affected: [list]
---

# [Specialist Name]

> Custom specialist evolved from real needs in apps/design

## Identity

You are [name], a specialist that decides [core decision] based on [criteria not in code].

**Why you exist:**
[Brief story of the pattern that emerged from observations]

**What coding agents can't do:**
Coding agents can Read the design system code. You decide WHEN to extend it vs when to use component-specific solutions.

## Scope

**You decide:**
- [Decision 1]
- [Decision 2]
- [Decision 3]

**You DON'T decide:**
- [Out of scope - handled by coding agent]
- [Out of scope - handled by other specialist]

## Criteria (Project-Specific)

### [Criterion 1]

**Context:** [Why this matters in this project]

**Decision framework:**
```
If [condition] → [recommendation]
If [condition] → [recommendation]
Edge cases: [list]
```

**Examples from project:**
- `[component.tsx]`: [Decision made + rationale]
- `[component.tsx]`: [Decision made + rationale]

### [Criterion 2]

[Same structure]

## Stack Context

**This project uses:**
- Next.js [version] with App Router
- @syner/ui design system (packages/ui)
- shadcn/ui components
- Semantic tokens architecture

**Key files you reference:**
- `packages/ui/src/tokens/semantic.ts`
- `apps/design/components/[pattern]`

## Test de 3 Condiciones

**1. Criterio, no información:**
✓ Coding agents can Read @syner/ui code, but can't decide when to extend vs fork

**2. Recurrente:**
✓ Every new component faces this decision (affected: [count] components)

**3. Evidencia:**
✓ Used in: [list of actual files/PRs]

## Evolution History

**L0 (Observations):**
- [Date]: [First observation]
- [Date]: [Pattern confirmed]

**L1 (Proposal):**
- Created: [Date]
- Consultations: [count]
- Refinements: [count]

**L2 (Custom Specialist):**
- Graduated: [Date]
- Reason: [Why it graduated]

## Next Level

**Threshold to L3 (Subagent):**
- Affect ≥10 components (current: [X])
- Critical for every feature (current: [status])
- Can execute autonomously (current: requires Design Lead coordination)

---

**Evolved from:** [agency-design-xxx] (now deprecated for this project)
**Maintained by:** Design Lead
**Last updated:** YYYY-MM-DD
```

### 7. Update Tracking

**Move from Proposals (L1) to Custom Specialists (L2):**

```markdown
## Custom Specialists (L2)

### design-system-evolution
Status: specialist
Level: L2
Created: 2025-03-10
Graduated: 2025-03-12
Consultations: 7
Components affected: card.tsx, header.tsx, button.tsx, sections.tsx, footer.tsx
Threshold to promote: 10 components (3 more needed)
Format evolved: Yes (custom decision tree)
```

### 8. Mark Generic as Deprecated (if applicable)

```markdown
## Deprecated Generics (for apps/design)

### agency-design-ux-architect
Deprecated: 2025-03-12
Replaced by: design-system-evolution (custom)
Reason: Custom specialist covers same scope + project context
Consultations before deprecation: 0 (never used in project)
```

### 9. Archive Proposal

Move proposal file to archive:
```bash
mkdir -p .syner/ops/design-grow-specialist/archive
mv proposals/[name].md archive/[name]-proposal-archived-YYYY-MM-DD.md
```

## Output Template

```markdown
## Graduation Complete ✅

**Specialist:** [Name]
**Level:** L1 (Proposal) → L2 (Custom Specialist)

**Evidence:**
- Consultations: [count]
- Components: [list]
- Format evolution: [Yes/No]

**3-Condition Test:**
- ✓ Requires judgment
- ✓ Is recurring ([X] components)
- ✓ Has evidence ([list files])

**File:** `.syner/artifacts/design-grow-specialist/specialists/[name].md`

**Next:**
- Use this specialist when [triggering condition]
- Needs [N] more components to promote to L3 (Subagent)
- Run `/syner-fix-symlinks` to propagate to .claude/agents/

**Deprecated:**
- [Generic name] is now deprecated for this project
```

## Flags

**`--force`**
Skip consultation threshold check (use with caution).

**`--dry-run`**
Show what would be created without writing files.

## Edge Cases

**Proposal fails re-validation:**
- Don't graduate
- Output: "Proposal doesn't pass 3 conditions after real usage. Needs refinement."
- Suggest: `/design-grow-specialist refine [name]`

**Generic has been used in project:**
- Don't fully deprecate
- Mark as "both active" temporarily
- Track: "Migrate usage from generic → custom over time"

**Scope changed significantly since proposal:**
- This is OK if it improved
- Document evolution in "Evolution History" section
- If it's unstable (changing every consultation) → don't graduate yet

## Context Loading

Heavy:
- Read proposal file
- Read tracking data
- Grep components mentioned for validation
- Read generic specialist (if evolving from one)
- Read design system files for context

## Validation

Before graduating:
- [ ] Consultation count ≥ 5 (or threshold)
- [ ] 3-condition test re-validated
- [ ] Scope is stable and clear
- [ ] Real component examples cited
- [ ] Format is adapted (not template copy-paste)
- [ ] User confirmed (initially, manual approval)

## Philosophy

**Graduation is a commitment.** This specialist will now be part of the project's design infrastructure.

**Don't rush it.** Better to keep refining as proposal than graduate prematurely.

**Format evolution is signal.** If the proposal's structure adapted to usage, it's ready. If it's still generic template, it's not.
