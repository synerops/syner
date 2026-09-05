# ports

Declares the interfaces organizations requires from infrastructure. Interfaces
only: no implementation, no vendor type, no credential.

## Persistence

- `organizations`: save, load by id or slug, list by principal, update status.
- `members`: save, load by organization and principal, list by organization
  with filters, remove.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in organizations receive implementations by injection from api or
  worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
