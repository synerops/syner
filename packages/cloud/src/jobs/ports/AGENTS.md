# ports

Declares the interfaces jobs requires from infrastructure. Interfaces only: no
implementation, no vendor type, no credential.

## Persistence

- `jobs`: save, load by id or by organization and name, list by organization,
  app, and enabled, mark removed.
- `runs`: save, load, list by job with filters, append events, update status.

## Providers

- `scheduler`: register and unregister schedules and event subscriptions for a
  job; fire a run start when one triggers.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in jobs receive implementations by injection from api or worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
