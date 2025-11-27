# syner

Syner agent - Agentic tools for Syner OS.

## Tools

Implements workflow patterns from Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) as composable AI SDK tools:

- **route()**: Input classification and routing to specialized handlers

## Usage

```typescript
import { generateText, gateway } from 'ai'
import { route } from 'syner'

const result = await generateText({
  model: gateway('anthropic/claude-sonnet-4.5'),
  prompt: 'I need a refund for my subscription',
  tools: {
    route: route({
      billing: {
        description: 'Billing and payments',
        whenToUse: 'Invoices, refunds, subscriptions',
        examples: ['I need a refund', 'Update payment method'],
      },
      support: {
        description: 'Technical support',
        whenToUse: 'Bugs, errors, troubleshooting',
        examples: ['App crashes on startup', "Can't login"],
      },
      code: {
        description: 'Code assistance',
        whenToUse: 'Writing, reviewing, or debugging code',
        examples: ['Write a function to sort an array'],
      },
      general: {
        description: 'General conversation',
        whenToUse: 'Greetings and general questions',
        examples: ['Hello, how are you?'],
      },
    }),
  },
  toolChoice: 'required',
})
```

## Configuration

The `route()` tool uses the model specified in `SYNER_ORCHESTRATOR_MODEL` environment variable (default: `anthropic/claude-haiku-4.5`).

```bash
export SYNER_ORCHESTRATOR_MODEL=anthropic/claude-haiku-4.5
```

## Examples

See [examples/](./examples) for runnable examples:

```bash
bun run examples/basic-router.ts
```

## Status

| Tool | Status |
|------|--------|
| route() | ✅ Ready |
| orchestrate() | ⏳ Pending |
| evaluate() | ⏳ Pending |
| parallelize() | ⏳ Pending |
