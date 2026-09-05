# list

Lists executions by environment or organization, paged.

## Input

- `environmentId or organizationId`: one is required.
- `status`: optional filter.
- `cursor, limit`: paging.

## Output

A page of executions.

## Rules

- Authorization: the principal needs `executions:read` on the environment or
  the organization, checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`environment not found`, `organization not found`, `not authorized`.
