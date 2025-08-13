# @syner/workflows

Workflow execution engine for Syner OS. This package provides actions for managing and executing workflows across the operating system.

## Quick Start

The workflows package automatically registers its actions when imported:

```typescript
// Import to register actions (typically done in app startup)
import '@syner/workflows';

// Use actions from any app
import { actions } from '@syner/actions';

// Start a workflow
const result = await actions.run({
  action: 'workflows:start',
  params: { 
    id: 'backup-files',
    trigger: 'manual',
    variables: { sourcePath: '/documents' }
  },
  metadata: { app: 'files', timestamp: Date.now() }
});
```

## Available Actions

### workflows:start
Start a workflow execution.

**Parameters:**
- `id` (string): Workflow identifier
- `trigger` ('manual' | 'scheduled' | 'webhook'): How the workflow was triggered
- `variables` (object, optional): Variables to pass to the workflow

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

## Types

```typescript
type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

type ExecutionResult = {
  executionId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  output?: Record<string, unknown>;
};
```

## Examples

### Start a Workflow
```typescript
import { actions } from '@syner/actions';

const result = await actions.run({
  action: 'workflows:start',
  params: { 
    id: 'backup-files',
    trigger: 'manual',
    variables: { 
      sourcePath: '/documents',
      destinationPath: '/backups'
    }
  },
  metadata: { app: 'files', timestamp: Date.now() }
});

if (result.success) {
  console.log('Workflow started:', result.data.executionId);
}
```

### List Recent Executions
```typescript
const result = await actions.run({
  action: 'workflows:list',
  params: { 
    status: 'running',
    limit: 10 
  },
  metadata: { app: 'admin', timestamp: Date.now() }
});

if (result.success) {
  console.log('Running workflows:', result.data.executions);
}
```

### Stop a Workflow
```typescript
const result = await actions.run({
  action: 'workflows:stop',
  params: { 
    executionId: 'exec_1234567890_abc123' 
  },
  metadata: { app: 'admin', timestamp: Date.now() }
});

if (result.success) {
  console.log('Workflow stopped:', result.data.finalStatus);
}
```

## Integration

### Next.js Server Actions
```typescript
// app/actions/workflows.ts
'use server';

import { actions } from '@syner/actions';

export async function startWorkflow(id: string, variables?: Record<string, unknown>) {
  return await actions.run({
    action: 'workflows:start',
    params: { id, trigger: 'manual', variables },
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
