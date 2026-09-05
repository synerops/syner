# list

Lists documents of a store by prefix, paged.

## Input

- `storeId`: the store.
- `prefix`: optional.
- `includeBodies`: optional; keys only by default.
- `cursor, limit`: paging.

## Output

A page of keys and versions, with bodies when requested.

## Rules

- Authorization: the principal needs `documents:read` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`store not found`, `not authorized`.
