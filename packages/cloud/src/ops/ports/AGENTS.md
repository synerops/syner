# ports

Declares the interfaces ops requires from infrastructure. Interfaces only: no
implementation, no vendor type, no credential.

## Persistence

- `operations`: save, load, list by organization or resource with filters,
  update status, progress, result, error.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in ops receive implementations by injection from api or worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
