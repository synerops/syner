# refine — Improve a proposal

Enhance proposal based on real usage, add concrete examples from the codebase.

## When to Use

- After consulting a proposal for a real decision
- When scope needs adjustment
- To add concrete examples from actual work
- Before graduation to ensure maturity

## Input

```bash
/dev-grow-specialist refine [proposal-name]
/dev-grow-specialist refine skill-validator
/dev-grow-specialist refine skill-validator --add-example
```

### Flags

| Flag | Description |
|------|-------------|
| `--add-example` | Prompt for new concrete example |
| `--adjust-scope` | Modify the proposed scope |

## Process

### 1. Load Proposal

Read from `.syner/ops/dev-grow-specialist/proposals/[name].md`

Verify status is `active`

### 2. Increment Consultation

Update frontmatter:
```yaml
consultations: [N+1]
```

### 3. Gather Refinement

Prompt for:

```
How did you use this proposal?
Context: (what you were building/reviewing/testing)
Outcome: (did it help? what was missing?)
Example: (specific code/PR/skill involved)
```

### 4. Update Proposal

#### Add to Evidence

```markdown
## Evidence

| Date | Type | Friction |
|------|------|----------|
| [existing entries] |
| [date] | consultation | [how it was used] |
```

#### Add to Examples (if concrete)

```markdown
## Concrete Examples

### Example 1: [context]

**Situation:** [what you were doing]
**Applied:** [how you used the proposal]
**Outcome:** [what happened]
**Code/PR:** [reference]

### Example 2: ...
```

#### Adjust Scope (if needed)

If the consultation revealed scope issues:

```markdown
## Scope Evolution

### Original Scope
[original]

### Refined Scope ([date])
[new scope]

### Reason for Change
[why]
```

### 5. Check Format Evolution

**Meta-signal:** If the proposal's format is evolving toward something more pragmatic than the template, note it:

```markdown
## Format Notes

Format evolved [N] times:
- [date]: Added [section] because [reason]
- [date]: Removed [section] because [reason]

→ Format evolution indicates real adaptation
```

### 6. Update Tracking

In `.syner/ops/dev-grow-specialist/tracking.md`:

```markdown
## [Proposal Name]

Level: L1 (Proposal)
Consultations: [N]
Last activity: [date]
Scope changes: [count]
Format evolution: [count]
```

### 7. Output Report

```markdown
## Refinement Complete

**Proposal:** [name]
**Consultations:** [N] (threshold: 5)
**Progress:** [N]/5 toward graduation

### This Refinement

- Context: [what you were doing]
- Outcome: [did it help]
- Example added: [yes/no]
- Scope adjusted: [yes/no]

### Proposal State

**Scope:** [current one-liner]

**Evidence:**
- Observations: [N]
- Consultations: [N]
- Concrete examples: [N]

### Readiness Check

- [ ] 5+ consultations: [PASS/FAIL]
- [ ] Scope stable (no changes in 2 consultations): [PASS/FAIL]
- [ ] Concrete examples from real work: [PASS/FAIL]

[If all pass:]
Ready for graduation: `/dev-grow-specialist graduate [name]`

[If not:]
Continue refining. [What's missing]
```

## Scope Stability

Scope is "stable" when:
- No changes in last 2 consultations
- Scope can be stated in one sentence
- No open questions about boundaries

Track stability in proposal:

```markdown
## Scope Stability

Last scope change: [date]
Consultations since: [N]
Status: [Stable/Evolving]
```

## Refinement Without Consultation

Sometimes you want to add an example without consulting:

```bash
/dev-grow-specialist refine skill-validator --add-example
```

This adds evidence but doesn't increment consultation count.

Use for:
- Adding historical examples you remembered
- Linking related PRs/commits
- Documenting existing patterns in codebase

## Edge Cases

**Proposal not found:**
```
Proposal not found: [name]

Available proposals:
- [list]

Create new: `/dev-grow-specialist review`
```

**Proposal already graduated:**
```
[name] is already a specialist (L2).

To refine the specialist, edit directly:
`.syner/artifacts/dev-grow-specialist/specialists/[name].md`
```

**Scope changed significantly:**
→ Consider if this is really the same proposal
→ May need to split into two proposals
→ Document reasoning in Scope Evolution section
