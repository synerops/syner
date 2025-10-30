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

## Testing Endpoints (with curl)

> Ensure the server is running (e.g. `syner dev`) and `AI_GATEWAY_API_KEY` is set in your environment.

### Health
```bash
curl -s http://localhost:3000/health | jq .
```

### Chat Completions (non-streaming)
```bash
curl -s -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-4",
    "messages": [
      { "role": "system", "content": "You are a helpful assistant." },
      { "role": "user", "content": "Say hello in one short sentence." }
    ],
    "temperature": 0.7,
    "max_tokens": 200
  }' | jq .
```

Notes:
- `Content-Type: application/json` is required.
- The server uses `AI_GATEWAY_API_KEY` (env var) to call the upstream AI Gateway.