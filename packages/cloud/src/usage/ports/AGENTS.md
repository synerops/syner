# ports

Declares the interfaces usage requires from infrastructure. Interfaces only:
no implementation, no vendor type, no credential.

## Persistence

- `records`: append, aggregate by metric, app, principal, and time window;
  fast enough for per-call budget checks.
- `budgets`: save, load by scope, list by organization.

## Providers

- `pricing`: map a metric and quantity to cost in a currency; report whether
  pricing is configured.

## Rules

- Every interface is implemented in
  [infrastructure](../../../../infrastructure/AGENTS.md), never here.
- Use cases in usage receive implementations by injection from api or worker.
- Interfaces speak in the module's own schema types; they never expose rows,
  documents, or vendor objects.
- A method that can take long returns quickly with a handle the caller can
  follow; blocking belongs to the caller.
