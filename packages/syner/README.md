# syner

Syner agent - Agentic workflow implementations for Syner OS.

## Workflows

Implements 4 core workflow patterns from Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents):

- **RoutingWorkflow**: Input classification and specialized handling
- **ParallelizationWorkflow**: Concurrent execution (sectioning/voting)
- **OrchestratorWorkerWorkflow**: Dynamic task decomposition and delegation
- **EvaluatorOptimizerWorkflow**: Iterative generation and feedback

## Architecture

Each workflow uses **specialized agents** with semantic APIs:

```typescript
// Instead of generic generate()
agent.generate(input) // ❌

// Domain-specific handlers
router.route(input, routes) // ✅
orchestrator.orchestrate(task, workers) // ✅
evaluator.evaluate(output, criteria) // ✅
```

### Extensibility

All workflow agents expose interfaces for custom implementations:

```typescript
import { RouterAgent, RoutingWorkflow } from 'syner'

// Use default implementation
const workflow = new RoutingWorkflow({
  router: new DefaultRouterAgent({ model }),
  routes: { billing, support, sales },
})

// Or provide custom implementation
class CachedRouterAgent implements RouterAgent {
  async route(input, routes) {
    const cached = await cache.get(input)
    if (cached) return cached
    // ... custom logic
  }
}

const workflow = new RoutingWorkflow({
  router: new CachedRouterAgent(),
  routes: { billing, support, sales },
})
```

## Usage

```typescript
import { run } from '@syner/sdk'
import { RoutingWorkflow, DefaultRouterAgent } from 'syner'

const workflow = new RoutingWorkflow({
  router: new DefaultRouterAgent({ model: openai('gpt-4') }),
  routes: {
    billing: billingAgent,
    support: supportAgent,
    sales: salesAgent,
  },
})

const execution = await run({ workflow })
const result = await execution.result
```

## Status

> **Work in Progress** - Implementing workflow agents incrementally.

| Workflow                   | Status     |
| -------------------------- | ---------- |
| RoutingWorkflow            | ⏳ Pending |
| ParallelizationWorkflow    | ⏳ Pending |
| OrchestratorWorkerWorkflow | ⏳ Pending |
| EvaluatorOptimizerWorkflow | ⏳ Pending |
