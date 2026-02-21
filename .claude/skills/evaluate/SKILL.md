---
name: evaluate
description: >
  Generate output, evaluate against quality criteria, optimize iteratively
  until threshold is met. Use when quality is critical and first attempts
  may not be good enough.
---

# /evaluate — Evaluator-Optimizer Workflow

Generate, score, refine, loop until good enough.

## Pattern

```
input → generate() → output → evaluate() → passed? → yes: done / no: optimize() → loop
```

## How to Execute

1. **Generate**: Produce initial output
   - Create the first version of whatever is needed
   - Don't over-optimize on first pass — get something out

2. **Evaluate**: Score against criteria
   - Score 0.0 to 1.0
   - Check each criterion independently
   - Provide specific feedback on what's wrong
   - `passed` = meets threshold

3. **Optimize** (if not passed): Refine based on feedback
   - Use evaluation feedback to guide improvements
   - Don't start from scratch — refine what exists
   - Loop back to evaluate

4. **Terminate**: When passed OR max iterations reached
   - Default max: 3 iterations
   - If max reached without passing, return best attempt with evaluation notes

## Criteria Examples

| Criterion | Threshold | Description |
|-----------|-----------|-------------|
| correctness | 0.9 | Code compiles, logic is sound |
| completeness | 0.8 | All requirements addressed |
| style | 0.7 | Follows project conventions |
| performance | 0.7 | No obvious bottlenecks |

## Rules

- Always define criteria BEFORE generating
- Evaluation must be objective — use checks (typecheck, lint, tests) when possible
- Max 3 iterations by default — diminishing returns after that
- Return the best output even if threshold not fully met
