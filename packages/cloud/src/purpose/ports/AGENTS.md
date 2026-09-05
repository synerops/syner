# ports

Declares the interfaces purpose requires from infrastructure. Interfaces only:
no implementation, no vendor type, no credential.

## Persistence

- `purposes`: save, load by app, append evaluations, list evaluations by app.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in purpose receive implementations by injection from api or
  worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
