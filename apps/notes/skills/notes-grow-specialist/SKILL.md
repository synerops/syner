---
name: notes-grow-specialist
description: Evolve PKM specialists from friction observations to autonomous subagents. Use when the ideas system fails you, when retrieval breaks, or when synthesis falls short.
metadata:
  author: notes
  version: "0.0.1"
  background: false
tools: [Read, Write, Glob, Grep, Bash]
---

# Notes Grow Specialist

Evolve specialists through maturity levels based on real PKM friction, not theory.

## Purpose

Generic PKM advice is everywhere. Real value comes from specialists adapted to YOUR:
- Capture patterns (how you actually take notes)
- Vocabulary (the words you use across domains)
- Workflows (when and where you process)
- Connections (which domains you bridge)

This skill manages the evolution from friction observation to autonomous subagent.

## Maturity Levels (PKM-driven)

```
L0: Observation
    ↓ (repeats 3+ times)
L1: Proposal
    ↓ (consulted/refined 5+ times)
L2: Custom Specialist
    ↓ (critical in 10+ interactions)
L3: Subagent
```

**Key insight:** Low threshold to observe, high threshold to promote. Let usage refine the scope.

## The 3-Condition Test

Before graduating proposal → specialist, validate ALL three:

```markdown
✅ 1. Requires JUDGMENT, not information
   Test: Can coding agent with Read/Grep solve this? NO

✅ 2. Is RECURRING, not one-off
   Test: Happens every time you [capture/search/synthesize]? YES

✅ 3. Has CONCRETE evidence
   Test: Are there specific moments where this friction occurred? YES
```

**One-sentence test:**
> "This specialist helps me ___[do what]___ by knowing ___[what about me]___ whenever I ___[when]___."

If you can't complete that sentence confidently → not ready.

## Commands

Each command has detailed reference documentation:

### 1. `observe` — Log a PKM friction
**Reference:** `references/observe.md`

Record when the ideas/notes system failed you.

**Usage:**
```bash
/notes-grow-specialist observe
/notes-grow-specialist observe --type retrieval
```

**Output:** Entry added to `.syner/ops/notes-grow-specialist/observations.md`

### 2. `review` — Detect patterns in observations
**Reference:** `references/review.md`

Analyze accumulated observations, detect recurring patterns, propose specialists.

**Usage:**
```bash
/notes-grow-specialist review
/notes-grow-specialist review --threshold 2
```

**Output:** Proposals for new specialists based on evidence

### 3. `refine` — Improve a proposal
**Reference:** `references/refine.md`

Enhance proposal based on real usage, add concrete examples from your notes.

**Usage:**
```bash
/notes-grow-specialist refine retrieval-optimizer
```

**Output:** Updated proposal with better scope/examples

### 4. `graduate` — Proposal → Custom Specialist
**Reference:** `references/graduate.md`

Promote mature proposal to custom specialist.

**Usage:**
```bash
/notes-grow-specialist graduate retrieval-optimizer
```

**Validates:** 3 conditions + threshold
**Output:** File in `.syner/artifacts/notes-grow-specialist/specialists/`

### 5. `promote` — Custom Specialist → Subagent
**Reference:** `references/promote.md`

Elevate critical specialist to autonomous subagent.

**Usage:**
```bash
/notes-grow-specialist promote retrieval-optimizer
```

**Validates:** Criticality threshold
**Output:** File in `agents/` with full frontmatter

### 6. `audit` — Detect redundancy
**Reference:** `references/audit.md`

Find overlapping specialists, mark deprecated generics.

**Usage:**
```bash
/notes-grow-specialist audit
/notes-grow-specialist audit --mark-deprecated
```

**Output:** Consolidation recommendations

### 7. `status` — View evolution state
**Reference:** `references/status.md`

Show current state of all specialists at all levels.

**Usage:**
```bash
/notes-grow-specialist status
/notes-grow-specialist status retrieval-optimizer
```

**Output:** Dashboard of maturity levels and metrics

## File Structure

```
.syner/
├── ops/
│   └── notes-grow-specialist/
│       ├── observations.md       # L0: Raw observations log
│       ├── tracking.md           # Metrics for all levels
│       ├── proposals/            # L1: Immature proposals
│       │   ├── retrieval-optimizer.md
│       │   └── voice-processor.md
│       └── archive/              # Archived proposals/specialists
│
└── artifacts/
    └── notes-grow-specialist/
        └── specialists/          # L2: Mature custom specialists
            └── retrieval-optimizer.md

apps/notes/agents/
  retrieval-optimizer.md          # L3: Autonomous subagents (final destination)
```

## Friction Types

Common categories of PKM friction to observe:

| Type | Description | Example |
|------|-------------|---------|
| `retrieval` | Can't find what you know exists | "I wrote about X but can't find it" |
| `capture` | Friction in getting ideas into notes | "Voice memo never processed" |
| `linking` | Missing connections between ideas | "These should have been connected" |
| `synthesis` | Can't combine into insights | "Had all pieces, couldn't see pattern" |
| `processing` | Captured but never digested | "Inbox overflowing, nothing processed" |
| `vocabulary` | Different words for same concept | "Called it X here, Y there" |

## Thresholds (configurable)

Current settings (high, mostly manual):

```typescript
{
  observationToProposal: 3,     // 3 observations → propose
  proposalToSpecialist: 5,      // 5 consultations → graduate
  specialistToSubagent: 10,     // 10 interactions affected → promote

  autoApprove: false,           // Always ask confirmation
}
```

**Future:** Lower thresholds, increase automation as confidence grows.

## Execution Steps

### Common Flow

1. **Parse command and args**
2. **Read appropriate reference** (`references/{command}.md`)
3. **Load context** (observations, proposals, tracking, notes)
4. **Execute command** following reference methodology
5. **Update tracking** if state changed
6. **Output result** using reference template

### Context Loading

Load proportionally based on command:
- `observe`: Just observations file
- `review`: Observations + tracking
- `refine/graduate`: Proposal + related notes + tracking
- `promote`: Specialist + full usage data
- `audit`: All specialists + all generics

## Boundaries

This skill operates within `/syner-boundaries`:

| Boundary | Application |
|----------|-------------|
| Suggest, Don't Enforce | Propose promotions, require confirmation |
| Concrete Output | Deliver actual specialist files, not suggestions |
| Evidence-Based | Never speculate, always cite real friction |
| Route, Don't Hoard | Graduates specialists, doesn't try to do their job |

**Self-check before promotion:**
- [ ] 3-condition test passes
- [ ] Threshold met
- [ ] Real friction examples cited
- [ ] Format is adapted to user's patterns, not generic PKM

## Voice

Direct. Evidence-based. PKM-native.

Speak in maturity levels:
- "This observation repeated 4 times → ready for proposal"
- "Proposal consulted twice, needs 3 more before graduation"
- "Specialist helped in 12 interactions, above promotion threshold"

When promoting, cite concrete evidence:
- "Friction in daily capture (Mar 5), meeting notes (Mar 7), voice memo (Mar 9)"

## Relationship to Other Skills

| Skill | Relationship |
|-------|-------------|
| `find-ideas` | Specialists improve idea discovery |
| `find-links` | Specialists improve connection detection |
| `track-idea` | Specialists improve evolution tracking |
| `grow-note` | Specialists improve graduation decisions |

This skill doesn't replace them — it evolves specialists that make them work better for YOU.

## Meta-Note

This skill shares philosophy with `design-grow-specialist`:
- Both grow specialists using PKM methodology
- Both follow: **observe cheap, promote expensive**
- Both adapt generic capabilities to specific context

The difference: design observes UI/component decisions, notes observes PKM/ideas friction.

---

**Related skills:** `/grow-note`, `/find-ideas`, `/design-grow-specialist`
**Related agents:** `notes`, `dev`
