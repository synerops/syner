# environments

Owns environments: allocated runtimes with resources and a lifetime.

## Model (`environment.ts`)

- `id`: stable.
- `organizationId`: the owner.
- `runtime`: a named runtime.
- `resources`: `cpu`, `memory`.
- `status`: `pending`, `ready`, `stopped`.
- `lifetime`: `ephemeral` or `kept`.
- `createdBy, createdAt, stoppedAt`: principal and timestamps.

## Rules

- An ephemeral environment is stopped when its last execution ends.
- A kept environment stops only through remove.
- A stopped environment accepts no executions and is never restarted; a new
  one is created instead.

## Use cases

### `create.ts`

Allocates an environment and drives it to ready.

- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the environment, and the outcome.

### `get.ts`

Reads one environment.

### `list.ts`

Lists the environments of an organization, paged.

### `remove.ts`

Stops an environment and releases its resources.

- Running executions in it are cancelled first.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the environment, and the outcome.

## Exposure

Exposed through `POST /compute/environments`, `GET /compute/environments/:id`,
`GET /compute/environments`, `DELETE /compute/environments/:id`. Contracts:
[/compute/environments](../../../api/compute/environments/AGENTS.md),
[/compute/environments/:id](../../../api/compute/environments/[id]/AGENTS.md).
