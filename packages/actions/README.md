# @syner/actions

Universal communication layer for Syner OS apps. This package enables apps to communicate and execute commands across the operating system through a standardized action system.

## Quick Start

Define and execute actions between apps in 3 steps:

```typescript
// 1. Define an action
const listFiles = action({
  id: 'files:list',
  description: 'List files in directory',
  parameters: z.object({
    path: z.string(),
  }),
  execute: async (params) => {
    return { files: ['file1.txt', 'file2.txt'] };
  },
});

// 2. Register in app startup
import { registry } from '@syner/actions';

registry.register('files', [listFiles]);

// 3. Execute from another app
import { actions } from '@syner/actions';

const result = await actions.run({
  action: 'files:list',
  params: { path: '/documents' },
  metadata: { app: 'workflows' }
});
```

## Core Concepts

### App Communication Pattern
Apps communicate through actions using the `namespace:verb` format:
- `files:list` - List files from the files app
- `workflows:start` - Start a workflow from the workflows app
- `chat:send` - Send a message from the chat app

### Action Definition
Each action has:
- **ID**: Unique identifier (`namespace:verb`)
- **Description**: Human-readable purpose
- **Parameters**: Zod schema for type-safe inputs
- **Execute**: Function that performs the action

### App Registries
Each app registers its actions with the global registry:

```typescript
// apps/files/actions.ts
import { registry } from '@syner/actions';

export const filesActions = [
  listFilesAction,
  createFileAction,
  deleteFileAction,
];

// apps/files/registry.ts
registry.register('files', filesActions);

// apps/workflows/actions.ts
import { registry } from '@syner/actions';

export const workflowActions = [
  startWorkflowAction,
  stopWorkflowAction,
];

// apps/workflows/registry.ts
registry.register('workflows', workflowActions);
```

## Examples

### Basic App Communication

```typescript
import { actions } from '@syner/actions';

// Workflows app needs to list files
const result = await actions.run({
  action: 'files:list',
  params: { path: '/workflows' },
  metadata: { app: 'workflows' }
});

// Files app needs to start a workflow
const result = await actions.run({
  action: 'workflows:start',
  params: { 
    workflowId: 'backup-files',
    trigger: 'manual'
  },
  metadata: { app: 'files' }
});
```

### Action Definition with Validation

```typescript
const startWorkflow = action({
  id: 'workflows:start',
  description: 'Start a workflow execution',
  parameters: z.object({
    workflowId: z.string(),
    trigger: z.enum(['manual', 'scheduled', 'webhook']),
    variables: z.record(z.unknown()).optional(),
  }),
  execute: async (params) => {
    // Implementation here
    return { 
      status: 'started', 
      executionId: 'exec-123' 
    };
  },
});
```

## Next.js Integration

### Server Actions

```typescript
// app/actions.ts
'use server';

import { actions } from '@syner/actions';

export async function executeAction(action: string, params?: any) {
  return await actions.run({
    action,
    params,
    metadata: {
      app: 'server-action',
      timestamp: Date.now()
    }
  });
}
```

### Route Handlers

```typescript
// app/api/actions/route.ts
import { actions } from '@syner/actions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await actions.run(body);
  return NextResponse.json(result);
}
```

## API Reference

### registry

Global registry for registering app actions:

```typescript
import { registry } from '@syner/actions';

registry.register(name: string, actions: Action[]): void
registry.getApps(): string[]
registry.getActions(app: string): Action[]
```

### actions

Global actions system for executing actions:

```typescript
import { actions } from '@syner/actions';

actions.run(input: ActionInput): Promise<ActionOutput>
actions.list(): string[]
```

### Types

```typescript
type Action = {
  id: string;              // "namespace:verb"
  description: string;
  parameters: z.ZodSchema;
  execute: ActionHandler;
}

type ActionInput = {
  action: string;          // "namespace:verb"
  params?: Record<string, unknown>;
  metadata?: {
    app: string;          // Calling app
    timestamp: number;
  };
}

type ActionOutput = {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    executionTime: number;
    timestamp: number;
  };
}
```
