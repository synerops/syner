# ops

Owns operations: the status, progress, and outcome of every long-running
administration action.

## Model (`operation.ts`)

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

## Use cases

### `get.ts`

Reads one operation.

### `list.ts`

Lists operations by organization or resource, paged.

### `cancel.ts`

Requests cancellation of a pending or running operation.

- The creating verb defines what a safe stop means; an operation that cannot
  stop safely completes and says so.
- Cancelling a finished operation changes nothing.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  operation, and the outcome.

## Infrastructure (`infrastructure.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `operations`: save, load, list by organization or resource with filters,
  update status, progress, result, error.

## Exposure

Public location pending for `get`, `list`, `cancel`: see
[api](../../api/AGENTS.md). Nothing under `api/` exists for it yet.
