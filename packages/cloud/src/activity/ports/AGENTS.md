# ports

Declares the interfaces activity requires from infrastructure. Interfaces
only: no implementation, no vendor type, no credential.

## Persistence

- `entries`: append; list by organization with filters on resource, actor,
  action, outcome, and time; never update or delete inside retention.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in activity receive implementations by injection from api or
  worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
