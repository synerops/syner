# get

Reads one organization.

## Input

- `id or slug`: one is required.

## Output

The organization.

## Rules

- Authorization: the principal needs `organizations:read` on the organization,
  checked through
  [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the organization, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `organization not found`
- `not authorized`
