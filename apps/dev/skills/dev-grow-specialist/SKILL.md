---
name: dev-grow-specialist
description: Evolve ecosystem building specialists from friction observations to autonomous subagents. Use when skill creation fails, reviews miss issues, tests are unclear, or maintenance patterns repeat.
metadata:
  author: dev
  version: "0.0.1"
  background: false
tools: [Read, Write, Glob, Grep, Bash]
---

# Dev Grow Specialist

Evolve specialists through maturity levels based on real ecosystem building friction, not theory.

## Purpose

Generic engineering specialists (the 19 `agency-eng-*` and `agency-test-*` agents) are starting points. Real value comes from specialists adapted to THIS ecosystem's:
- Skill patterns (how syner skills are structured)
- Review criteria (what quality gates catch and miss)
- Testing methodology (how agents/skills are validated)
- Maintenance patterns (recurring fixes and updates)

This skill manages the evolution from friction observation to autonomous subagent.

## Methodology

**Reference:** [grow.md](../../../../skills/syner/grow.md)

This skill follows the grow methodology:
- L0: Observation (raw friction)
- L1: Proposal (recurring pattern)
- L2: Custom Specialist (documented, consulted)
- L3: Subagent (autonomous capability)

## Distinction from syner-grow-orchestration

| Skill | Evolves | Destination |
|-------|---------|-------------|
| `syner-grow-orchestration` | Routing/delegation PRINCIPLES | `skills/syner-boundaries/` |
| `dev-grow-specialist` | Building/maintaining SPECIALISTS | `apps/dev/agents/` |

**Rule of thumb:**
- Friction about "what to route where" → orchestration
- Friction about "how to build/review/test" → dev-grow-specialist

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
   Test: Happens across multiple build/review/test cycles? YES

✅ 3. Has CONCRETE evidence
   Test: Are there specific PRs/skills/workflows where this friction occurred? YES
```

**One-sentence test:**
> "This specialist helps me ___[do what]___ by knowing ___[what context]___ whenever I ___[when]___."

If you can't complete that sentence confidently → not ready.

## Friction Types

| Type | Description | Example |
|------|-------------|---------|
| `scaffolding` | Friction creating new components | "Skill structure inconsistent, missed required fields" |
| `review` | Friction in quality gates | "Review missed security issue in workflow" |
| `testing` | Friction validating agents/skills | "Test methodology unclear, output unpredictable" |
| `maintenance` | Friction keeping ecosystem healthy | "Symlinks broke again, same pattern" |
| `workflow` | Friction in CI/CD | "Workflow failed, root cause unclear" |
| `tooling` | Missing tools or integrations | "Need to manually do X every time" |

## Commands

Each command has detailed reference documentation:

### 1. `observe` — Log an ecosystem friction
**Reference:** `references/observe.md`

Record when building, reviewing, testing, or maintaining failed or was unclear.

**Usage:**
```bash
/dev-grow-specialist observe
/dev-grow-specialist observe --type scaffolding
```

**Output:** Entry added to `.syner/ops/dev-grow-specialist/observations.md`

### 2. `review` — Detect patterns in observations
**Reference:** `references/review.md`

Analyze accumulated observations, detect recurring patterns, propose specialists.

**Usage:**
```bash
/dev-grow-specialist review
/dev-grow-specialist review --threshold 2
```

**Output:** Proposals for new specialists based on evidence

### 3. `refine` — Improve a proposal
**Reference:** `references/refine.md`

Enhance proposal based on real usage, add concrete examples from the codebase.

**Usage:**
```bash
/dev-grow-specialist refine skill-validator
```

**Output:** Updated proposal with better scope/examples

### 4. `graduate` — Proposal → Custom Specialist
**Reference:** `references/graduate.md`

Promote mature proposal to custom specialist.

**Usage:**
```bash
/dev-grow-specialist graduate skill-validator
```

**Validates:** 3 conditions + threshold
**Output:** File in `.syner/artifacts/dev-grow-specialist/specialists/`

### 5. `promote` — Custom Specialist → Subagent
**Reference:** `references/promote.md`

Elevate critical specialist to autonomous subagent.

**Usage:**
```bash
/dev-grow-specialist promote skill-validator
```

**Validates:** Criticality threshold
**Output:** File in `apps/dev/agents/` with full frontmatter

### 6. `audit` — Detect redundancy
**Reference:** `references/audit.md`

Find overlapping specialists, identify gaps in coverage vs `agency-eng-*` and `agency-test-*`.

**Usage:**
```bash
/dev-grow-specialist audit
/dev-grow-specialist audit --mark-deprecated
```

**Output:** Consolidation recommendations

### 7. `status` — View evolution state
**Reference:** `references/status.md`

Show current state of all specialists at all levels.

**Usage:**
```bash
/dev-grow-specialist status
/dev-grow-specialist status skill-validator
```

**Output:** Dashboard of maturity levels and metrics

## File Structure

```
.syner/
├── ops/
│   └── dev-grow-specialist/
│       ├── observations.md       # L0: Raw observations log
│       ├── tracking.md           # Metrics for all levels
│       ├── proposals/            # L1: Immature proposals
│       │   ├── skill-validator.md
│       │   └── workflow-debugger.md
│       └── archive/              # Archived proposals/specialists
│
└── artifacts/
    └── dev-grow-specialist/
        └── specialists/          # L2: Mature custom specialists
            └── skill-validator.md

apps/dev/agents/
  skill-validator.md              # L3: Autonomous subagents (final destination)
```

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
- `audit`: All specialists + all generics (agency-eng-*, agency-test-*)

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
- [ ] Real code/PR examples cited
- [ ] Format is ecosystem-adapted, not generic engineering advice

## Voice

Direct. Evidence-based. Builder-oriented.

Speak in maturity levels:
- "This observation repeated 4 times → ready for proposal"
- "Proposal consulted twice, needs 3 more before graduation"
- "Specialist helped in 12 builds, above promotion threshold"

When promoting, cite concrete evidence:
- "Friction in create-syner-skill (PR #207), workflow-reviewer (commit 38b1234), test-syner-agent (local)"

## Relationship to Other Skills

| Skill | Relationship |
|-------|-------------|
| `/syner-grow-orchestration` | Sibling - same methodology, orchestration domain (produces principles) |
| `/vaults-grow-specialist` | Sibling - same methodology, PKM domain |
| `/bot-grow-specialist` | Sibling - same methodology, lead bot domain |
| `/design-grow-specialist` | Sibling - same methodology, design domain |
| `/create-syner-skill` | Dev builds skills; this skill evolves how to build better |
| `/syner-skill-reviewer` | Dev reviews skills; this skill evolves review criteria |

This skill doesn't replace dev functionality — it evolves specialists that make ecosystem building work better.

## Self-Referential Note

Dev creates skills. This is a skill. If friction patterns emerge in using THIS skill, they can be observed and evolved. The skill practices what it preaches.

---

**Related skills:** `/syner-grow-orchestration`, `/create-syner-skill`, `/syner-skill-reviewer`
**Related agents:** `dev`
