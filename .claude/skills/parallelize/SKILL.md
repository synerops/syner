---
name: parallelize
description: >
  Split a task into independent subtasks, execute all concurrently, merge results.
  Use when subtasks don't depend on each other and speed matters.
---

# /parallelize — Parallelization Workflow

Split, run concurrent, merge.

## Pattern

```
input → split() → subtasks[] → parallel() → results[] → merge() → output
```

## How to Execute

1. **Split**: Decompose the task into independent subtasks
   - Each subtask must be fully independent — no dependencies
   - If subtasks depend on each other, use `/orchestrate` instead
   - Each subtask gets: id, prompt, optional metadata

2. **Parallel**: Execute ALL subtasks concurrently
   - Launch multiple Task tool calls in a single message
   - Each subtask runs as its own agent
   - Collect results in order

3. **Merge**: Combine results into a single coherent output
   - Handle partial failures based on strategy:
     - `fail-fast`: if any fails, abort all
     - `collect-all`: run all, report failures alongside successes
   - Default to `collect-all`

## When to Use

- Searching multiple locations in the codebase simultaneously
- Running independent checks (lint, typecheck, build) at once
- Gathering information from multiple sources in parallel
- Any task where "do A, B, C independently" applies

## Rules

- Subtasks MUST be independent — if they share state, use `/orchestrate`
- Always launch parallel tasks in a SINGLE message (multiple tool calls)
- Merge must produce one coherent output, not a list of fragments
