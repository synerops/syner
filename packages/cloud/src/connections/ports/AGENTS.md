# ports

Declares the interfaces connections requires from infrastructure. Interfaces
only: no implementation, no vendor type, no credential.

## Persistence

- `connections`: save, load by id or by organization and name, list by
  organization and service, update grants and credential status.

## Providers

- `secrets vault`: store secret material by reference, replace it atomically,
  hand it to the cloud only at the moment of use, destroy it.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in connections receive implementations by injection from api or
  worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
