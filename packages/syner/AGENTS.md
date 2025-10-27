# Syner

## What is Syner?

Syner is **the fullstack agent** - a reference implementation demonstrating how to build agents using the SDK. While `@syner/sdk` provides primitives, `syner` provides a complete, production-ready agent with opinionated defaults.

## Architecture

```
@syner/sdk → Primitives (Orchestrator, Planner classes)
syner      → Factories with defaults (createOrchestrator, createPlanner)
```

## Relationship with SDK

SDK = unopinionated primitives | Syner = opinionated defaults

For full control, use SDK primitives directly. For quick start, use Syner factories.
