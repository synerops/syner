# Dev Grow Specialist - Help

**Evolve ecosystem building specialists from friction to autonomous subagents.**

## Quick Start

```bash
# 1. Observe ecosystem friction
/dev-grow-specialist observe

# 2. Review patterns (after 3+ observations)
/dev-grow-specialist review

# 3. Refine promising proposals
/dev-grow-specialist refine skill-validator

# 4. Graduate mature proposals
/dev-grow-specialist graduate skill-validator

# 5. Promote critical specialists
/dev-grow-specialist promote skill-validator

# Check status anytime
/dev-grow-specialist status
```

## Why This Skill?

**Generic specialists are starting points, not solutions.**

Dev has access to 19 generic specialists (`agency-eng-*`, `agency-test-*`). They know general engineering. They don't know:
- How syner skills are structured
- What review criteria catch real issues
- How agents are tested in this ecosystem
- Which maintenance patterns keep recurring

This skill evolves specialists that know YOUR ecosystem.

## Maturity Levels

```
L0: Observation
    ↓ (3 observations of same pattern)
L1: Proposal
    ↓ (5 consultations)
L2: Custom Specialist
    ↓ (10 interactions affected)
L3: Subagent (→ apps/dev/agents/)
```

## Friction Types

| Type | When to use |
|------|-------------|
| `scaffolding` | Skill/agent/app creation went wrong |
| `review` | Quality gate missed something |
| `testing` | Validation was unclear or failed |
| `maintenance` | Same fix needed repeatedly |
| `workflow` | CI/CD issues |
| `tooling` | Missing automation or integration |

## Commands

### `observe` — Capture friction

**When:** Building, reviewing, testing, or maintaining went wrong.

```bash
/dev-grow-specialist observe
/dev-grow-specialist observe --type scaffolding
```

**Example friction:**
- "Created skill missing required frontmatter fields"
- "Review didn't catch that workflow had hardcoded paths"
- "Test methodology for agents is unclear"

---

### `review` — Find patterns

**When:** After several observations, or weekly check.

```bash
/dev-grow-specialist review
/dev-grow-specialist review --threshold 2
```

**What it does:**
- Groups observations by type
- Finds patterns with 3+ occurrences
- Applies 3-Condition Test
- Creates proposals

---

### `refine` — Improve proposal

**When:** Proposal exists but needs more examples or clearer scope.

```bash
/dev-grow-specialist refine skill-validator
```

---

### `graduate` — Proposal → Specialist

**When:** Proposal has 5+ consultations, scope is stable.

```bash
/dev-grow-specialist graduate skill-validator
/dev-grow-specialist graduate skill-validator --dry-run
```

---

### `promote` — Specialist → Subagent

**When:** Specialist affects 10+ interactions, critical for workflow.

```bash
/dev-grow-specialist promote skill-validator
```

**Output:** Subagent in `apps/dev/agents/`

---

### `audit` — Check redundancy

**When:** Checking overlap with generic specialists.

```bash
/dev-grow-specialist audit
/dev-grow-specialist audit --mark-deprecated
```

---

### `status` — View state

**When:** Check progress, see what's ready.

```bash
/dev-grow-specialist status
/dev-grow-specialist status skill-validator
```

## Example Workflow

### Week 1: Capture friction

```bash
# Skill creation had missing fields
/dev-grow-specialist observe --type scaffolding

# Review missed a workflow issue
/dev-grow-specialist observe --type review

# Same scaffolding issue again
/dev-grow-specialist observe --type scaffolding
```

### Week 2: Review and propose

```bash
# Check what patterns emerged
/dev-grow-specialist review

# Creates proposal for "skill-validator" (3 scaffolding observations)
```

### Week 3: Consult and refine

```bash
# Use the proposal when creating skills
# (Consultations tracked)

# Add more examples
/dev-grow-specialist refine skill-validator
```

### Week 4: Graduate

```bash
# Proposal has been consulted 5 times
/dev-grow-specialist graduate skill-validator

# Now it's a documented specialist
```

### Later: Promote

```bash
# Specialist affected 10+ skill creations
/dev-grow-specialist promote skill-validator

# Now it's an autonomous subagent
```

## Files

```
.syner/ops/dev-grow-specialist/
├── observations.md       # Your friction log
├── tracking.md           # Metrics
└── proposals/            # Active proposals

.syner/artifacts/dev-grow-specialist/
└── specialists/          # Graduated specialists

apps/dev/agents/          # L3 destination (promoted subagents)
```

## Philosophy

**Observe cheap, promote expensive.**

- Observations: Log everything, no filtering
- Proposals: Pattern detected, scope forming
- Specialists: Consulted repeatedly, stable
- Subagents: Critical, affects everything

## vs syner-grow-orchestration

| Question | Route to |
|----------|----------|
| "What should route where?" | `syner-grow-orchestration` |
| "How should I build/review/test this?" | `dev-grow-specialist` |

Orchestration produces principles. Dev produces specialists.

## Tips

**When to observe:**
- Any skill creation that required fixes afterward
- Any review that missed something
- Any test that was unclear
- Any maintenance task you've done before

**Signs a proposal is ready for graduation:**
- You consult it when building
- Scope hasn't changed in 2 consultations
- Can state it in one sentence

**Signs a specialist is ready for promotion:**
- Affects most build/review/test cycles
- Breaking it causes problems
- Can define its own execution steps

## Troubleshooting

**"Review found no patterns"**
→ Need more observations (at least 3 of same type)

**"Proposal failed 3-Condition Test"**
→ Friction isn't recurring or doesn't need judgment

**"Specialist scope keeps changing"**
→ Not stable yet, keep consulting

**"Promoted but not useful"**
→ May need to demote, gather more evidence

## Related

- **`/syner-grow-orchestration`** — Sibling for orchestration friction
- **`/create-syner-skill`** — What this skill helps improve
- **`/syner-skill-reviewer`** — Review criteria evolve here
- **`grow.md`** — Shared methodology reference

---

**Version:** 0.0.1 - Expect evolution. This skill practices what it preaches.
