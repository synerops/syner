# Syner

## What is Syner?

Syner provides **opinionated defaults** for Syner OS. While `@syner/sdk` exports primitives (classes), `syner` exports factories with default configuration.

## Architecture

```
@syner/sdk → Primitives (Orchestrator, Planner, Executor classes)
syner      → Factories with defaults (createOrchestrator, createPlanner, createExecutor)
```

## Defaults

**Model:** `xai/grok-4-fast-reasoning` (all agents)

**Injected:** `createOrchestrator()` auto-injects default Planner + Executor

## Usage

### Quick Start

```typescript
import { createOrchestrator } from "syner/agents";

const orchestrator = createOrchestrator();

// Ready to use - planner and executor already injected
const result = await orchestrator.run({
  prompt: "Your task here",
});
```

### Custom Configuration

```typescript
import { createOrchestrator, createPlanner } from "syner/agents";

const orchestrator = createOrchestrator({
  model: "openai/gpt-4o",
});

const customPlanner = createPlanner({
  model: "anthropic/claude-3-5-sonnet",
});

orchestrator.addPlanner(customPlanner);
```

## Factories

- `createOrchestrator(overrides?)` - Orchestrator with Syner defaults + injected planner/executor
- `createPlanner(overrides?)` - Planner with Syner defaults
- `createExecutor(overrides?)` - Executor with Syner defaults

All factories accept partial overrides. See JSDoc in source for details.

## Relationship with SDK

SDK = unopinionated primitives | Syner = opinionated defaults

For full control, use SDK primitives directly. For quick start, use Syner factories.
