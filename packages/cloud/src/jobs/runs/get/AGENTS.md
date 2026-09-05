# get

Reads one run.

## Input

- `id`: the run.

## Output

The run.

## Rules

- Authorization: the principal needs `runs:read` on the job, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the run, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `run not found`
- `not authorized`
