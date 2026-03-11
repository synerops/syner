# Notes Grow Specialist - Help

**Evolve PKM specialists from your real friction, not generic advice.**

## Quick Start

```bash
# 1. Observe a PKM friction
/notes-grow-specialist observe

# 2. Review patterns and create proposals
/notes-grow-specialist review

# 3. Refine proposals based on usage
/notes-grow-specialist refine retrieval-optimizer

# 4. Graduate mature proposals to specialists
/notes-grow-specialist graduate retrieval-optimizer

# 5. Promote critical specialists to subagents
/notes-grow-specialist promote retrieval-optimizer

# Check status anytime
/notes-grow-specialist status
```

## The Philosophy

**Generic PKM advice is useless.**

- "Use Zettelkasten" doesn't know how YOU think
- "Capture everything" doesn't know YOUR capture friction
- "Link notes" doesn't know YOUR vocabulary across domains

Real value comes from specialists that know YOUR patterns:
- How you name things
- When you capture vs process
- Which domains you bridge
- Where your system breaks

**Evolution happens gradually through real friction, not speculation.**

## Maturity Levels

```
L0: Observation
    ↓ (3+ observations of same pattern)
L1: Proposal
    ↓ (5+ consultations, refined scope)
L2: Custom Specialist
    ↓ (10+ interactions improved, critical)
L3: Subagent
```

**Key:** Observe cheap, promote expensive. Let friction prove value.

## Commands

### `observe` — Record PKM friction

**When:** Something in your notes/ideas system failed you.

**Usage:**
```bash
/notes-grow-specialist observe
/notes-grow-specialist observe --type retrieval
```

**Example:**
```
Friction: Couldn't find my notes about async communication
Type: retrieval
Context: I know I wrote about it, searched "async", "communication", nothing
What would have helped: Knowing I call it "distributed work" in some notes
```

**Output:** Added to `observations.md`

---

### `review` — Find patterns and propose specialists

**When:** After several observations, or weekly check-in.

**Usage:**
```bash
/notes-grow-specialist review
/notes-grow-specialist review --threshold 2
```

**What it does:**
- Analyzes observation log
- Detects recurring patterns (same friction 3+ times)
- Applies 3-Condition Test
- Creates proposals for valid patterns

**Output:** Proposal files in `proposals/`

---

### `refine` — Improve proposal quality

**When:** After consulting a proposal, or before graduation.

**Usage:**
```bash
/notes-grow-specialist refine retrieval-optimizer
/notes-grow-specialist refine voice-processor --add-example "Mar 5 voice memo"
```

**What it does:**
- Adds concrete examples from your notes
- Sharpens scope based on usage
- Records what works about the proposal
- Tracks evolution

**Output:** Updated proposal file

---

### `graduate` — Proposal → Custom Specialist

**When:** Proposal has 5+ consultations and proven value.

**Usage:**
```bash
/notes-grow-specialist graduate retrieval-optimizer
/notes-grow-specialist graduate voice-processor --force
```

**Validates:**
- 3-Condition Test
- Consultation threshold
- Scope stability

**Output:** Specialist file in `specialists/`

---

### `promote` — Custom Specialist → Subagent

**When:** Specialist is critical (10+ interactions) and ready for autonomy.

**Usage:**
```bash
/notes-grow-specialist promote retrieval-optimizer
```

**Validates:**
- Interaction count threshold
- Criticality (improves every session?)
- Autonomy readiness (can define tools/execution)

**Output:** Subagent file in `agents/`

---

### `audit` — Detect redundancy and cleanup

**When:** Monthly maintenance, or when specialist count grows.

**Usage:**
```bash
/notes-grow-specialist audit
/notes-grow-specialist audit --mark-deprecated
```

**What it does:**
- Finds overlapping specialists
- Identifies stale proposals
- Suggests consolidation

**Output:** Cleanup recommendations

---

### `status` — View evolution state

**When:** Check progress, see what's ready, weekly overview.

**Usage:**
```bash
/notes-grow-specialist status
/notes-grow-specialist status retrieval-optimizer
/notes-grow-specialist status --ready
```

**Output:** Dashboard of all specialists at all levels

---

## 3-Condition Test

**Every proposal must pass ALL three:**

### 1. Requires JUDGMENT, not information

**Test:** Can coding agent with Read/Grep solve this?
- NO → Pass (requires judgment)
- YES → Fail (just needs to search)

**Example:**
- ❌ "Know how to search notes" → grep can do this
- ✅ "Know MY vocabulary across domains" → requires learning my patterns

### 2. Is RECURRING, not one-off

**Test:** Happens regularly?
- YES (3+ times) → Pass
- NO (once or twice) → Fail

**Example:**
- ❌ Needed once for a specific project
- ✅ Happens every time I search for old ideas

### 3. Has CONCRETE evidence

**Test:** Are there specific friction moments?
- YES (cites actual dates/notes) → Pass
- NO (vague "would be useful") → Fail

**Example:**
- ❌ "Would be nice to have better search"
- ✅ "Mar 5: couldn't find async notes, Mar 7: lost meeting link, Mar 9: voice memo"

---

## Friction Types

| Type | What it means | Example observation |
|------|---------------|---------------------|
| `retrieval` | Can't find what exists | "Searched X, didn't find note I wrote" |
| `capture` | Friction getting ideas in | "Had idea while walking, lost it" |
| `linking` | Missing connections | "These notes should be connected" |
| `synthesis` | Can't combine into insight | "All pieces there, couldn't see it" |
| `processing` | Never digest what's captured | "Inbox has 50 unprocessed notes" |
| `vocabulary` | Same concept, different words | "Called it X in one vault, Y in another" |

---

## Common Workflows

### Starting from scratch

```bash
# 1. Observe friction as you work
/notes-grow-specialist observe
# (Do this 3-4 times over a week when system fails you)

# 2. Review patterns
/notes-grow-specialist review

# 3. Check what was proposed
/notes-grow-specialist status --level L1

# 4. Refine proposals as you consult them
# (Happens naturally during note work)

# 5. Graduate when mature
/notes-grow-specialist status --ready
/notes-grow-specialist graduate [name]
```

### Weekly check-in

```bash
# See what's evolved
/notes-grow-specialist status

# Review any new patterns
/notes-grow-specialist review

# Refine active proposals
/notes-grow-specialist status --level L1
```

### Monthly maintenance

```bash
# Audit for redundancy
/notes-grow-specialist audit

# Check ecosystem health
/notes-grow-specialist status --stats

# Clean up stale proposals
/notes-grow-specialist audit --archive-stale
```

---

## Philosophy

**Observe cheap, promote expensive.**
- Observations are low-friction (just log when it fails)
- Promotion is high-bar (proven critical)

**Friction drives evolution.**
- Don't speculate about what specialists you "should" have
- Let real failures reveal what's needed
- Your PKM problems are unique to you

**False negatives are OK.**
- Better to wait for more evidence
- Better to keep as proposal longer
- Don't rush graduation

---

## Tips

**When to observe:**
- Any time your notes/ideas system fails you
- When you can't find something
- When capture was awkward
- When connections were missed
- Don't filter — capture the friction

**When NOT to create specialist:**
- Grep can solve it (just search better)
- It's a one-off problem (not recurring)
- No concrete examples (just "would be nice")

**Signs a proposal is ready:**
- Scope fits in one sentence
- 5+ real consultations
- You've refined it based on usage
- Examples are specific to YOUR notes

**Signs a specialist is ready for promotion:**
- Improves 10+ interactions
- Critical for your workflow
- Can define its own execution
- You'd miss it if it was gone

---

## Troubleshooting

**"Review found no patterns"**
→ Need more observations (at least 3 of same friction type)

**"Proposal failed 3-Condition Test"**
→ Friction isn't suitable for specialist, basic tools can handle it

**"Specialist seems redundant"**
→ Run `/notes-grow-specialist audit` to check overlap

**"Proposal scope keeps changing"**
→ Not stable yet, keep refining or split into multiple

**"Specialist never gets consulted"**
→ Might not be needed, audit will flag as stale

---

## Relationship to Other Skills

```
/find-ideas ←── specialists improve idea discovery
/find-links ←── specialists improve connection detection
/track-idea ←── specialists improve evolution tracking
/grow-note  ←── specialists improve graduation decisions
```

This skill doesn't replace them — it grows specialists that make them work better FOR YOU.

---

## Meta

This skill follows PKM principles:

```
notes-grow-specialist/
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

**Questions? Friction?**

This is v0.0.1 - expect evolution. The skill will improve based on real usage (practicing what it preaches).
