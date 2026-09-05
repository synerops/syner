# list

Lists operations by organization or resource, paged.

## Input

- `organizationId or resource`: one is required.
- `status, kind, since`: optional filters.
- `cursor, limit`: paging.

## Output

A page of operations.

## Rules

- Authorization: the principal needs `ops:read` on the organization or the
  resource, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `resource not found`, `not authorized`.
