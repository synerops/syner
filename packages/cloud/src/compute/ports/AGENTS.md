# ports

Declares the interfaces compute requires from infrastructure. Interfaces only:
no implementation, no vendor type, no credential.

## Persistence

- `environments`: save, load, list by organization and status, update status.
- `executions`: save, load, list by environment or organization and status,
  update status and result.

## Providers

- `runtime`: allocate an environment with a runtime and resources; run a
  command in it and capture its output; stop a command; release the
  environment.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in compute receive implementations by injection from api or
  worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
