# list

Lists the environments of an organization, paged.

## Input

- `organizationId`: required.
- `status`: optional filter.
- `cursor, limit`: paging.

## Output

A page of environments.

## Rules

- Authorization: the principal needs `environments:read` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
