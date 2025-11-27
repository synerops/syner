# Workflows

> **DEPRECATED**: This folder is being migrated to `tools/` architecture.
> See migration plan below.

## Migration: Classes → Tools (AI SDK v6)

### Why Tools, Not Classes?

AI SDK v6 introduces a tools-first paradigm. Instead of:

```typescript
// ❌ Old pattern (class-based)
class MyRouter extends Router {
  async route(input) { ... }
}
const router = new MyRouter(config)
await router.execute(input)
```

Users now compose agents declaratively:

```typescript
// ✅ New pattern (tools-first)
import { route } from 'syner/tools'

const myAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    route({
      payments: {
        description: "Handle payment queries",
        whenToUse: "When user asks about billing",
        examples: ["I need a refund", "Check my invoice"]
      },
      support: {
        description: "Technical support",
        whenToUse: "When user has issues", 
        examples: ["App is crashing", "Can't login"]
      }
    })
  }
})
```

### Benefits

| Aspect | Classes | Tools |
|--------|---------|-------|
| **Composition** | `extends`, inheritance | `tools: { route(), orchestrate() }` |
| **Reusability** | Create subclasses | Import tool and configure |
| **AI SDK v6** | Custom Agent class | `ToolLoopAgent` + tools |
| **DX** | Boilerplate, constructors | Declarative, JSON-like config |
| **Flexibility** | Override methods | Combine tools freely |
| **Type inference** | Manual generics | `InferAgentUIMessage<typeof agent>` |

### New File Structure

```
syner/
├── tools/                    ← NEW: Tool functions
│   ├── route.ts              ← export function route(config): Tool
│   ├── orchestrate.ts        ← export function orchestrate(config): Tool
│   ├── evaluate.ts           ← export function evaluate(config): Tool
│   ├── parallelize.ts        ← export function parallelize(config): Tool
│   └── index.ts              ← export { route, orchestrate, evaluate, parallelize }
├── workflows/                ← DEPRECATED: Being migrated
│   ├── routing.ts            ← Will be deleted after migration
│   └── AGENTS.md
└── index.ts                  ← export tools from 'syner/tools'
```

### Tool Interface Pattern

Each tool is a function that returns an AI SDK Tool:

```typescript
// tools/route.ts
import { tool } from 'ai'
import { z } from 'zod'

interface RouteConfig {
  [routeName: string]: {
    description: string
    whenToUse: string
    examples: string[]
  }
}

export function route(config: RouteConfig) {
  return tool({
    description: 'Classifies input and routes to the appropriate handler',
    parameters: z.object({
      input: z.string().describe('The input to classify'),
      selectedRoute: z.enum(Object.keys(config) as [string, ...string[]])
        .describe('The route that best matches the input')
    }),
    execute: async ({ input, selectedRoute }) => {
      // Tool logic here
      return { route: selectedRoute, input }
    }
  })
}
```

### Usage in OS (User Side)

```typescript
// apps/os/agents/my-agent.ts
import { ToolLoopAgent } from 'ai'
import { route, orchestrate } from 'syner/tools'

export const myAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    route({
      billing: {
        description: "Billing and payments",
        whenToUse: "Invoices, refunds, subscriptions",
        examples: ["I need a refund", "Update payment method"]
      },
      support: {
        description: "Technical support",
        whenToUse: "Bugs, errors, troubleshooting",
        examples: ["App crashes on startup"]
      }
    }),
    orchestrate({
      // orchestration config
    })
  }
})

// Type inference for frontend
export type MyAgentMessage = InferAgentUIMessage<typeof myAgent>
```

### Migration Status

| Component | Class (old) | Tool (new) | Status |
|-----------|-------------|------------|--------|
| Routing | `Routing` class | `route()` tool | ⏳ Pending |
| Orchestration | `Orchestration` class | `orchestrate()` tool | ⏳ Pending |
| Evaluation | `Evaluation` class | `evaluate()` tool | ⏳ Pending |
| Parallelization | `Parallelization` class | `parallelize()` tool | ⏳ Pending |

---

## Legacy Documentation (To Be Removed)

### Export Guidelines

**DO NOT use `export * from './module'` patterns.**

Always use explicit named exports for better:

- Tree-shaking
- Type inference
- Code readability
- Build optimization
