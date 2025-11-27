# Workflows

Agentic workflow implementations for Syner OS.

## Architecture

### Workflow vs Agent

```
Workflow                          Agent
├── execute()      ───────────►   ├── execute()
├── config?                       ├── config (required)
                                  ├── static name
                                  ├── static description
                                  └── static metadata
```

**An Agent is a Workflow with metadata.**

- `Workflow`: Minimal contract for the run system (timeout, retry, cancel, etc.)
- `Agent`: Workflow + static metadata for Syner to understand what it is

### Method Hierarchy

Each agent follows a three-layer pattern:

```
┌─────────────────────────────────────────────────────────┐
│  execute()                                              │
│  └── Infrastructure layer (run system)                  │
│       └── timeout, retry, cancel, human-in-the-loop    │
├─────────────────────────────────────────────────────────┤
│  semantic method (e.g., route(), orchestrate())        │
│  └── Workflow logic layer                               │
│       └── The "what" of the workflow                    │
├─────────────────────────────────────────────────────────┤
│  _implementation() (e.g., _classify())                  │
│  └── Implementation layer (private)                     │
│       └── AI SDK calls, external APIs, etc.             │
└─────────────────────────────────────────────────────────┘
```

### Example: Routing

```typescript
class Routing implements Agent<Output, RoutingConfig> {
  // Infrastructure - used by run system
  async execute(input: unknown): Promise<Output> {
    const selected = await this.route(input)
    return this.config.routes[selected].execute(input)
  }

  // Semantic - workflow logic
  async route(input: unknown): Promise<RouteKey> {
    const keys = Object.keys(this.config.routes)
    return this._classify(input, keys)
  }

  // Implementation - private details
  private async _classify(input: unknown, keys: RouteKey[]): Promise<RouteKey> {
    // AI SDK, generateObject, etc.
  }
}
```

## Available Workflows

| Workflow | Semantic Method | Description |
|----------|-----------------|-------------|
| Routing | `route()` | Classifies input and delegates to specialized workflows |
| Orchestration | `orchestrate()` | Decomposes tasks and coordinates worker workflows |
| Parallelization | `parallelize()` | Executes workflows concurrently (sectioning/voting) |
| Evaluation | `evaluate()` | Iteratively generates and refines output |

## Reference

Based on [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) by Anthropic.
