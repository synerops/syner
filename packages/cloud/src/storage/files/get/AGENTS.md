# get

Reads one file's metadata and a handle to its bytes.

## Input

- `storeId`: the store.
- `path`: required.

## Output

The file's metadata and a read handle or short-lived URL.

## Rules

- Authorization: the principal needs `files:read` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the metadata and handle, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `store not found`
- `file not found`
- `not authorized`
