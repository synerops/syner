# list

Lists activity entries of an organization, paged.

## Input

- `organizationId`: required.
- `resource, actor, action, outcome, since, until`: optional filters.
- `cursor, limit`: paging.

## Output

A page of entries.

## Rules

- Authorization: the principal needs `activity:read` on the organization, or
  the resource when given, checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `resource not found`, `not authorized`.
