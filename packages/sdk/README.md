# @syner/sdk

## What is @syner/sdk?

The SDK is the TypeScript implementation of the [OS Protocol](https://github.com/synerops/protocol) specification. It provides the building blocks for creating AI agents that operate within a structured, predictable framework.

The SDK sits in the middle layer of the architecture: Protocol defines the contracts, SDK provides default implementations, and Extensions replace specific capabilities with vendor integrations.

## Installation

```bash
bun add @syner/sdk
```

## Usage

```typescript
import { Routing, env, createMemoryCache } from '@syner/sdk'
import { discoverSkills } from '@syner/sdk/lib'

// Discover available skills
const skills = await discoverSkills('./skills')

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

### Data

| Function | Purpose |
|----------|---------|
| `createMemoryCache()` | In-memory cache with LRU eviction |
| `env.getSandbox()` | Get current sandbox from environment |

### Skills

| Function | Purpose |
|----------|---------|
| `discoverSkills(path)` | Find SKILL.md files recursively |
| `parseSkillFile(content)` | Parse YAML frontmatter from skill |
| `loadSkillTools(skill)` | Dynamically load skill's tools |

## Related

- [OS Protocol](https://github.com/synerops/protocol) - The specification
- [@syner/upstash](../../extensions/upstash) - Distributed cache implementation
- [@syner/vercel](../../extensions/vercel) - Sandbox implementation
