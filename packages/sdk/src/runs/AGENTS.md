# Runs API

## Purpose

Track and execute agent runs, including sandboxed execution.

## API Hierarchy

```
runs/
├── index.ts          (run schema and exports)
└── sandbox.ts        (sandbox run execution)
```

## Structure

### Run Schema

- `RunSchema` - Zod schema for run tracking
- Defines structure for run metadata (id, name)

### Sandbox Execution

- `run()` - Main entry point for executing agent logic in sandbox
- `RunOptions` - Options for sandbox execution
  - `task` - Task description
  - `inSandbox` - Whether to run in sandbox
  - `project` - Optional git repository URL
  - `sandbox` - Optional sandbox instance (if not provided and inSandbox is true, extension must create it)
- `RunResult` - Result of execution
  - `result` - Generated result from agent
  - `sandbox` - Sandbox instance used

## Integration Points

This API integrates with:

- **Sandbox protocol** via `system/sandbox` - Uses `Sandbox` interface
- **Extensions** (e.g., `@syner/vercel`) - Provides sandbox implementation
- **Agent execution** - Executes agent loop within sandbox

## Directives

**DOES:**

- Execute agent logic within sandbox environment
- Manage sandbox lifecycle (create, setup, cleanup)
- Clone repositories into sandbox
- Install dependencies in sandbox

**DOES NOT:**

- Create sandbox instances directly (extensions do this)
- Execute agent logic outside sandbox (for that, use agent directly)

**MUST** ensure cleanup - destroy sandbox in finally block

**SHOULD** handle errors gracefully and cleanup resources

## Usage

```typescript
import { run } from "@syner/sdk/runs"
import { createVercelSandbox } from "@syner/vercel"

// Create sandbox using extension
const sandbox = await createVercelSandbox({
  runtime: "node22",
  source: {
    url: "https://github.com/user/repo.git",
    type: "git"
  }
})

// Execute run
const result = await run({
  task: "Change hero of landing page",
  inSandbox: true,
  project: { url: "https://github.com/user/repo.git" },
  sandbox
})
```

## Flow

1. User calls `run()` with `inSandbox: true`
2. If sandbox not provided, must be created using extension (e.g., `@syner/vercel`)
3. If `project.url` provided, clone repository into sandbox
4. If package.json exists, install dependencies
5. Execute agent loop within sandbox
6. Return result
7. Cleanup sandbox (destroy)
