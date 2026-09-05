# list

Lists effective permissions, paged, by principal or by resource.

## Input

- `principalId or resource`: one is required.
- `cursor, limit`: paging.

## Output

A page of permissions with their source.

## Rules

- Authorization: `permissions:read` on the organization, or the principal
  asking about themselves.
- Role-implied permissions are included and marked by source.
- Runs in-request. It returns a page, not an [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`principal not found`, `resource not found`, `not authorized`.
