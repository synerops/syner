# Agents

## Purpose

Orchestrate the agent loop by coordinating system APIs.

## Agents Hierarchy

```
agents/
├── planner.ts       (plan generation)
├── executor.ts      (plan execution)
└── orchestrator.ts  (loop coordination)
```

## Role in the System

Agents are **orchestrators** that use system APIs to implement the agent loop:

```
orchestrator
    ↓ coordinates
planner → executor
    ↓ uses
context → actions → checks
```

## Integration Points

Agents integrate with:

- **context/** - To gather information
- **actions/** - To execute operations
- **checks/** - To verify results

## Directives

**MUST** use namespace APIs exclusively (import from `../context`, `../actions`, `../checks`)

**MUST** coordinate the loop:

- orchestrator coordinates the overall flow
- planner decides what to do
- executor carries out the plan

**SHOULD** be stateless (state lives in context/storage, agents orchestrate)

**NEVER** implement primitives (use namespace APIs, don't duplicate them)

**NEVER** depend on other agents:

- Each agent should be independently testable
- Orchestrator coordinates, agents don't call each other directly
