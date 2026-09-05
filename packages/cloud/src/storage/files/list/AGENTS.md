# list

Lists files of a store by prefix, paged.

## Input

- `storeId`: the store.
- `prefix`: optional.
- `cursor, limit`: paging.

## Output

A page of file metadata.

## Rules

- Authorization: the principal needs `files:read` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`store not found`, `not authorized`.
