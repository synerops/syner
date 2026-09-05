# put

Creates or replaces a document whole.

## Input

- `storeId`: the store.
- `key`: required.
- `body`: JSON.
- `ifVersion`: optional condition.

## Output

The document's key and new version.

## Rules

- Authorization: the principal needs `documents:write` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- With `ifVersion`, the write happens only if the current version matches.
- Metered as a write in [usage](../../../usage/record/AGENTS.md).
- Runs in-request. It returns the key and version, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`store not found`, `not authorized`, `version mismatch`, `body too large`.
