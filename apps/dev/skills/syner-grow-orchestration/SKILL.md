---
name: syner-grow-orchestration
description: Evolve orchestration decisions through maturity levels (L0→L3). Use when routing is unclear, components overlap, context loading is wrong, or boundaries are violated.
agent: dev
metadata:
  author: dev
  version: "0.1.0"
  background: false
tools: [Read, Write, Glob, Grep, Bash]
---

# Syner Grow Orchestration

Evolve orchestration decisions through evidence-based maturity levels.

## Purpose

Orchestration friction has multiplicative impact. A wrong routing decision affects every task. An unclear boundary creates repeated confusion. A missing principle leads to ad-hoc fixes across the codebase.

This skill captures orchestration friction and evolves it into codified principles in `syner-boundaries`.

## Methodology

**Reference:** [grow.md](../../../skills/syner/grow.md)

This skill follows the grow methodology:
- L0: Observation (raw friction)
- L1: Proposal (recurring pattern)
- L2: Pattern (documented, consulted)
- L3: Principle (codified in syner-boundaries)

**Key difference from other grow skills:** L3 destination is `syner-boundaries`, not `agents/`. Orchestration decisions become principles that govern all routing, not autonomous agents.

## Friction Types

| Type | Description | Example |
|------|-------------|---------|
| `overlap` | Components doing the same thing | Agent and skill both orchestrating |
| `routing` | Unclear delegation criteria | When to fork vs execute directly? |
| `context` | Loading too much or too little | Full context when targeted sufficed |
| `delegation` | Wrong routing decisions | Sent to worker when specialist was better |
| `naming` | Confusing names | User can't tell syner from syner-worker |
| `boundary` | Violated principles | Skill that hoards instead of routes |

## Commands

### 1. `observe` — Log orchestration friction

Record when an orchestration decision lacked clear criteria.

**Usage:**
```bash
/syner-grow-orchestration observe
/syner-grow-orchestration observe --type overlap
```

**Prompts for:**
- Friction (what was unclear)
- Context (where this happened)
- What would have helped

**Output:** Entry added to `.syner/ops/orchestration/observations.md`

### 2. `review` — Detect patterns

Analyze observations, detect recurring friction, propose principles.

**Usage:**
```bash
/syner-grow-orchestration review
/syner-grow-orchestration review --threshold 1
```

**Output:** Proposals for patterns meeting threshold (default: 2)

### 3. `propose` — Create proposal manually

Create a proposal from a clear pattern without waiting for threshold.

**Usage:**
```bash
/syner-grow-orchestration propose agent-skill-boundary
```

**Validates:** 3-Condition Test
**Output:** File in `.syner/ops/orchestration/proposals/`

### 4. `formalize` — Proposal → Pattern

Promote mature proposal to documented pattern.

**Usage:**
```bash
/syner-grow-orchestration formalize agent-skill-boundary
```

**Validates:** 3 consultations, stable scope
**Output:** File in `.syner/artifacts/orchestration/patterns/`

### 5. `elevate` — Pattern → Principle

Promote critical pattern to syner-boundaries.

**Usage:**
```bash
/syner-grow-orchestration elevate agent-skill-boundary
```

**Validates:** 5 interactions affected, principle-ready
**Output:** Added to `skills/syner-boundaries/SKILL.md`

### 6. `status` — View evolution state

Show current state of orchestration evolution.

**Usage:**
```bash
/syner-grow-orchestration status
/syner-grow-orchestration status agent-skill-boundary
```

**Output:** Dashboard of all levels and metrics

## File Structure

```
.syner/ops/orchestration/
├── observations.md       # L0: Raw friction log
├── tracking.md           # Metrics
├── proposals/            # L1: Proposals
│   └── agent-skill-boundary.md
└── archive/

.syner/artifacts/orchestration/
└── patterns/             # L2: Documented patterns
    └── agent-skill-boundary.md

skills/syner-boundaries/
└── SKILL.md              # L3: Principles live here
```

## Thresholds

Lower than default due to multiplicative impact:

```typescript
{
  observationToProposal: 2,     // 2 observations → propose
  proposalToPattern: 3,         // 3 consultations → formalize
  patternToPrinciple: 5,        // 5 interactions → elevate

  autoApprove: false,           // Always ask confirmation
}
```

## Execution Steps

### observe

1. Ask for friction type (or use --type flag)
2. Prompt for: friction, context, what would have helped
3. Append to `.syner/ops/orchestration/observations.md`
4. Update tracking if new potential pattern detected
5. Output confirmation

### review

1. Read observations.md
2. Group by friction type
3. Count occurrences per pattern
4. For patterns meeting threshold:
   - Apply 3-Condition Test
   - Create proposal if passes
5. Output summary

### propose

1. Validate 3-Condition Test
2. Create proposal file with:
   - Scope (one sentence)
   - Evidence (observations)
   - Proposed principle
3. Add to tracking
4. Output proposal path

### formalize

1. Read proposal and tracking
2. Validate consultation threshold
3. Create pattern file with:
   - Principle statement
   - Application examples
   - When to apply
4. Move proposal to archive
5. Update tracking
6. Output pattern path

### elevate

1. Read pattern and tracking
2. Validate criticality threshold
3. Read current syner-boundaries
4. Draft principle addition
5. Show diff and ask confirmation
6. Update syner-boundaries
7. Archive pattern
8. Update tracking
9. Output confirmation

## Example Flow

```bash
# Day 1: Observe friction
/syner-grow-orchestration observe
# → "Agent and skill both orchestrate, unclear which to use"

# Day 3: Same friction again
/syner-grow-orchestration observe --type overlap
# → Threshold met (2 observations)

# Review detects pattern
/syner-grow-orchestration review
# → Proposes "agent-skill-boundary"

# Use the proposal in decisions
# (consultations tracked automatically)

# After 3 consultations
/syner-grow-orchestration formalize agent-skill-boundary
# → Pattern documented

# After 5 interactions affected
/syner-grow-orchestration elevate agent-skill-boundary
# → Principle added to syner-boundaries
```

## Relationship to Other Skills

| Skill | Relationship |
|-------|-------------|
| `/syner-boundaries` | L3 destination - principles live there |
| `/syner` | Orchestrator governed by evolved principles |
| `/syner-skill-reviewer` | Uses evolved principles to audit |
| `/vaults-grow-specialist` | Sibling - same methodology, different domain |
| `/design-grow-specialist` | Sibling - same methodology, different domain |

## Voice

Direct. Evidence-based.

Speak in orchestration terms:
- "Overlap friction detected 3 times → ready for proposal"
- "Routing pattern consulted in 4 decisions, needs 1 more"
- "Principle affects all routing decisions, recommending elevation"

When elevating, cite concrete impact:
- "This pattern affected: syner routing (3x), skill selection (2x), context loading (2x)"

## Boundaries

This skill operates within `/syner-boundaries`:

| Boundary | Application |
|----------|-------------|
| Suggest, Don't Enforce | Propose principles, require confirmation before adding to boundaries |
| Evidence-Based | Never speculate, always cite observations |
| Route, Don't Hoard | Graduates principles to syner-boundaries, doesn't enforce them |

---

**Related:** [grow.md](../../../skills/syner/grow.md), `/syner-boundaries`, `/syner`
