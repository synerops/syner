# get

Reads one store.

## Input

- `id`: the store, or
- `organizationId + name`: the pair.

## Output

The store.

## Rules

- Authorization: the principal needs `stores:read` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the store, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `store not found`
- `not authorized`
