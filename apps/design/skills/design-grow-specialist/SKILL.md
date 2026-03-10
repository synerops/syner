---
name: design-grow-specialist
description: Evolve design specialists from observations to autonomous subagents using PKM methodology. Use when managing custom specialists, tracking design decision gaps, or promoting specialists to subagents.
metadata:
  author: design
  version: "0.0.1"
  background: false
tools: [Read, Write, Glob, Grep, Bash]
---

# Design Grow Specialist

Evolve specialists through maturity levels based on real project needs, not speculation.

## Purpose

Generic specialists (the 71 `agency-*` agents) are starting points. Real value comes from specialists adapted to THIS project's:
- Stack (Next.js, shadcn/ui, @syner/ui)
- Patterns (detected in actual components)
- Decisions (trade-offs made in PRs/commits)

This skill manages the evolution from observation to autonomous subagent.

## Maturity Levels (PKM-driven)

```
L0: Observation
    ↓ (repeats 3+ times)
L1: Proposal
    ↓ (consulted/refined 5+ times)
L2: Custom Specialist
    ↓ (critical in 10+ components)
L3: Subagent
```

**Key insight:** Low threshold to observe, high threshold to promote. Let usage refine the scope.

## The 3-Condition Test

Before graduating proposal → specialist, validate ALL three:

```markdown
✅ 1. Requires JUDGMENT, not information
   Test: Can coding agent with Read/Grep decide this? NO

✅ 2. Is RECURRING, not one-off
   Test: Appears in each feature/component? YES

✅ 3. Has CONCRETE evidence
   Test: Are there PRs/commits where this was missing? YES
```

**One-sentence test:**
> "This specialist decides ___[what]___ based on ___[criteria not in code]___ and is needed whenever ___[when]___."

If you can't complete that sentence confidently → not ready.

## Commands

Each command has detailed reference documentation:

### 1. `observe` — Log a decision gap
**Reference:** `references/observe.md`

Record when a design decision lacked clear criteria.

**Usage:**
```bash
/design-grow-specialist observe
/design-grow-specialist observe --component header.tsx
```

**Output:** Entry added to `.syner/ops/design-grow-specialist/observations.md`

### 2. `review` — Detect patterns in observations
**Reference:** `references/review.md`

Analyze accumulated observations, detect recurring patterns, propose specialists.

**Usage:**
```bash
/design-grow-specialist review
/design-grow-specialist review --threshold 2
```

**Output:** Proposals for new specialists based on evidence

### 3. `refine` — Improve a proposal
**Reference:** `references/refine.md`

Enhance proposal based on real usage, add concrete examples from codebase.

**Usage:**
```bash
/design-grow-specialist refine design-system-evolution
```

**Output:** Updated proposal with better scope/examples

### 4. `graduate` — Proposal → Custom Specialist
**Reference:** `references/graduate.md`

Promote mature proposal to custom specialist.

**Usage:**
```bash
/design-grow-specialist graduate design-system-evolution
```

**Validates:** 3 conditions + threshold
**Output:** File in `.syner/artifacts/design-grow-specialist/specialists/`

### 5. `promote` — Custom Specialist → Subagent
**Reference:** `references/promote.md`

Elevate critical specialist to autonomous subagent.

**Usage:**
```bash
/design-grow-specialist promote design-system-evolution
```

**Validates:** Criticality threshold
**Output:** File in `agents/` with full frontmatter

### 6. `audit` — Detect redundancy
**Reference:** `references/audit.md`

Find overlapping specialists, mark deprecated generics.

**Usage:**
```bash
/design-grow-specialist audit
/design-grow-specialist audit --mark-deprecated
```

**Output:** Consolidation recommendations

### 7. `status` — View evolution state
**Reference:** `references/status.md`

Show current state of all specialists at all levels.

**Usage:**
```bash
/design-grow-specialist status
/design-grow-specialist status design-system-evolution
```

**Output:** Dashboard of maturity levels and metrics

## File Structure

```
.syner/
├── ops/
│   └── design-grow-specialist/
│       ├── observations.md       # L0: Raw observations log
│       ├── tracking.md           # Metrics for all levels
│       ├── proposals/            # L1: Immature proposals
│       │   ├── design-system-evolution.md
│       │   └── whimsy-arbiter.md
│       └── archive/              # Archived proposals/specialists
│
└── artifacts/
    └── design-grow-specialist/
        └── specialists/          # L2: Mature custom specialists
            └── design-system-evolution.md

apps/design/agents/
  design-system-evolution.md      # L3: Autonomous subagents (final destination)
```

## Thresholds (configurable)

Current settings (high, mostly manual):

```typescript
{
  observationToProposal: 3,     // 3 observations → propose
  proposalToSpecialist: 5,      // 5 consultations → graduate
  specialistToSubagent: 10,     // 10 components affected → promote

  autoApprove: false,           // Always ask confirmation
}
```

**Future:** Lower thresholds, increase automation as confidence grows.

## Format Evolution Detection

**Meta-metric:** If a specialist's format is evolving toward something more pragmatic than the generic template, that's a signal of real adaptation.

Track in `.syner/ops/design-grow-specialist/tracking.md`:
```markdown
## design-system-evolution
Format evolution: 3 refinements, moving toward decision-tree structure
→ This is a point in favor of promotion
```

## Generic Specialists Lifecycle

The 71 `agency-*` specialists:
- Start as fallback options
- Get marked "deprecated for this project" when custom equivalent exists
- Tracked in `.syner/ops/design-grow-specialist/tracking.md`:

```markdown
## Deprecated Generics (for apps/design)

- agency-design-ux-architect → design-system-evolution (covers same ground + project context)
  Deprecated: 2025-03-10
  Reason: Custom specialist has 8 consultations, proven value
```

## Execution Steps

### Common Flow

1. **Parse command and args**
2. **Read appropriate reference** (`references/{command}.md`)
3. **Load context** (observations, proposals, tracking, code)
4. **Execute command** following reference methodology
5. **Update tracking** if state changed
6. **Output result** using reference template

### Context Loading

Load proportionally based on command:
- `observe`: Just observations file
- `review`: Observations + tracking
- `refine/graduate`: Proposal + related code + tracking
- `promote`: Specialist + full usage data
- `audit`: All specialists + all generics

## Testing

### Test Case 1: observe command
```bash
/design-grow-specialist observe
# Enter when prompted:
# Decision: Used custom spacing instead of design tokens
# Component: test-component.tsx
# Gap: No criteria for when to deviate from design system
# Verify: Entry added to .syner/ops/design-grow-specialist/observations.md
```

### Test Case 2: status command
```bash
/design-grow-specialist status
# Expected: Shows counts for L0, L1, L2, L3 (initially all 0 or empty)
# Should display dashboard format
```

### Test Case 3: review command (requires setup)
```bash
# Setup: Create 3 observations with same pattern
/design-grow-specialist observe
# (Repeat 3x with similar "design system deviation" decisions)

/design-grow-specialist review
# Expected: Proposal created in .syner/ops/design-grow-specialist/proposals/
# Verify: Proposal passes 3-condition test
```

**Cleanup:**
```bash
rm -rf .syner/ops/design-grow-specialist/
rm -rf .syner/artifacts/design-grow-specialist/
```

## Boundaries

This skill operates within `/syner-boundaries`:

| Boundary | Application |
|----------|-------------|
| Suggest, Don't Enforce | Propose promotions, require confirmation |
| Concrete Output | Deliver actual specialist files, not suggestions |
| Evidence-Based | Never speculate, always cite code/PRs |
| Route, Don't Hoard | Graduates specialists, doesn't try to do their job |

**Self-check before promotion:**
- [ ] 3-condition test passes
- [ ] Threshold met
- [ ] Real code examples cited
- [ ] Format is project-adapted, not copy-paste

## Voice

Direct. Evidence-based. PKM-native.

Speak in maturity levels:
- "This observation repeated 4 times → ready for proposal"
- "Proposal consulted twice, needs 3 more before graduation"
- "Specialist affects 12 components, above promotion threshold"

When promoting, cite concrete evidence:
- "Used in header.tsx (PR #207), card.tsx (commit 38b1234), button.tsx (local change)"

## Meta-Note

This skill is self-referential:
- It grows specialists using PKM methodology
- `/grow-note` grows notes using PKM methodology
- Both share the philosophy: **observe cheap, promote expensive**

**If this skill works well for design, other subagents (notes, dev, bot) might want their own specialist evolution.**

---

**Related skills:** `/grow-note`, `/syner-skill-reviewer`
**Related agents:** `design`, `dev`, `syner`
