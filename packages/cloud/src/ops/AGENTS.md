# ops

Owns operations: the status, progress, and outcome of every long-running
administration action.

## Schema (index)

- `id`: stable.
- `organizationId`: the owner of the resource.
- `kind`: the verb that created it, as `<module>/<thing>/<verb>`.
- `resource`: `kind` and `id`.
- `status`: `pending`, `running`, `succeeded`, `failed`, `cancelled`.
- `progress`: `current`, `total`, `message`.
- `result`: set on success; shape defined by the creating verb.
- `error`: set on failure: `code`, `message`.
- `createdBy, createdAt, finishedAt`: principal and timestamps.

## Rules

- Every API call that outlives its request returns an operation reference;
  there is no other way to be long-running.
- Operations are created by use cases, never by clients: this module has no
  create verb.
- Transitions: `pending` to `running`; `running` to `succeeded`, `failed`, or
  `cancelled`. Final states never change.
- An operation is neither a compute execution nor a job run; the three stay
  distinct.
- Result and error stay readable after completion for the organization's
  retention period.

## Verbs

- [get](get/AGENTS.md): returns the operation with its status and result
- [list](list/AGENTS.md): returns operations, newest first
- [cancel](cancel/AGENTS.md): asks it to stop; status becomes cancelled when
  it does

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for operations; the worker that executes
them lives in apps/worker and reports through these verbs.
