# Workflows

## Export Guidelines

**DO NOT use `export * from './module'` patterns.**

Always use explicit named exports for better:

- Tree-shaking
- Type inference
- Code readability
- Build optimization

## Architecture

### Workflow Agents Strategy

Workflows use **specialized agents** with domain-specific handlers:

```
workflows/
├── agents/                    ← Interfaces + Default implementations
│   ├── index.ts
│   ├── router.ts              ← RouterAgent.route()
│   ├── orchestrator.ts        ← OrchestratorAgent.orchestrate()
│   ├── worker.ts              ← WorkerAgent.work()
│   ├── evaluator.ts           ← EvaluatorAgent.evaluate()
│   └── generator.ts           ← GeneratorAgent.create()
├── routing.ts                 ← Uses RouterAgent
├── orchestrator-worker.ts     ← Uses OrchestratorAgent + WorkerAgent
├── parallelization.ts         ← Uses WorkerAgent (multiple)
└── evaluator-optimizer.ts     ← Uses EvaluatorAgent + GeneratorAgent
```

### Design Principles

1. **Interface + Default Pattern**

   - Each agent type has a public interface
   - Default implementation uses AI SDK internally
   - Users can provide custom implementations

2. **Semantic Handlers**

   - NOT: `agent.generate(input)` (generic)
   - YES: `router.route(input, routes)` (semantic)

3. **Encapsulation**
   - AI SDK (`Experimental_Agent`) is internal detail
   - Workflows depend on interfaces, not implementations

### Agent → Workflow Mapping

| Agent Interface    | Used By                            | Handler Method               |
| ------------------ | ---------------------------------- | ---------------------------- |
| `RouterAgent`      | RoutingWorkflow                    | `route(input, routes)`       |
| `OrchestratorAgent`| OrchestratorWorkerWorkflow         | `orchestrate(task, workers)` |
| `WorkerAgent`      | OrchestratorWorker, Parallelization| `work(task)`                 |
| `EvaluatorAgent`   | EvaluatorOptimizerWorkflow         | `evaluate(output, criteria)` |
| `GeneratorAgent`   | EvaluatorOptimizerWorkflow         | `create(input)`              |

### Implementation Status

| Component          | Interface | Default Impl | Workflow Integration |
| ------------------ | --------- | ------------ | -------------------- |
| RouterAgent        | ⏳        | ⏳           | ⏳                   |
| OrchestratorAgent  | ⏳        | ⏳           | ⏳                   |
| WorkerAgent        | ⏳        | ⏳           | ⏳                   |
| EvaluatorAgent     | ⏳        | ⏳           | ⏳                   |
| GeneratorAgent     | ⏳        | ⏳           | ⏳                   |

## Pattern

Each workflow file exports:

- Interfaces for agents and config
- Class implementing `Workflow<T>` from `@syner/sdk`

Example:

```typescript
export interface {Name}Agents { ... }
export interface {Name}Config { ... }
export class {Name}Workflow<T> implements Workflow<T> { ... }
```
