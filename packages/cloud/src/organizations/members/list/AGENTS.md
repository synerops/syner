# list

Lists the members of an organization, paged.

## Input

- `organizationId`: the organization.
- `role, kind`: optional filters.
- `cursor, limit`: paging.

## Output

A page of memberships with the principal summary.

## Rules

- Authorization: the principal needs `members:read` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
