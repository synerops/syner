# @syner/workflows

AI-first workflow orchestration engine for Syner OS. This package provides actions for managing and executing workflows across the operating system with persistent context and cognitive capabilities.

## Quick Start

Create and use workflows in two simple steps:

```typescript
// 1. Define a workflow
import { workflow, inputs, steps } from '@syner/workflows';

const weatherWorkflow = workflow({
  id: 'get-weather',
  description: 'Fetch and format weather data',
  inputs: z.object({
    location: z.string(),
    units: z.enum(['celsius', 'fahrenheit'])
  }),
  steps: [
    {
      id: 'fetch',
      action: 'weather:fetch',
      inputs: {
        location: inputs('location')
      }
    }
  ]
});

// 2. Start the workflow
import { actions } from '@syner/actions';

const result = await actions.run({
  action: 'workflows:start',
  params: { 
    id: 'get-weather',
    inputs: { 
      location: 'New York',
      units: 'celsius'
    }
  },
  metadata: { app: 'weather', timestamp: Date.now() }
});
```

## Creating Workflows

Define workflows using the `workflow()` function with steps:

```typescript
import { workflow, inputs, steps } from '@syner/workflows';
import { z } from 'zod';

const backupWorkflow = workflow({
  id: 'backup-files',
  description: 'Backup files with compression',
  inputs: z.object({
    sourcePath: z.string(),
    destinationPath: z.string()
  }),
  steps: [
    {
      id: 'scan',
      action: 'files:scan',
      inputs: {
        path: inputs('sourcePath')
      }
    },
    {
      id: 'compress',
      action: 'files:compress',
      inputs: {
        files: steps('scan').outputs.data
      }
    },
    {
      id: 'copy',
      action: 'files:copy',
      inputs: {
        source: steps('compress').outputs.data,
        destination: inputs('destinationPath')
      }
    }
  ]
});
```

## Workflow Patterns

### Sequential Steps
Workflows execute steps one after another, passing data between them:

```typescript
const dataPipeline = workflow({
  id: 'data-pipeline',
  steps: [
    { id: 'fetch', action: 'api:fetch', inputs: { url: inputs('url') } },
    { id: 'process', action: 'data:process', inputs: { data: steps('fetch').outputs.data } },
    { id: 'save', action: 'db:save', inputs: { result: steps('process').outputs.data } }
  ]
});

### Parallel Execution
Execute multiple steps simultaneously:

```typescript
const parallelResearch = workflow({
  id: 'parallel-research',
  steps: [
    {
      id: 'research',
      parallel: [
        { action: 'search:web', inputs: { query: inputs('query') } },
        { action: 'search:docs', inputs: { query: inputs('query') } }
      ]
    }
  ]
});

### Conditional Logic
Branch workflows based on conditions:

```typescript
const smartProcessing = workflow({
  id: 'smart-processing',
  steps: [
    {
      id: 'analyze',
      choice: {
        condition: steps('check').outputs.confidence > 0.8,
        ifTrue: { action: 'auto:process' },
        ifFalse: { action: 'human:review' }
      }
    }
  ]
});



## Starting Workflows

Start workflows using the `workflows:start` action:

```typescript
import { actions } from '@syner/actions';

// Start a workflow with inputs
const result = await actions.run({
  action: 'workflows:start',
  params: { 
    id: 'get-weather',
    inputs: { 
      location: 'New York',
      units: 'celsius'
    }
  },
  metadata: { app: 'weather', timestamp: Date.now() }
});

if (result.success) {
  console.log('Workflow started:', result.data.executionId);
}
```

## Managing Workflows

### List Workflow Executions
```typescript
const listResult = await actions.run({
  action: 'workflows:list',
  params: { 
    status: 'running',
    limit: 10 
  },
  metadata: { app: 'admin', timestamp: Date.now() }
});

if (listResult.success) {
  console.log('Running workflows:', listResult.data.executions);
}
```

### Stop a Workflow Execution
```typescript
const stopResult = await actions.run({
  action: 'workflows:stop',
  params: { 
    executionId: 'exec_1234567890_abc123'
  },
  metadata: { app: 'admin', timestamp: Date.now() }
});

if (stopResult.success) {
  console.log('Workflow stopped:', stopResult.data.finalStatus);
}
```

## API Reference

### workflows:start
Start a workflow execution.

**Parameters:**
- `id` (string): Workflow identifier
- `inputs` (object): Input data for the workflow steps

**Returns:**
```typescript
{
  status: 'started',
  executionId: string,
  workflowId: string
}
```

### workflows:stop
Stop a running workflow execution.

**Parameters:**
- `executionId` (string): Execution identifier to stop

**Returns:**
```typescript
{
  status: 'stopped',
  executionId: string,
  finalStatus: string
}
```

### workflows:list
List workflow executions with optional filtering and pagination.

**Parameters:**
- `status` (string, optional): Filter by execution status
- `limit` (number, optional): Number of results to return (1-100, default: 20)
- `offset` (number, optional): Number of results to skip (default: 0)

**Returns:**
```typescript
{
  executions: ExecutionResult[],
  pagination: {
    total: number,
    limit: number,
    offset: number,
    hasMore: boolean
  }
}
```

## Integration

### Next.js Server Actions
```typescript
// app/actions/workflows.ts
'use server';

import { actions } from '@syner/actions';

export async function startWorkflow(id: string, inputs?: Record<string, unknown>) {
  return await actions.run({
    action: 'workflows:start',
    params: { id, inputs },
    metadata: { app: 'web', timestamp: Date.now() }
  });
}
```

### API Routes
```typescript
// app/api/workflows/route.ts
import { actions } from '@syner/actions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await actions.run({
    action: 'workflows:start',
    params: body,
    metadata: { app: 'api', timestamp: Date.now() }
  });
  return NextResponse.json(result);
}
```
