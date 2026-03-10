# audit — Detect redundancy

Find overlapping specialists, identify gaps in coverage vs generic agents.

## When to Use

- Before promoting a specialist (check for overlap)
- Quarterly review of specialist ecosystem
- When unsure if a generic agent is still needed
- After promoting several specialists

## Input

```bash
/dev-grow-specialist audit
/dev-grow-specialist audit --mark-deprecated
/dev-grow-specialist audit --focus generics
/dev-grow-specialist audit --focus coverage
```

### Flags

| Flag | Description |
|------|-------------|
| `--mark-deprecated` | Update tracking with deprecated generics |
| `--focus generics` | Focus on generic vs custom overlap |
| `--focus coverage` | Focus on coverage gaps |

## Process

### 1. Load All Specialists

Gather:
- Proposals: `.syner/ops/dev-grow-specialist/proposals/`
- Specialists: `.syner/artifacts/dev-grow-specialist/specialists/`
- Subagents: `apps/dev/agents/` (evolved ones)
- Generics: `agency-eng-*`, `agency-test-*` (19 total)

### 2. Build Capability Matrix

```markdown
## Capability Matrix

### Custom Specialists (Evolved)

| Name | Level | Domain | Key Capability |
|------|-------|--------|----------------|
| [name] | L1/L2/L3 | [scaffolding/review/etc] | [one-liner] |

### Generic Specialists (Available)

| Name | Domain | Key Capability |
|------|--------|----------------|
| agency-eng-frontend-developer | Frontend | React, Vue, performance |
| agency-eng-backend-architect | Backend | API design, databases |
| agency-eng-security-engineer | Security | Security review, threat modeling |
| agency-eng-devops-automator | DevOps | CI/CD, infrastructure |
| agency-eng-senior-developer | Architecture | Code review, architecture |
| agency-eng-ai-engineer | AI | ML integration |
| agency-eng-mobile-app-builder | Mobile | iOS, Android |
| agency-eng-data-engineer | Data | Pipelines, ETL |
| agency-eng-rapid-prototyper | Prototyping | MVPs, POCs |
| agency-eng-technical-writer | Documentation | Docs |
| agency-eng-autonomous-optimization-architect | Optimization | Self-optimizing systems |
| agency-test-reality-checker | Testing | Production readiness |
| agency-test-api-tester | Testing | API validation |
| agency-test-performance-benchmarker | Testing | Load testing |
| agency-test-accessibility-auditor | Testing | WCAG compliance |
| agency-test-evidence-collector | Testing | Screenshot QA |
| agency-test-test-results-analyzer | Testing | Test evaluation |
| agency-test-tool-evaluator | Testing | Tech assessment |
| agency-test-workflow-optimizer | Testing | Process analysis |
```

### 3. Detect Overlaps

For each custom specialist, check overlap with generics:

```markdown
## Overlap Analysis

### [Custom Specialist Name]

**Potential overlaps:**

| Generic | Overlap | Recommendation |
|---------|---------|----------------|
| agency-eng-[name] | [high/medium/low/none] | [deprecate/keep/complement] |

**Analysis:**
- Custom knows: [specific ecosystem knowledge]
- Generic knows: [general knowledge]
- Overlap area: [what both cover]
- Custom advantage: [what custom does better]

**Verdict:** [Deprecate generic / Keep both / Custom replaces for specific tasks]
```

### 4. Identify Coverage Gaps

What friction types have no specialist coverage?

```markdown
## Coverage Gaps

### By Friction Type

| Type | Proposals | Specialists | Subagents | Coverage |
|------|-----------|-------------|-----------|----------|
| scaffolding | [N] | [N] | [N] | [good/partial/gap] |
| review | [N] | [N] | [N] | [good/partial/gap] |
| testing | [N] | [N] | [N] | [good/partial/gap] |
| maintenance | [N] | [N] | [N] | [good/partial/gap] |
| workflow | [N] | [N] | [N] | [good/partial/gap] |
| tooling | [N] | [N] | [N] | [good/partial/gap] |

### Gaps to Address

[For each gap:]

**[Friction type]**
- Observations logged: [N]
- No proposal yet because: [threshold not met / no pattern]
- Recommendation: [observe more / create manual proposal]
```

### 5. Detect Internal Redundancy

Are any custom specialists doing the same thing?

```markdown
## Internal Redundancy

### Potential Duplicates

| Specialist A | Specialist B | Overlap | Recommendation |
|--------------|--------------|---------|----------------|
| [name] | [name] | [description] | [merge/differentiate/keep] |

### Analysis

[For each potential duplicate:]

**[A] vs [B]**
- A scope: [scope]
- B scope: [scope]
- Overlap: [what's redundant]
- Recommendation: [action]
```

### 6. Update Tracking (if --mark-deprecated)

```markdown
## Deprecated Generics (for apps/dev)

- agency-eng-[name] → [custom-name]
  Deprecated: [date]
  Reason: [why custom is better]

- agency-test-[name] → [custom-name]
  Deprecated: [date]
  Reason: [why custom is better]
```

### 7. Output Report

```markdown
## Audit Complete

**Scope:**
- Custom specialists: [N] (L1: [n], L2: [n], L3: [n])
- Generic specialists: 19

### Overlaps Found

| Custom | Generic | Action |
|--------|---------|--------|
| [name] | agency-[name] | [deprecate/keep] |

### Coverage Analysis

| Type | Status |
|------|--------|
| scaffolding | [covered/gap] |
| review | [covered/gap] |
| testing | [covered/gap] |
| maintenance | [covered/gap] |
| workflow | [covered/gap] |
| tooling | [covered/gap] |

### Internal Redundancy

[None / List of duplicates]

### Recommendations

1. [Action item]
2. [Action item]
3. [Action item]

### Updated Tracking

[If --mark-deprecated was used:]
Marked [N] generics as deprecated in tracking.md
```

## Deprecation Criteria

A generic should be deprecated when:

1. **Custom specialist exists** with proven value (5+ consultations or 10+ interactions)
2. **Overlap is significant** (>70% of generic's capability covered)
3. **Custom has ecosystem context** that generic lacks
4. **No unique value** remains in generic for this project

A generic should be kept when:

1. **Complementary** — Custom handles specifics, generic handles general
2. **Different scope** — Custom is narrow, generic is broad
3. **Fallback needed** — Custom might not cover edge cases

## Coverage Gap Actions

| Gap Level | Observations | Action |
|-----------|--------------|--------|
| None | 0 | Watch for friction |
| Emerging | 1-2 | Continue observing |
| Ready | 3+ | Run review to create proposal |
| Mature | Proposal exists | Refine and graduate |
