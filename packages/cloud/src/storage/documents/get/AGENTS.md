# get

Reads one document.

## Input

- `storeId`: the store.
- `key`: required.

## Output

The document.

## Rules

- Authorization: the principal needs `documents:read` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the document, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `store not found`
- `document not found`
- `not authorized`
