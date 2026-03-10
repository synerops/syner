# refine — Improve a proposal

Enhance proposal based on real usage and add concrete examples.

## When to Use

- After consulting a proposal during bot work
- Before graduation consideration
- When scope needs sharpening

## Input

```bash
/bot-grow-specialist refine tone-adapter
/bot-grow-specialist refine handoff-router --add-example "Mar 5 enterprise lead"
```

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--add-example` | Add specific example | None |
| `--sharpen-scope` | Refine the scope statement | None |

## Process

### 1. Load Proposal

Read `.syner/ops/bot-grow-specialist/proposals/{name}.md`

### 2. Prompt for Refinement

```
What aspect to refine?

1. Add example from recent conversation
2. Sharpen scope statement
3. Update solution approach
4. Add consultation note
```

### 3. Update Proposal

Add to appropriate section:

**For examples:**
```markdown
## Evidence

- [existing entries]
- {date}: {new example from real conversation}
```

**For scope:**
```markdown
## Scope

{Updated one-sentence scope}

### Scope Evolution
- v1: {original scope}
- v2: {refined scope}
```

**For consultation:**
```markdown
## Consultations

- [existing entries]
- {date}: {how it was used, what worked}
```

### 4. Track Format Evolution

If the proposal's structure is changing organically, note it:

```markdown
## Meta

Format evolution: {description of how structure is adapting}
```

This is a signal of real adaptation vs generic template.

### 5. Update Tracking

In `.syner/ops/bot-grow-specialist/tracking.md`:

```markdown
## {name}
Level: L1 (Proposal)
Consultations: {count + 1}
Last refined: {date}
Format evolution: {yes/no}
```

### 6. Output Confirmation

```
Refined: {name}

Changes:
  - {what was updated}

Status:
  Consultations: {count}
  Threshold for graduation: 5
  {count >= 5 ? "Ready for graduation!" : "Needs {5-count} more consultations"}

Run `/bot-grow-specialist graduate {name}` when ready.
```

## What Makes Good Refinement

### Good examples:
- Specific date and conversation
- Clear description of friction
- What the specialist would have done

### Good scope refinement:
- Narrower focus
- More precise language
- Based on actual usage patterns

### Good consultation notes:
- What decision was made using the proposal
- What worked / what didn't
- Any scope creep to avoid

## Signs Proposal is Maturing

- Scope statement hasn't changed in 3+ consultations
- Examples are converging on same pattern
- Format is evolving to match actual needs
- "Would have helped" becomes "did help"

## Output Template

```
Refined: [name]

Changes:
  - [Added example: "..."]
  - [Sharpened scope: "..."]
  - [Added consultation note]

Status:
  Consultations: [count]
  Examples: [count]
  Scope stability: [stable/evolving]

[If ready:]
Proposal appears mature. Consider `/bot-grow-specialist graduate [name]`

[If not ready:]
Keep refining. Needs [5-count] more consultations.
```
