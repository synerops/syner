# Design Grow Specialist - Help

**Evolve design specialists from observations to autonomous subagents.**

## Quick Start

```bash
# 1. Observe a design decision gap
/design-grow-specialist observe

# 2. Review patterns and create proposals
/design-grow-specialist review

# 3. Refine proposals based on usage
/design-grow-specialist refine design-system-evolution

# 4. Graduate mature proposals to specialists
/design-grow-specialist graduate design-system-evolution

# 5. Promote critical specialists to subagents
/design-grow-specialist promote design-system-evolution

# Check status anytime
/design-grow-specialist status
```

## The Philosophy

**Generic specialists (71 agency-* agents) are templates.**

Real value comes from specialists adapted to YOUR project:
- Stack (Next.js, shadcn/ui, @syner/ui)
- Patterns (detected in actual components)
- Decisions (trade-offs made in PRs)

**Evolution happens gradually through real usage, not speculation.**

## Maturity Levels

```
L0: Observation
    ↓ (3+ observations of same pattern)
L1: Proposal
    ↓ (5+ consultations, refined scope)
L2: Custom Specialist
    ↓ (10+ components affected, critical)
L3: Subagent
```

**Key:** Observe cheap, promote expensive. Let usage prove value.

## Commands

### `observe` — Record decision gaps

**When:** You made a design decision without clear criteria.

**Usage:**
```bash
/design-grow-specialist observe
/design-grow-specialist observe --component header.tsx
```

**Example:**
```
Decision: Used custom spacing instead of design system
Component: card.tsx
Gap: No criteria for when to deviate from system
```

**Output:** Added to `_observations.md`

---

### `review` — Find patterns and propose specialists

**When:** After several observations, or weekly check-in.

**Usage:**
```bash
/design-grow-specialist review
/design-grow-specialist review --threshold 2
```

**What it does:**
- Analyzes observation log
- Detects recurring patterns (same decision 3+ times)
- Applies 3-Condition Test
- Creates proposals for valid patterns

**Output:** Proposal files in `_proposals/`

---

### `refine` — Improve proposal quality

**When:** After consulting a proposal, or before graduation.

**Usage:**
```bash
/design-grow-specialist refine design-system-evolution
/design-grow-specialist refine whimsy-arbiter --add-example button.tsx
```

**What it does:**
- Adds concrete examples from codebase
- Sharpens scope based on usage
- Evolves format (e.g., adds decision tree)
- Tracks format evolution

**Output:** Updated proposal file

---

### `graduate` — Proposal → Custom Specialist

**When:** Proposal has 5+ consultations and proven value.

**Usage:**
```bash
/design-grow-specialist graduate design-system-evolution
/design-grow-specialist graduate whimsy-arbiter --force
```

**Validates:**
- 3-Condition Test
- Consultation threshold
- Scope stability

**Output:** Specialist file in `agents/specialists/`

---

### `promote` — Custom Specialist → Subagent

**When:** Specialist is critical (10+ components) and ready for autonomy.

**Usage:**
```bash
/design-grow-specialist promote design-system-evolution
/design-grow-specialist promote spatial-grid --background
```

**Validates:**
- Component count threshold
- Criticality (used in every feature?)
- Autonomy readiness (can define tools/execution)

**Output:** Subagent file in `agents/`

---

### `audit` — Detect redundancy and cleanup

**When:** Monthly maintenance, or when specialist count grows.

**Usage:**
```bash
/design-grow-specialist audit
/design-grow-specialist audit --mark-deprecated
/design-grow-specialist audit --threshold 80
```

**What it does:**
- Finds overlapping specialists (>70% similar)
- Marks deprecated generics
- Identifies stale proposals
- Suggests consolidation

**Output:** Cleanup recommendations

---

### `status` — View evolution state

**When:** Check progress, see what's ready, weekly overview.

**Usage:**
```bash
/design-grow-specialist status
/design-grow-specialist status design-system-evolution
/design-grow-specialist status --stats
/design-grow-specialist status --ready
```

**Output:** Dashboard of all specialists at all levels

---

## 3-Condition Test

**Every proposal must pass ALL three:**

### 1. Requires JUDGMENT, not information

**Test:** Can coding agent with Read/Grep decide this?
- NO → Pass (requires judgment)
- YES → Fail (just needs to read docs/code)

**Example:**
- ❌ "Know how to use shadcn/ui" → coding agent reads docs
- ✅ "Decide when to break design patterns" → requires judgment

### 2. Is RECURRING, not one-off

**Test:** Appears in each feature/component?
- YES (3+ components) → Pass
- NO (1-2 times) → Fail

**Example:**
- ❌ Needed once for special landing page
- ✅ Needed for every new component

### 3. Has CONCRETE evidence

**Test:** Are there PRs/commits where this was missing?
- YES (cites actual files) → Pass
- NO (vague "would be useful") → Fail

**Example:**
- ❌ "Would be nice to have guidance on X"
- ✅ "Needed in card.tsx, header.tsx, button.tsx (see commits)"

---

## File Structure

```
apps/design/vaults/syner/specialists/
  _observations.md              # L0: Observation log
  _proposals/
    design-system-evolution.md  # L1: Immature proposals
    whimsy-arbiter.md
  _tracking.md                  # Metrics for all levels
  _archive/                     # Archived/deprecated

apps/design/agents/specialists/
  design-system-evolution.md    # L2: Custom specialists

apps/design/agents/
  design-system-evolution.md    # L3: Subagents
  design.md                     # Updated with subagent list
```

## Thresholds

**Current settings (high, mostly manual):**

```
observationToProposal: 3      # 3 observations → propose
proposalToSpecialist: 5       # 5 consultations → graduate
specialistToSubagent: 10      # 10 components → promote

autoApprove: false            # Always ask confirmation
```

**These will lower over time as confidence grows.**

## Flags Reference

| Flag | Commands | Description |
|------|----------|-------------|
| `--component [file]` | observe | Specify component directly |
| `--threshold [N]` | review, audit | Override default threshold |
| `--add-example [file]` | refine | Add specific example |
| `--scope "[text]"` | refine | Update scope directly |
| `--force` | graduate, promote | Skip threshold checks |
| `--background` | promote | Mark as background-capable |
| `--dry-run` | review, graduate, promote | Preview without writing |
| `--verbose` | all | Show detailed analysis |
| `--stats` | status | Include velocity metrics |
| `--level [L0-L3]` | status | Filter by level |
| `--ready` | status | Show only ready for next level |
| `--mark-deprecated` | audit | Auto-mark deprecated generics |
| `--archive-stale` | audit | Auto-archive unused proposals |

## Common Workflows

### Starting from scratch

```bash
# 1. Observe design decisions as you work
/design-grow-specialist observe
# (Do this 3-4 times over a week)

# 2. Review patterns
/design-grow-specialist review

# 3. Check what was proposed
/design-grow-specialist status --level L1

# 4. Refine proposals as you consult them
# (Happens naturally during design work)

# 5. Graduate when mature
/design-grow-specialist status --ready
/design-grow-specialist graduate [name]
```

### Maintenance

```bash
# Monthly audit
/design-grow-specialist audit

# Check ecosystem health
/design-grow-specialist status --stats

# Clean up stale proposals
/design-grow-specialist audit --archive-stale
```

### Before major feature

```bash
# See what specialists are ready
/design-grow-specialist status --ready

# Check if patterns exist for this work
/design-grow-specialist status

# Observe new patterns that emerge
/design-grow-specialist observe
```

## Philosophy

**Observe cheap, promote expensive.**
- Observations are low-friction (just log it)
- Promotion is high-bar (proven critical)

**Usage drives evolution.**
- Don't speculate about usefulness
- Let real consultations prove value
- Format adapts to actual needs

**Format evolution is signal.**
- If proposal structure changes based on usage → maturing
- If stays generic template → not ready yet

**False negatives are OK.**
- Better to wait for more evidence
- Better to keep as proposal longer
- Don't rush graduation

## Tips

**When to observe:**
- Any time you make a design decision without clear criteria
- Don't filter too much, capture broadly

**When NOT to create specialist:**
- Coding agent can just Read the answer from docs/code
- It's a one-off decision (not recurring)
- No concrete examples (just "would be nice")

**Signs a proposal is ready:**
- Scope fits in one sentence
- 5+ real consultations
- Format has evolved
- Examples are concrete

**Signs a specialist is ready for promotion:**
- Used in 10+ components
- Critical for every feature
- Can define its own execution steps
- Tools are clear

## Troubleshooting

**"Review found no patterns"**
→ Need more observations (at least 3 of same pattern)

**"Proposal failed 3-Condition Test"**
→ Pattern isn't suitable for specialist, coding agent can handle it

**"Specialist seems redundant"**
→ Run `/design-grow-specialist audit` to check overlap

**"Proposal scope keeps changing"**
→ Not stable yet, keep refining or split into multiple

**"Specialist never gets used"**
→ Might not be needed, audit will flag as stale

## Related

- **`/grow-note`** - Same PKM philosophy for notes
- **`/syner-skill-reviewer`** - Review specialists for quality
- **`/syner-fix-symlinks`** - Propagate specialists to .claude/agents

## Meta

This skill itself follows PKM principles:

```
design-grow-specialist/
  ├── SKILL.md          # Orchestrator (you read this first)
  ├── help.md           # User guide (you're reading this)
  └── references/       # Detailed specs for each command
      ├── observe.md
      ├── review.md
      ├── refine.md
      ├── graduate.md
      ├── promote.md
      ├── audit.md
      └── status.md
```

**It's structured like a specialist that graduated to mature skill.**

---

**Questions? Feedback?**

This is v0.1.0 - expect evolution. The skill will improve based on real usage (practicing what it preaches).
