# 01 - Hello World

The simplest example: a worker that executes a basic greeting task.

## What it does

- Creates a worker with a greeting capability
- Executes a simple task
- Shows the result

## How to run

```bash
npm run example:01
```

## What you'll learn

- How to create a Worker
- How to execute a Task
- How the basic Worker + Task + Capability pattern works
- How results are structured

## Flow

1. **Worker** is created with `greeting-capability`
2. **Task** is defined with a simple objective
3. **Worker** executes the task using its capability
4. **Result** is returned structured

## Files

- `worker.ts` - Worker definition
- `greeting-capability.ts` - Specific capability for greetings
- `run.ts` - Executable example
