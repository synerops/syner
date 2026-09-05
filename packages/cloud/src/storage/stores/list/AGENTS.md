# list

Lists the stores of an organization, paged.

## Input

- `organizationId`: required.
- `appId`: optional filter.
- `cursor, limit`: paging.

## Output

A page of stores.

## Rules

- Authorization: the principal needs `stores:read` on the organization,
  checked through
  [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
