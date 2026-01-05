# Runs Module

Protocol interfaces for workflow execution lifecycle management.

## Structure

- `protocol/` - TypeScript interfaces (TODO: migrate to synerops/protocol)
  - `timeout.ts` - Timeout
  - `retries.ts` - Retry, Backoff
  - `cancel.ts` - Cancel
  - `human-in-the-loop.ts` - Approval

## Key Types

- `Status` - Execution states: in-progress, awaiting, completed, failed, cancelled
- `Run<T>` - Configuration for `run()` function
- `Execution<T>` - Interface returned by `run()` for controlling workflow execution
