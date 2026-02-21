---
name: orchestrate
description: >
  Plan a complex task, delegate steps to multiple workers, synthesize results.
  Use when the task requires multiple specialists working sequentially or with
  dependencies. Syner's most powerful multi-agent pattern.
---

# /orchestrate — Orchestrator-Workers Workflow

Break down complex tasks, delegate to specialists, synthesize results.

## Pattern

```
input → plan() → steps[] → delegate(step)[] → results[] → synthesize() → output
```

## How to Execute

1. **Plan**: Break the task into steps
   - Each step has: id, description, worker, input
   - Steps can declare `dependsOn` other steps
   - Define the overall `goal`

2. **Delegate**: Execute each step with the right worker
   - Respect dependencies — don't start a step until its dependencies complete
   - Independent steps can run in parallel (use Task tool concurrently)
   - Collect `WorkerResult` for each step (success/failure + data)

3. **Synthesize**: Combine all results into final output
   - Consider the original goal
   - Handle partial failures — report what succeeded and what didn't
   - Present a coherent result, not a list of raw outputs

## Workers Available

| Worker | Agent/Tool | Capabilities |
|--------|-----------|-------------|
| `ecosystem` | ecosystem agent | Extensions, integrations, vendor work |
| `osprotocol` | osprotocol agent | Protocol schema, validation, domains |
| `code` | Claude (direct) | Implementation, tests, refactoring |
| `research` | Explore agent | Codebase search, architecture analysis |

## Rules

- Always plan before delegating — never improvise multi-step work
- Each step must have a clear worker assignment
- Synthesize at the end — don't just dump worker outputs
- If a step fails, decide: retry, skip, or abort the plan
