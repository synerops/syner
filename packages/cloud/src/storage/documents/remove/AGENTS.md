# remove

Deletes one document.

## Input

- `storeId`: the store.
- `key`: required.
- `ifVersion`: optional condition.

## Output

Nothing but confirmation.

## Rules

- Authorization: the principal needs `documents:write` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns confirmation, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`store not found`, `document not found`, `not authorized`, `version mismatch`.
