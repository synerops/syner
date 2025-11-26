# syner

Syner agent - Agentic workflow implementations for Syner OS.

## Workflows

Implements 4 core workflow patterns from Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents):

- **Routing**: Input classification and specialized handling
- **Parallelization**: Concurrent execution (sectioning/voting)
- **Orchestration**: Dynamic task decomposition and delegation
- **Evaluation**: Iterative generation and feedback

## Architecture

Each workflow uses **specialized agents** with semantic APIs:

```typescript
// Instead of generic generate()
agent.generate(input) // ❌

// Domain-specific handlers
router.route(input, routes) // ✅
orchestrator.orchestrate(task, workflows) // ✅
evaluator.evaluate(output, criteria) // ✅
```

### Naming Convention

| Type        | Pattern         | Example         |
| ----------- | --------------- | --------------- |
| Interface   | `Agentic{Role}` | `AgenticRouter` |
| Implementation | `{Role}`     | `Router`        |
| Workflow    | `{Action}`      | `Routing`       |

### Extensibility

All workflow agents expose interfaces for custom implementations:

```typescript
import { AgenticRouter, Router, Routing } from 'syner'

// Use default implementation
const workflow = new Routing({
  router: new Router({ model }),
  routes: { billing, support, sales },
})

// Or provide custom implementation
class CachedRouter implements AgenticRouter {
  async route(input, routes) {
    const cached = await cache.get(input)
    if (cached) return cached
    // ... custom logic
  }
}

const workflow = new Routing({
  router: new CachedRouter(),
  routes: { billing, support, sales },
})
```

## Usage

```typescript
import { run } from '@syner/sdk'
import { Routing, Router } from 'syner'

const workflow = new Routing({
  router: new Router({ model: openai('gpt-4') }),
  routes: {
    billing: billingWorkflow,
    support: supportWorkflow,
    sales: salesWorkflow,
  },
})

const execution = await run({ workflow })
const result = await execution.result
```

## Status

> **Work in Progress** - Implementing workflow agents incrementally.

| Workflow        | Status     |
| --------------- | ---------- |
| Routing         | ⏳ Pending |
| Parallelization | ⏳ Pending |
| Orchestration   | ⏳ Pending |
| Evaluation      | ⏳ Pending |
