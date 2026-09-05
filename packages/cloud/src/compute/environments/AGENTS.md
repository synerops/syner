# environments

Owns environments: allocated runtimes with resources and a lifetime.

## Schema (index)

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

## Verbs

- [create](create/AGENTS.md): allocates an environment
- [get](get/AGENTS.md): returns the environment and its status
- [list](list/AGENTS.md): returns the organization's environments
- [remove](remove/AGENTS.md): stops and releases it
