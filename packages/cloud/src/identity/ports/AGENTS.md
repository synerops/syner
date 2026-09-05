# ports

Declares the interfaces identity requires from infrastructure. Interfaces
only: no implementation, no vendor type, no credential.

## Persistence

- `principals`: save, load by id or subject, list by organization with
  filters, update status.
- `delegations`: save, load, list by organization with filters, update status,
  expire by time.

## Providers

- `authentication`: resolve a request's proof of identity to a subject; create
  the principal on first sight.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in identity receive implementations by injection from api or
  worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
