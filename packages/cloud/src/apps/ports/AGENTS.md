# ports

Declares the interfaces apps requires from infrastructure. Interfaces only: no
implementation, no vendor type, no credential.

## Persistence

- `apps`: save, load by id or by organization and name, list by organization,
  mark removed.
- `versions`: save, load by app and number, list by app; append-only.
- `deployments`: save, load, list by app and status, update status.

## Providers

- `deployment target`: put a version into service at a target and report its
  URL; retire a deployment; report status.
- `artifacts`: store a version's captured code and hand it back to the
  deployment target.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in apps receive implementations by injection from api or worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
