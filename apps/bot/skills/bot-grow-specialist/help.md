# Bot Grow Specialist - Help

**Evolve lead bot specialists from your real friction, not generic chatbot advice.**

## Quick Start

```bash
# 1. Observe a bot friction
/bot-grow-specialist observe

# 2. Review patterns and create proposals
/bot-grow-specialist review

# 3. Refine proposals based on usage
/bot-grow-specialist refine tone-adapter

# 4. Graduate mature proposals to specialists
/bot-grow-specialist graduate tone-adapter

# 5. Promote critical specialists to subagents
/bot-grow-specialist promote tone-adapter

# Check status anytime
/bot-grow-specialist status
```

## The Philosophy

**Generic chatbot advice is useless.**

- "Be conversational" doesn't know YOUR leads
- "Respond quickly" doesn't know YOUR integration points
- "Qualify leads" doesn't know YOUR qualification criteria

Real value comes from specialists that know YOUR bot's patterns:
- How your leads actually talk
- When to escalate vs resolve
- Which integrations break
- Where conversations fall apart

**Evolution happens gradually through real friction, not speculation.**

## Maturity Levels

```
L0: Observation
    ↓ (3+ observations of same pattern)
L1: Proposal
    ↓ (5+ consultations, refined scope)
L2: Custom Specialist
    ↓ (10+ conversations improved, critical)
L3: Subagent
```

**Key:** Observe cheap, promote expensive. Let friction prove value.

## Commands

### `observe` — Record bot friction

**When:** Something in your lead bot failed or underperformed.

**Usage:**
```bash
/bot-grow-specialist observe
/bot-grow-specialist observe --type conversation
```

**Example:**
```
Friction: Lead asked about pricing, bot gave generic response
Type: response
Context: Hot lead, showed buying intent, needed specific tier info
What would have helped: Knowing lead's company size to tailor response
```

**Output:** Added to `observations.md`

---

### `review` — Find patterns and propose specialists

**When:** After several observations, or weekly check-in.

**Usage:**
```bash
/bot-grow-specialist review
/bot-grow-specialist review --threshold 2
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
/bot-grow-specialist refine tone-adapter
/bot-grow-specialist refine handoff-router --add-example "Mar 5 escalation"
```

**What it does:**
- Adds concrete examples from conversations
- Sharpens scope based on usage
- Records what works about the proposal
- Tracks evolution

**Output:** Updated proposal file

---

### `graduate` — Proposal → Custom Specialist

**When:** Proposal has 5+ consultations and proven value.

**Usage:**
```bash
/bot-grow-specialist graduate tone-adapter
/bot-grow-specialist graduate handoff-router --force
```

**Validates:**
- 3-Condition Test
- Consultation threshold
- Scope stability

**Output:** Specialist file in `specialists/`

---

### `promote` — Custom Specialist → Subagent

**When:** Specialist is critical (10+ conversations) and ready for autonomy.

**Usage:**
```bash
/bot-grow-specialist promote tone-adapter
```

**Validates:**
- Interaction count threshold
- Criticality (improves every conversation?)
- Autonomy readiness (can define tools/execution)

**Output:** Subagent file in `agents/`

---

### `audit` — Detect redundancy and cleanup

**When:** Monthly maintenance, or when specialist count grows.

**Usage:**
```bash
/bot-grow-specialist audit
/bot-grow-specialist audit --mark-deprecated
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
/bot-grow-specialist status
/bot-grow-specialist status tone-adapter
/bot-grow-specialist status --ready
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
- X "Know how to respond" → template can do this
- ✓ "Know WHEN to change tone" → requires learning patterns

### 2. Is RECURRING, not one-off

**Test:** Happens regularly?
- YES (3+ times) → Pass
- NO (once or twice) → Fail

**Example:**
- X Needed once for a specific lead
- ✓ Happens every time leads ask about pricing

### 3. Has CONCRETE evidence

**Test:** Are there specific friction moments?
- YES (cites actual conversations) → Pass
- NO (vague "would be useful") → Fail

**Example:**
- X "Would be nice to have better responses"
- ✓ "Mar 5: lost hot lead, Mar 7: wrong escalation, Mar 9: tone mismatch"

---

## Friction Types

| Type | What it means | Example observation |
|------|---------------|---------------------|
| `conversation` | Flow breaks or dead ends | "Lead asked X, bot couldn't continue" |
| `response` | Wrong tone or missed intent | "Too formal for casual inquiry" |
| `integration` | External service issues | "CRM sync failed, lost context" |
| `handoff` | Escalation/routing problems | "Should have escalated but didn't" |
| `context` | Missing user/lead info | "Didn't remember previous chat" |
| `qualification` | Lead scoring issues | "Marked hot lead as cold" |

---

## Common Workflows

### Starting from scratch

```bash
# 1. Observe friction as conversations happen
/bot-grow-specialist observe
# (Do this 3-4 times over a week when bot fails)

# 2. Review patterns
/bot-grow-specialist review

# 3. Check what was proposed
/bot-grow-specialist status --level L1

# 4. Refine proposals as you consult them
# (Happens naturally during bot work)

# 5. Graduate when mature
/bot-grow-specialist status --ready
/bot-grow-specialist graduate [name]
```

### Weekly check-in

```bash
# See what's evolved
/bot-grow-specialist status

# Review any new patterns
/bot-grow-specialist review

# Refine active proposals
/bot-grow-specialist status --level L1
```

### Monthly maintenance

```bash
# Audit for redundancy
/bot-grow-specialist audit

# Check ecosystem health
/bot-grow-specialist status --stats

# Clean up stale proposals
/bot-grow-specialist audit --archive-stale
```

---

## Philosophy

**Observe cheap, promote expensive.**
- Observations are low-friction (just log when it fails)
- Promotion is high-bar (proven critical)

**Friction drives evolution.**
- Don't speculate about what specialists you "should" have
- Let real failures reveal what's needed
- Your bot's problems are unique to your leads

**False negatives are OK.**
- Better to wait for more evidence
- Better to keep as proposal longer
- Don't rush graduation

---

## Tips

**When to observe:**
- Any time your lead bot fails or underperforms
- When conversations fall apart
- When handoffs go wrong
- When tone misses the mark
- Don't filter — capture the friction

**When NOT to create specialist:**
- Template can solve it (just better prompts)
- It's a one-off problem (not recurring)
- No concrete examples (just "would be nice")

**Signs a proposal is ready:**
- Scope fits in one sentence
- 5+ real consultations
- You've refined it based on usage
- Examples are specific to YOUR leads

**Signs a specialist is ready for promotion:**
- Improves 10+ conversations
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
→ Run `/bot-grow-specialist audit` to check overlap

**"Proposal scope keeps changing"**
→ Not stable yet, keep refining or split into multiple

**"Specialist never gets consulted"**
→ Might not be needed, audit will flag as stale

---

## Relationship to Other Skills

```
/notes-grow-specialist  ←── sibling (PKM domain)
/design-grow-specialist ←── sibling (design domain)
/syner-grow-orchestration ←── sibling (orchestration domain)
```

This skill doesn't replace bot functionality — it grows specialists that make the bot work better FOR YOUR LEADS.

---

## Meta

This skill follows PKM principles:

```
bot-grow-specialist/
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
