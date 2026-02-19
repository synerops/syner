# @syner/sdk

## What is @syner/sdk?

The SDK is the TypeScript implementation of the [OS Protocol](https://github.com/synerops/osprotocol) specification. It provides the building blocks for creating AI agents that operate within a structured, predictable framework.

The SDK sits in the middle layer of the architecture: Protocol defines the contracts, SDK provides default implementations, and Extensions replace specific capabilities with vendor integrations.

## Installation

```bash
bun add @syner/sdk
```

## Usage

```typescript
import { Routing, env, createMemoryKv } from '@syner/sdk'

// Create in-memory KV store
const kv = createMemoryKv({ maxSize: 100 })

// Store and retrieve data
await kv.set('user:123', { name: 'Alice' })
const user = await kv.get('user:123')

// Create a routing workflow
const router = new Routing({
  model: gateway('anthropic/claude-haiku'),
  workflows: {
    support: { workflow: supportWf, description: 'Technical support' },
    billing: { workflow: billingWf, description: 'Billing inquiries' },
  }
})

// Run the workflow
const result = await router.run('I need help with my account')
```

## API

### Workflows

| Class | Purpose |
|-------|---------|
| `Routing` | Classify input and delegate to specialized workflows |
| `OrchestratorWorkers` | Plan, delegate to workers, synthesize results |
| `Parallelization` | Split into subtasks, run in parallel, merge |
| `EvaluatorOptimizer` | Generate, evaluate, iteratively improve |

### KV Store

| Function | Purpose |
|----------|---------|
| `createMemoryKv()` | In-memory KV store with LRU eviction |

### Environment

| Function | Purpose |
|----------|---------|
| `env.getSandbox()` | Get current sandbox from environment |
| `env.setSandbox()` | Set sandbox in environment |

## Related

- [OS Protocol](https://github.com/synerops/osprotocol) - The specification
- [@syner/upstash](../../extensions/upstash) - Distributed KV implementation
- [@syner/vercel](../../extensions/vercel) - Sandbox implementation