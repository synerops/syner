# syner

Default orchestrator agent for Syner OS.

## Role

Syner is the meta-orchestrator that:
1. **Classifies** incoming requests
2. **Routes** to specialized agents/workflows
3. **Orchestrates** multi-step tasks
4. **Synthesizes** results

## Architecture

Syner provides AI SDK-specific implementations on top of @syner/sdk base classes:

```
@syner/sdk (base)     →  syner (AI SDK specific)
─────────────────────────────────────────────────
Routing<T>            →  Routing with generateObject
OrchestratorWorkers   →  (uses SDK base)
Parallelization       →  (uses SDK base)
EvaluatorOptimizer    →  (uses SDK base)
```

## Directory Structure

```
├── AGENT.md              # Syner as agent definition
├── PERSONALITY.md        # Default personality
├── RULES.md              # Default rules
└── src/
    ├── agents/           # Agent implementations
    │   └── router.ts     # Router agent with metadata
    ├── tools/            # AI SDK tools
    │   └── route.ts      # route() tool factory
    ├── workflows/        # AI SDK-specific workflows
    │   ├── routing.ts    # Uses generateObject
    │   └── indications.txt
    └── index.ts
```

## Semantic Files

Syner's behavior is defined by `.md` files:

| File | Purpose |
|------|---------|
| `AGENT.md` | Agent metadata and capabilities |
| `PERSONALITY.md` | Communication style and tone |
| `RULES.md` | Constraints and validation rules |

Users can override these files in their own directories to customize Syner.

## Usage

```typescript
import { Routing, Router, route } from 'syner'

// Use the Routing workflow
const routing = new Routing({
  model: gateway('anthropic/claude-haiku'),
  workflows: {
    billing: { workflow: billingWf, description: 'Billing tasks' },
    support: { workflow: supportWf, description: 'Support tasks' },
  }
})

// Or use the route() tool
const tools = { route: route({ ... }) }
```

## Extending Syner

To extend SDK base classes with custom implementations:

```typescript
import { OrchestratorWorkers } from 'syner'
import { generateObject } from 'ai'

const orchestrator = new OrchestratorWorkers({
  planner: async (prompt) => {
    const { object } = await generateObject({ ... })
    return object
  },
  synthesizer: async (results) => { ... },
  workers: { ... }
})
```
