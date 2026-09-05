# list

Lists the principals of an organization, paged.

## Input

- `organizationId`: required.
- `kind, status`: optional filters.
- `cursor, limit`: paging.

## Output

A page of principals.

## Rules

- Authorization: the principal needs `principals:read` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
