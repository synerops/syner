# Runs

Protocol interfaces for workflow execution lifecycle management.

## Overview

The Runs module provides TypeScript interfaces for managing workflow execution with support for:

- **Timeout** - Automatic timeout handling
- **Retry** - Configurable retry with backoff strategies
- **Cancel** - Cancellation with hooks
- **Human-in-the-loop** - Pause execution for approvals or input

## Usage

```typescript
import { run } from "syner"

const execution = await run({
  workflow: myWorkflow,

  timeout: {
    duration: 60000,
    onTimeout: () => console.log("Timed out")
  },

  retry: {
    attempts: 3,
    waitFor: 1000,
    backoff: 'exponential',
    onRetry: (error, attempt) => console.log(`Retry ${attempt}`)
  },

  cancel: {
    beforeCancel: () => true, // return false to abort cancellation
    afterCancel: () => console.log("Cancelled")
  },

  onComplete: (result) => console.log("Done", result),
  onFailed: (error) => console.error("Failed", error)
})
```

## Execution Control

```typescript
// Control flow
await execution.pause()
await execution.resume()
await execution.cancel("reason")

// Human-in-the-loop
const approval = await execution.waitForApproval("Deploy to prod?")
if (approval.approved) {
  // continue
} else {
  // handle rejection
}

const input = await execution.waitForInput<{ amount: number }>("Enter amount")

// Observability
execution.status    // 'in-progress' | 'awaiting' | 'completed' | 'failed' | 'cancelled'
execution.progress  // { current: number, total: number }
execution.logs      // string[]
execution.result    // Promise<T>
```

## Types

| Type | Description |
|------|-------------|
| `Run<T>` | Configuration for `run()` function |
| `Execution<T>` | Interface returned by `run()` |
| `Status` | Execution states |
| `Timeout` | Timeout configuration |
| `Retry` | Retry configuration |
| `Backoff` | Backoff strategy: `'none'` \| `'linear'` \| `'exponential'` |
| `Cancel` | Cancel hooks configuration |
| `Approval` | Result from `waitForApproval()` |

## State Machine

```
in-progress ──┬──► completed
              ├──► awaiting ──┬──► in-progress (approve/resume)
              │               └──► cancelled
              ├──► failed
              └──► cancelled
```
