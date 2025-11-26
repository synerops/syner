# syner

Syner agent - Agentic workflow implementations for Syner OS.

## Workflows

Implements 4 core workflow patterns from Anthropic's [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents):

- **OrchestratorWorkerWorkflow**: Dynamic task decomposition and delegation
- **RoutingWorkflow**: Input classification and specialized handling
- **ParallelizationWorkflow**: Concurrent execution (sectioning/voting)
- **EvaluatorOptimizerWorkflow**: Iterative generation and feedback

## Usage

```typescript
import { run } from '@syner/sdk'
import { OrchestratorWorkerWorkflow } from 'syner'

const workflow = new OrchestratorWorkerWorkflow(
  {
    orchestrator: orchestratorAgent,
    worker: workerAgent
  },
  { maxWorkers: 5 }
)

const execution = await run({ workflow })
const result = await execution.result
```

## Status

⚠️ **Work in Progress** - Workflow implementations are stubs pending agent system development.
