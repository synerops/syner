# list

Lists the apps of an organization, paged.

## Input

- `organizationId`: required.
- `cursor, limit`: paging; limit defaults to the cloud's page size.

## Output

A page: `items[]` and `next` (a cursor, or empty).

## Rules

- Authorization: the principal needs `apps:read` on the organization, checked
  through [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Apps the principal cannot read are omitted, never shown as errors.
- Runs in-request. It returns a page, not an [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`organization not found`, `not authorized`.
