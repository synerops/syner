# ports

Declares the interfaces storage requires from infrastructure. Interfaces only:
no implementation, no vendor type, no credential.

## Persistence

- `stores`: save, load by id or by organization and name, list by organization
  and app, update status.

## Providers

- `document engine`: put, get, list by prefix, and remove keyed JSON bodies
  with a version per key.
- `file engine`: put a stream under a path, hand back a read handle, list by
  prefix, remove.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in storage receive implementations by injection from api or
  worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
