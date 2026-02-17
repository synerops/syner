# Syner OS Application

Main runtime for the Agentic Operating System implementing the OS Protocol.

## Routes

| Path | Method | Description |
|------|--------|-------------|
| `/api/v1/chat` | POST | Main chat endpoint with agent loop |
| `/api/workflows/routing` | POST | Test routing workflow classification |

## Structure

```
app/
├── api/v1/
│   └── chat/route.ts      # Main agent endpoint
├── (os)/api/
│   └── workflows/         # Workflow test endpoints
│       └── routing/       # Routing classification test
└── lib/
    ├── identity.ts        # Load agent identity (AGENT.md, PERSONALITY.md, RULES.md)
    ├── skills.ts          # Skill discovery and tool loading
    └── agent-loop.ts      # Loop state and step handlers
```

## Testing

```bash
# Chat API v1
curl -s -X POST http://localhost:3000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, who are you?"}' | jq .

# Routing workflow test
curl -s -X POST http://localhost:3000/api/workflows/routing \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I need a refund"}' | jq .
```

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `SYNER_ORCHESTRATOR_MODEL` | `anthropic/claude-haiku-4.5` | Model for routing/orchestration |

## Agent Loop

The chat endpoint implements the OS Protocol agent loop:

1. **Load Identity** - AGENT.md, PERSONALITY.md, RULES.md from `syner` package
2. **Initialize Skills** - Discover SKILL.md files and load tools
3. **Build System Prompt** - Combine identity with skill descriptions
4. **Execute Loop** - context → actions → checks → repeat
5. **Return Response** - Text, steps summary, sandbox state
