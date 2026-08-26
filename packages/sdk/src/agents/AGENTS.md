# Agents

## Structure

```
agents/
├── classifier.ts     (task classification)
├── coordinator.ts    (coordination logic)
├── planner.ts        (plan generation)
├── summarizer.ts     (result summarization)
├── orchestrator.ts   (team coordination)
└── index.ts          (public exports)
```

## Pattern

Each agent follows:

```ts
export interface {Agent}Output { ... }
export interface {Agent} extends Agent<ToolSet, Output>
export class Default{Agent} extends Agent<ToolSet, Output> implements {Agent}
```

## Orchestrator Team

`DefaultOrchestrator` manages agents via:

- `team: Map<string, Agent>` - registry of team agents
- Methods delegate to team members (classify → classifier, coordinate → coordinator, etc.)
- Set team via constructor settings or setter

## Exports

`index.ts` re-exports all agents - import from `@syner/sdk/agents`
