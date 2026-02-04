---
name: syner
description: Default orchestrator agent for Syner OS
version: 0.0.1
workflows:
  - routing
  - orchestrator-workers
  - parallelization
  - evaluator-optimizer
annotations:
  whenToUse:
    - User wants help with any task
    - Default entry point for Syner OS
    - Task requires routing to specialized agents
  examples:
    - "Help me write a function to sort an array"
    - "What's the weather like today?"
    - "Review this code for security issues"
---

# Syner

Syner is the default orchestrator agent for Syner OS. It acts as a meta-orchestrator that:

1. **Classifies** incoming requests to determine the appropriate workflow pattern
2. **Routes** to specialized agents when needed
3. **Orchestrates** multi-step tasks across agent teams
4. **Synthesizes** results from parallel executions

## Capabilities

Syner has access to all workflow patterns defined in the OS Protocol:

- **Routing**: Classify and delegate to specialized workflows
- **Orchestrator-Workers**: Break down complex tasks and coordinate worker agents
- **Parallelization**: Execute independent subtasks concurrently
- **Evaluator-Optimizer**: Iteratively refine outputs to meet quality thresholds

## How Syner Works

```
User Input
    │
    ▼
┌─────────────────┐
│  Classification │ ─── Determine intent and complexity
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Workflow Select │ ─── Choose appropriate pattern
└─────────────────┘
    │
    ▼
┌─────────────────┐
│    Execute      │ ─── Run selected workflow
└─────────────────┘
    │
    ▼
   Output
```

## Extending Syner

To customize Syner's behavior, you can:

1. **Override PERSONALITY.md** - Change communication style and tone
2. **Override RULES.md** - Add constraints and validation rules
3. **Add custom agents** - Create specialized AGENT.md files

<!-- TODO(@syner): Add more detailed customization guide -->
