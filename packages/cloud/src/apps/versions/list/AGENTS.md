# list

Lists the versions of an app, paged.

## Input

- `appId`: the app.
- `cursor, limit`: paging.

## Output

A page of versions.

## Rules

- Authorization: the principal needs `versions:read` on the app, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`app not found`, `not authorized`.
