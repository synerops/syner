---
name: bot-grow-specialist
description: Evolve lead bot specialists from friction observations to autonomous subagents. Use when conversations fail, responses miss the mark, or lead handling breaks down.
metadata:
  author: bot
  version: "0.0.1"
  background: false
tools: [Read, Write, Glob, Grep, Bash]
---

# Bot Grow Specialist

Evolve specialists through maturity levels based on real lead bot friction, not theory.

## Purpose

Generic chatbot advice is everywhere. Real value comes from specialists adapted to YOUR bot's:
- Conversation patterns (how leads actually interact)
- Tone and voice (the personality that works)
- Integration points (what external services connect)
- Handoff criteria (when to escalate vs resolve)

This skill manages the evolution from friction observation to autonomous subagent.

## Methodology

**Reference:** [grow.md](../../../../skills/syner/grow.md)

This skill follows the grow methodology:
- L0: Observation (raw friction)
- L1: Proposal (recurring pattern)
- L2: Custom Specialist (documented, consulted)
- L3: Subagent (autonomous capability)

## Maturity Levels

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
   Test: Happens across multiple conversations? YES

✅ 3. Has CONCRETE evidence
   Test: Are there specific conversations where this friction occurred? YES
```

**One-sentence test:**
> "This specialist helps me ___[do what]___ by knowing ___[what context]___ whenever I ___[when]___."

If you can't complete that sentence confidently → not ready.

## Friction Types

| Type | Description | Example |
|------|-------------|---------|
| `conversation` | Flow breaks or dead ends | "User asked X, bot couldn't continue" |
| `response` | Wrong tone, missed intent | "Response was too formal for casual lead" |
| `integration` | External service issues | "CRM sync failed, lost lead context" |
| `handoff` | Escalation/routing problems | "Should have escalated but didn't" |
| `context` | Missing user/lead info | "Didn't remember previous conversation" |
| `qualification` | Lead scoring issues | "Marked hot lead as cold" |

## Commands

Each command has detailed reference documentation:

### 1. `observe` — Log a bot friction
**Reference:** `references/observe.md`

Record when the lead bot failed or underperformed.

**Usage:**
```bash
/bot-grow-specialist observe
/bot-grow-specialist observe --type conversation
```

**Output:** Entry added to `.syner/ops/bot-grow-specialist/observations.md`

### 2. `review` — Detect patterns in observations
**Reference:** `references/review.md`

Analyze accumulated observations, detect recurring patterns, propose specialists.

**Usage:**
```bash
/bot-grow-specialist review
/bot-grow-specialist review --threshold 2
```

**Output:** Proposals for new specialists based on evidence

### 3. `refine` — Improve a proposal
**Reference:** `references/refine.md`

Enhance proposal based on real usage, add concrete examples from conversations.

**Usage:**
```bash
/bot-grow-specialist refine tone-adapter
```

**Output:** Updated proposal with better scope/examples

### 4. `graduate` — Proposal → Custom Specialist
**Reference:** `references/graduate.md`

Promote mature proposal to custom specialist.

**Usage:**
```bash
/bot-grow-specialist graduate tone-adapter
```

**Validates:** 3 conditions + threshold
**Output:** File in `.syner/artifacts/bot-grow-specialist/specialists/`

### 5. `promote` — Custom Specialist → Subagent
**Reference:** `references/promote.md`

Elevate critical specialist to autonomous subagent.

**Usage:**
```bash
/bot-grow-specialist promote tone-adapter
```

**Validates:** Criticality threshold
**Output:** File in `apps/bot/agents/` with full frontmatter

### 6. `audit` — Detect redundancy
**Reference:** `references/audit.md`

Find overlapping specialists, identify gaps in coverage.

**Usage:**
```bash
/bot-grow-specialist audit
/bot-grow-specialist audit --mark-deprecated
```

**Output:** Consolidation recommendations

### 7. `status` — View evolution state
**Reference:** `references/status.md`

Show current state of all specialists at all levels.

**Usage:**
```bash
/bot-grow-specialist status
/bot-grow-specialist status tone-adapter
```

**Output:** Dashboard of maturity levels and metrics

## File Structure

```
.syner/
├── ops/
│   └── bot-grow-specialist/
│       ├── observations.md       # L0: Raw observations log
│       ├── tracking.md           # Metrics for all levels
│       ├── proposals/            # L1: Immature proposals
│       │   ├── tone-adapter.md
│       │   └── handoff-router.md
│       └── archive/              # Archived proposals/specialists
│
└── artifacts/
    └── bot-grow-specialist/
        └── specialists/          # L2: Mature custom specialists
            └── tone-adapter.md

apps/bot/agents/
  tone-adapter.md                 # L3: Autonomous subagents (final destination)
```

## Thresholds (configurable)

Current settings (high, mostly manual):

```typescript
{
  observationToProposal: 3,     // 3 observations → propose
  proposalToSpecialist: 5,      // 5 consultations → graduate
  specialistToSubagent: 10,     // 10 conversations affected → promote

  autoApprove: false,           // Always ask confirmation
}
```

**Future:** Lower thresholds, increase automation as confidence grows.

## Execution Steps

### Common Flow

1. **Parse command and args**
2. **Read appropriate reference** (`references/{command}.md`)
3. **Load context** (observations, proposals, tracking, conversations)
4. **Execute command** following reference methodology
5. **Update tracking** if state changed
6. **Output result** using reference template

### Context Loading

Load proportionally based on command:
- `observe`: Just observations file
- `review`: Observations + tracking
- `refine/graduate`: Proposal + related conversations + tracking
- `promote`: Specialist + full usage data
- `audit`: All specialists + conversation patterns

## Boundaries

This skill operates within `/syner-boundaries`:

| Boundary | Application |
|----------|-------------|
| Suggest, Don't Enforce | Propose promotions, require confirmation |
| Concrete Output | Deliver actual specialist files, not suggestions |
| Evidence-Based | Never speculate, always cite real conversations |
| Route, Don't Hoard | Graduates specialists, doesn't try to do their job |

**Self-check before promotion:**
- [ ] 3-condition test passes
- [ ] Threshold met
- [ ] Real conversation examples cited
- [ ] Format is adapted to bot's patterns, not generic chatbot advice

## Voice

Direct. Evidence-based. Conversation-native.

Speak in maturity levels:
- "This observation repeated 4 times → ready for proposal"
- "Proposal consulted twice, needs 3 more before graduation"
- "Specialist helped in 12 conversations, above promotion threshold"

When promoting, cite concrete evidence:
- "Friction in onboarding flow (Mar 5), pricing question (Mar 7), support escalation (Mar 9)"

## Relationship to Other Skills

| Skill | Relationship |
|-------|-------------|
| `/vaults-grow-specialist` | Sibling - same methodology, different domain (PKM) |
| `/design-grow-specialist` | Sibling - same methodology, different domain (design) |
| `/syner-grow-orchestration` | Sibling - same methodology, orchestration domain |

This skill doesn't replace bot functionality — it evolves specialists that make the bot work better for YOUR leads.

---

**Related skills:** `/vaults-grow-specialist`, `/design-grow-specialist`, `/syner-grow-orchestration`
**Related agents:** `bot`, `dev`
