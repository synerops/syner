# lib

Where the business is modeled and decided. Nothing here is a route.

## Shape of a module

- A noun file holds the model: schema and types (`app.ts`, `run.ts`).
- A verb file holds one use case (`create.ts`, `select.ts`). It receives
  what it needs from infrastructure by injection from `apps/api` or
  `jobs/worker`.
- `infrastructure.ts` is the module's list of what it asks infrastructure
  for: how its things are persisted and which outside capabilities it
  calls. Interfaces only. Implemented in `packages/infrastructure`, never
  here.
- A subfolder is a thing the module owns with its own lifecycle. It has the
  same shape.
- Not every technical file needs a folder. The structure inside a module
  varies with what it must communicate.

## Rules that hold in every use case

- Authorization through [permissions](permissions/AGENTS.md), deny by
  default. The acting principal comes from the request context.
- Every mutation appends an entry in [activity](activity/AGENTS.md).
- Work that outlives a request returns a reference from
  [operations](operations/AGENTS.md). An execution and a job run carry their
  own status and are never operations.
- Consumption is recorded in [usage](usage/AGENTS.md) by the use case that
  caused it.
- Modules call each other through models and use cases, never through
  `api/`.

## Exposure

Each module's AGENTS.md says which routes in [api](../api/AGENTS.md) call its
use cases, which use cases are internal, and which have no public location
yet.
