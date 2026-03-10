# Syner Grow Orchestration - Help

**Evolve orchestration decisions into codified principles.**

## Quick Start

```bash
# 1. Observe orchestration friction
/syner-grow-orchestration observe

# 2. Review patterns (after 2+ observations)
/syner-grow-orchestration review

# 3. Formalize mature proposals
/syner-grow-orchestration formalize agent-skill-boundary

# 4. Elevate critical patterns to principles
/syner-grow-orchestration elevate agent-skill-boundary

# Check status anytime
/syner-grow-orchestration status
```

## Why This Skill?

**Orchestration decisions have multiplicative impact.**

- Wrong routing → affects every task
- Unclear boundaries → repeated confusion
- Missing principles → ad-hoc fixes everywhere

This skill captures the friction and evolves it into principles that govern all future decisions.

## Maturity Levels

```
L0: Observation
    ↓ (2 observations of same pattern)
L1: Proposal
    ↓ (3 consultations)
L2: Pattern
    ↓ (5 interactions affected)
L3: Principle (→ syner-boundaries)
```

**Lower thresholds than other grow skills** because orchestration impact is multiplicative.

## Friction Types

| Type | When to use |
|------|-------------|
| `overlap` | Two components doing the same thing |
| `routing` | Unclear when to delegate where |
| `context` | Loaded too much or too little |
| `delegation` | Sent to wrong specialist/worker |
| `naming` | Confusing component names |
| `boundary` | Violated existing principles |

## Commands

### `observe` — Capture friction

**When:** You made an orchestration decision without clear criteria.

```bash
/syner-grow-orchestration observe
/syner-grow-orchestration observe --type overlap
```

**Example friction:**
- "Agent and skill both orchestrate, unclear which is canonical"
- "Loaded full context when targeted would have been faster"
- "Routed to worker but should have used specialist"

---

### `review` — Find patterns

**When:** After several observations, or weekly check.

```bash
/syner-grow-orchestration review
/syner-grow-orchestration review --threshold 1
```

**What it does:**
- Groups observations by type
- Finds patterns with 2+ occurrences
- Applies 3-Condition Test
- Creates proposals

---

### `propose` — Create proposal directly

**When:** Clear pattern, don't want to wait for threshold.

```bash
/syner-grow-orchestration propose agent-skill-boundary
```

---

### `formalize` — Proposal → Pattern

**When:** Proposal has 3+ consultations, scope is stable.

```bash
/syner-grow-orchestration formalize agent-skill-boundary
```

---

### `elevate` — Pattern → Principle

**When:** Pattern affects 5+ interactions, ready to codify.

```bash
/syner-grow-orchestration elevate agent-skill-boundary
```

**Output:** Added to `syner-boundaries` skill.

---

### `status` — View state

**When:** Check progress, see what's ready.

```bash
/syner-grow-orchestration status
/syner-grow-orchestration status agent-skill-boundary
```

## Example Workflow

### Week 1: Capture friction

```bash
# Noticed overlap between agent and skill
/syner-grow-orchestration observe --type overlap

# Later: routing was unclear
/syner-grow-orchestration observe --type routing
```

### Week 2: Review and propose

```bash
# Check what patterns emerged
/syner-grow-orchestration review

# Create proposal for agent-skill boundary
# (Automatic if threshold met)
```

### Week 3: Consult and refine

```bash
# Check proposal when making routing decisions
# (Consultations tracked)

# Check status
/syner-grow-orchestration status
```

### Week 4: Formalize

```bash
# Pattern has been consulted 3 times
/syner-grow-orchestration formalize agent-skill-boundary

# Now it's a documented pattern
```

### Later: Elevate

```bash
# Pattern affected 5+ interactions
/syner-grow-orchestration elevate agent-skill-boundary

# Now it's a principle in syner-boundaries
```

## Files

```
.syner/ops/orchestration/
├── observations.md       # Your friction log
├── tracking.md           # Metrics
└── proposals/            # Active proposals

.syner/artifacts/orchestration/
└── patterns/             # Formalized patterns

skills/syner-boundaries/  # L3 destination
```

## Philosophy

**Observe cheap, elevate expensive.**

- Observations: Log everything, no filtering
- Proposals: Pattern detected, scope forming
- Patterns: Consulted repeatedly, stable
- Principles: Critical, affects everything

**Why syner-boundaries as destination?**

Other grow skills create subagents (autonomous capabilities). Orchestration grow creates principles (decision criteria). Orchestration isn't a capability that acts - it's criteria that governs.

## Tips

**When to observe:**
- Any routing decision without clear criteria
- Any time two components could have handled the task
- Any confusion about agent vs skill vs worker

**Signs a pattern is ready for formalization:**
- You consult it for decisions
- Scope hasn't changed in 2 consultations
- Can state it in one sentence

**Signs a pattern is ready for elevation:**
- Affects multiple interaction types
- Breaking it causes problems
- Others would benefit from knowing it

## Troubleshooting

**"Review found no patterns"**
→ Need more observations (at least 2 of same type)

**"Proposal failed 3-Condition Test"**
→ Friction isn't recurring or doesn't need judgment

**"Pattern scope keeps changing"**
→ Not stable yet, keep consulting

**"Elevated but syner-boundaries didn't change"**
→ Check if principle already exists, might be duplicate

## Related

- **`/syner-boundaries`** — Where L3 principles live
- **`/syner`** — The orchestrator governed by these principles
- **`grow.md`** — Shared methodology reference
- **`/notes-grow-specialist`** — Sibling skill for PKM friction
- **`/design-grow-specialist`** — Sibling skill for design friction

---

**Version:** 0.1.0 - Expect evolution. This skill practices what it preaches.
