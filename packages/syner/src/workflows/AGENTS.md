# Workflows

## Export Guidelines

**DO NOT use `export * from './module'` patterns.**

Always use explicit named exports for better:

- Tree-shaking
- Type inference
- Code readability
- Build optimization

## Naming Convention

| Type                       | Pattern         | Example          |
| -------------------------- | --------------- | ---------------- |
| Interface (public contract)| `Agentic{Role}` | `AgenticRouter`  |
| Implementation (class)     | `{Role}`        | `Router`         |
| Workflow (verb/action)     | `{Action}`      | `Routing`        |

## Architecture

### File Structure

```
workflows/
├── routing.ts         ← AgenticRouter + Router + Routing
├── orchestration.ts   ← AgenticOrchestrator + Orchestrator + Orchestration
├── parallelization.ts ← Parallelization (uses Workflow[])
├── evaluation.ts      ← AgenticEvaluator + AgenticGenerator + Evaluator + Generator + Evaluation
└── AGENTS.md
```

### Design Principles

1. **Interface + Default Pattern**

   - Each agent type has a public interface (`Agentic{Role}`)
   - Default implementation uses AI SDK internally (`{Role}`)
   - Users can provide custom implementations

2. **Semantic Handlers**

   - NOT: `agent.generate(input)` (generic)
   - YES: `router.route(input, routes)` (semantic)

3. **Encapsulation**

   - AI SDK (`Experimental_Agent`) is internal detail
   - Workflows depend on interfaces, not implementations

4. **Workflows as Workers**

   - No `AgenticWorker` type - workers are `Workflow`s
   - Orchestration and Parallelization receive `Workflow[]`
   - This integrates with the OS `run()` system (timeout, retry, cancel, human-in-the-loop)

### Agent → Workflow Mapping

| Agent       | Interface            | Implementation | Workflow        | Handler Method                |
| ----------- | -------------------- | -------------- | --------------- | ----------------------------- |
| Router      | `AgenticRouter`      | `Router`       | `Routing`       | `route(input, routes)`        |
| Orchestrator| `AgenticOrchestrator`| `Orchestrator` | `Orchestration` | `orchestrate(task, workflows)`|
| Evaluator   | `AgenticEvaluator`   | `Evaluator`    | `Evaluation`    | `evaluate(output, criteria)`  |
| Generator   | `AgenticGenerator`   | `Generator`    | `Evaluation`    | `generate(input)`             |

> **Note:** `Parallelization` receives `Workflow[]` directly - no dedicated agent needed.

### Implementation Status

| Component           | Interface | Default Impl | Workflow Integration |
| ------------------- | --------- | ------------ | -------------------- |
| Router              | ⏳        | ⏳           | ⏳                   |
| Orchestrator        | ⏳        | ⏳           | ⏳                   |
| Evaluator           | ⏳        | ⏳           | ⏳                   |
| Generator           | ⏳        | ⏳           | ⏳                   |
| Parallelization     | N/A       | N/A          | ⏳                   |

## Pattern

Each workflow file exports:

- Interfaces for agentic contracts
- Default implementations
- Workflow class implementing `Workflow<T>` from `@syner/sdk`

Example:

```typescript
// Interface (public contract)
export interface AgenticRouter {
  route<K extends string>(input: unknown, routes: Record<K, Workflow<unknown>>): Promise<K>
}

// Default implementation
export class Router implements AgenticRouter {
  async route(input, routes) { ... }
}

// Workflow
export interface RoutingConfig { ... }
export class Routing<T> implements Workflow<T, RoutingConfig> {
  async execute(input: unknown): Promise<T> { ... }
}
```
