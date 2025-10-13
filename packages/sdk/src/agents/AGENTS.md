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
system.context → system.actions → system.checks
```

## Integration Points

Agents integrate with:

- **system/context/** - To gather information
- **system/actions/** - To execute operations
- **system/checks/** - To verify results

## Directives

**MUST** use system APIs exclusively:

- Agents MUST import from `../system`
- Agents MUST NOT bypass system APIs

**MUST** coordinate the loop:

- orchestrator coordinates the overall flow
- planner decides what to do
- executor carries out the plan

**SHOULD** be stateless:

- State lives in system (via context/storage)
- Agents orchestrate, don't store

**NEVER** implement primitives:

- Don't reimplement what system provides
- Use system APIs, don't duplicate them

**NEVER** depend on other agents:

- Each agent should be independently testable
- Orchestrator coordinates, agents don't call each other directly
