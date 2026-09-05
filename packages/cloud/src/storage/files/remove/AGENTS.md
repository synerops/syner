# remove

Deletes one file.

## Input

- `storeId`: the store.
- `path`: required.

## Output

Nothing but confirmation.

## Rules

- Authorization: the principal needs `files:write` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns confirmation, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `store not found`
- `file not found`
- `not authorized`
