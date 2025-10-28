# Syner

## What is Syner?

Syner is **the fullstack agent** - a complete application that includes:
- **CLI** - Command-line interface for development
- **Express Server** - HTTP API server for agent communication  
- **API** - Opinionated defaults built on [@syner/sdk](../../packages/sdk)

## Architecture

```
@syner/sdk → Primitives (Orchestrator, Planner classes)
syner      → CLI + Express + API with defaults
```

## Usage

### CLI Commands
```bash
# Start development server
syner dev

# Show help
syner --help
```

### As Library
```bash
bun add syner
```

## Relationship with SDK

SDK = unopinionated primitives | Syner = opinionated agent + CLI
For full control, use SDK primitives directly. For quick start, use Syner.
