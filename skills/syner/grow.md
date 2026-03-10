# The Grow Methodology

Shared reference for evolving observations to autonomous capabilities through evidence-based maturity levels.

This document is imported by all `*-grow-*` skills. Domain-specific adaptations live in each skill.

## Core Philosophy

**Observe cheap, promote expensive.**

- Low barrier to capture friction
- High barrier to formalize solutions
- Usage proves value, not speculation
- Evidence over intuition

## The L0→L3 Lifecycle

```
L0: Observation
    ↓ (threshold observations of same pattern)
L1: Proposal
    ↓ (threshold consultations/refinements)
L2: Pattern (documented, reusable)
    ↓ (threshold interactions, proven critical)
L3: Principle/Capability (autonomous)
```

### L0: Observation

Raw friction captured as it happens.

**What to capture:**
- The specific friction (what went wrong/was unclear)
- Context (when/where this happened)
- What would have helped (hypothetical solution)

**Why low barrier:** Observations are cheap. If you filter too much, you lose signal. Capture broadly, patterns emerge from volume.

### L1: Proposal

When the same friction repeats, it becomes a proposal.

**What a proposal contains:**
- Clear scope (one sentence)
- Evidence (list of observations)
- Initial solution shape
- 3-Condition Test result

**Why proposals, not solutions:** A proposal is a hypothesis. Usage refines scope. Premature formalization creates unused assets.

### L2: Pattern

A proposal that proved its value through real consultations.

**What makes it a pattern:**
- Consulted multiple times
- Scope stabilized
- Format evolved to match actual needs
- Concrete examples from real work

### L3: Principle/Capability

A pattern so critical it becomes autonomous.

**What makes it ready:**
- Used across many interactions
- Critical for every occurrence
- Can execute independently
- Clear tools and boundaries

**Destination varies by domain:**
- PKM → Subagent
- Design → Subagent
- Orchestration → Boundary principle

## The 3-Condition Test

**Every proposal must pass ALL three conditions before advancing.**

### Condition 1: Requires JUDGMENT, not information

```
Test: Can a coding agent with Read/Grep solve this?
- NO → Pass (requires judgment)
- YES → Fail (just needs to read docs/code)
```

If the answer exists in code or documentation, it's not a specialist problem.

### Condition 2: Is RECURRING, not one-off

```
Test: Does this appear repeatedly across work?
- YES (3+ occurrences) → Pass
- NO (1-2 times) → Fail
```

One-off problems don't need systematic solutions.

### Condition 3: Has CONCRETE evidence

```
Test: Are there specific moments where this friction occurred?
- YES (cites actual instances) → Pass
- NO (vague "would be useful") → Fail
```

Speculation creates unused assets. Evidence creates value.

**One-sentence test:**
> "This [proposal] helps me ___[do what]___ by knowing ___[what context]___ whenever I ___[when]___."

If you can't complete that sentence confidently → not ready.

## Standard Commands

All grow skills support these commands:

| Command | Purpose | Input | Output |
|---------|---------|-------|--------|
| `observe` | Capture friction | Context, friction type | Entry in observations.md |
| `review` | Detect patterns | Observations | Proposals for patterns meeting threshold |
| `propose` | Create proposal | Pattern details | Proposal file |
| `formalize` | Proposal → Pattern | Mature proposal | Pattern file |
| `elevate` | Pattern → Principle | Critical pattern | Principle/capability |
| `status` | View state | Optional: specific item | Dashboard of all levels |

Domain-specific commands may be added (e.g., `audit` for redundancy detection).

## File Structure Conventions

```
.syner/ops/{grow-skill}/
├── observations.md       # L0: Raw friction log
├── tracking.md           # Metrics across all levels
├── proposals/            # L1: Immature proposals
│   └── {proposal-name}.md
└── archive/              # Archived/deprecated items

.syner/artifacts/{grow-skill}/
└── patterns/             # L2: Mature patterns
    └── {pattern-name}.md

{destination}/            # L3: Domain-specific destination
└── {capability-name}.md
```

## Thresholds

Default thresholds (configurable per domain):

```typescript
{
  observationToProposal: 3,     // 3 observations → propose
  proposalToPattern: 5,         // 5 consultations → formalize
  patternToCapability: 10,      // 10 interactions → elevate

  autoApprove: false,           // Always ask confirmation
}
```

**Orchestration uses lower thresholds** (2/3/5) because orchestration decisions have multiplicative impact across all operations.

## Evidence Standards

### For Proposals

```markdown
## Evidence
- [Date] [Type]: [Specific friction]
- [Date] [Type]: [Specific friction]
- [Date] [Type]: [Specific friction]
```

### For Patterns

```markdown
## Usage
- Consulted: 7 times
- Last: 2026-03-10
- Components affected: [list]
```

### For Elevation

```markdown
## Criticality
- Interactions affected: 15+
- Would block without this: Yes
- Autonomy readiness: Can define own execution
```

## Format Evolution

**Meta-signal:** If an item's format evolves toward something more pragmatic than the template, that signals real adaptation.

Track in tracking.md:
```markdown
## {name}
Format evolution: 3 refinements, moving toward {new structure}
→ Point in favor of advancement
```

Generic template unchanged → Not ready yet.

## Anti-Patterns

### Premature Formalization
**Problem:** Creating patterns before evidence exists
**Fix:** Stay at L0/L1 longer, let observations accumulate

### Speculation-Based Proposals
**Problem:** "Would be nice to have X"
**Fix:** Require concrete evidence, reject vague proposals

### Format Rigidity
**Problem:** Keeping template structure despite usage suggesting different format
**Fix:** Let format evolve based on actual consultations

### Orphaned Observations
**Problem:** Observations pile up but never reviewed
**Fix:** Regular `review` cadence (weekly/bi-weekly)

## Integration Points

Each `*-grow-*` skill:
1. Imports this methodology
2. Defines domain-specific friction types
3. Specifies L3 destination
4. May adjust thresholds for domain context

---

**This is methodology, not rules.** Adapt to what works. The principle is: evidence-based evolution, not speculation-based creation.
