---
name: task
description: >
  Entry point for any task. Detects user intent, classifies complexity,
  and decides the next step (respond, execute, plan, or delegate).
  Use as first step before invoking specific workflows.
---

# /task — Intent Detection & Routing

Universal entry point for Syner. Analyzes input, detects intent,
and decides the optimal path.

## Pattern

```
input → classify(intent, complexity) → route(action)
```

## Process

1. **Read** the user input
2. **Classify intent** using the schema in assets/intent.md
3. **Evaluate complexity** (depth, width)
4. **Decide action**:
   - `direct` → respond inline
   - `execute` → use worker
   - `plan` → EnterPlanMode
   - `delegate` → invoke appropriate workflow
   - `clarify` → AskUserQuestion

## Reference

See [references/intent.md](references/intent.md) for classification
patterns and decision criteria.

## Mapping Intent → Workflow

| Intent Type | Workflow |
|-------------|----------|
| direct | none (inline response) |
| execute | /route → worker |
| plan | EnterPlanMode |
| delegate (simple) | /route |
| delegate (complex) | /orchestrate |
| delegate (parallel) | /parallelize |
| delegate (quality) | /evaluate |

## Rules

- ALWAYS produce structured output (assets/intent.md schema)
- NEVER assume complexity without analysis
- If confidence < 0.7, request clarification
- Respect OS Protocol: context → actions → checks
