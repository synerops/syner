# list

Lists the connections of an organization, paged.

## Input

- `organizationId`: required.
- `service`: optional filter.
- `cursor, limit`: paging.

## Output

A page of connections.

## Rules

- Authorization: the principal needs `connections:read` on the organization,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
