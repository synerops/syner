# executions

Owns executions: each run of a command in an environment, with status and
result.

## Model (`execution.ts`)

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

## Use cases

### `start.ts`

Starts an execution of a command, allocating an environment when none is
given.

- A stopped environment is refused; nothing is allocated in its place.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the execution and its environment, and the outcome.

### `cancel.ts`

Cancels an execution that is queued or running.

- Cancelling a finished execution changes nothing and returns it as it is.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the execution, and the outcome.

### `get.ts`

Reads one execution.

### `list.ts`

Lists executions by environment or organization, paged.

## Exposure

Exposed through `POST /compute/executions`, `PATCH
/compute/executions/:id/cancel`, `GET /compute/executions/:id`, `GET
/compute/executions`. Contracts:
[/compute/executions](../../../api/compute/executions/AGENTS.md),
[/compute/executions/:id](../../../api/compute/executions/[id]/AGENTS.md),
[/compute/executions/:id/cancel](../../../api/compute/executions/[id]/cancel/AGENTS.md).
