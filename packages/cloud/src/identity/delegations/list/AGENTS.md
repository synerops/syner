# list

Lists delegations of an organization, paged.

## Input

- `organizationId`: required.
- `from, to, status`: optional filters.
- `cursor, limit`: paging.

## Output

A page of delegations.

## Rules

- Authorization: the principal needs `delegations:read` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `not authorized`.
