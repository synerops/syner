# executions

Owns executions: each run of a command in an environment, with status and
result.

## Schema (index)

- `id`: stable.
- `environmentId`: the environment.
- `command`: what to run.
- `input`: optional: stdin or arguments.
- `status`: `queued`, `running`, `succeeded`, `failed`, `cancelled`.
- `result`: `exitCode`, `output` (reference to the captured stream),
  `artifacts[]`.
- `createdBy, createdAt, finishedAt`: principal and timestamps.

## Rules

- An execution is long-running and carries its own status; it never returns an
  operation.
- Transitions: `queued` to `running`; `running` to `succeeded`, `failed`, or
  `cancelled`. Final states never change.
- Cancel is best-effort: the status becomes `cancelled` once the runtime
  confirms the stop.
- The result stays readable after the environment is stopped.

## Verbs

- [start](start/AGENTS.md): runs a command; allocates an environment when
  needed
- [cancel](cancel/AGENTS.md): stops it; status becomes cancelled
- [get](get/AGENTS.md): returns the execution with its status and result
- [list](list/AGENTS.md): returns executions, newest first
