# get

Reads one execution.

## Input

- `id`: the execution.

## Output

The execution.

## Rules

- Authorization: the principal needs `executions:read` on the execution,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the execution, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `execution not found`
- `not authorized`
