# put

Writes a file whole under a path.

## Input

- `storeId`: the store.
- `path`: required.
- `body`: a stream or bytes.
- `contentType`: required.

## Output

The file's metadata with its new etag.

## Rules

- Authorization: the principal needs `files:write` on the store, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Metered as bytes written in [usage](../../../usage/record/AGENTS.md).
- Runs in-request. It returns the metadata; the upload itself streams within
  the request, not an [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`store not found`, `not authorized`, `file too large`.
