# list

Lists the organizations of the acting principal, paged.

## Input

- `cursor, limit`: paging.

## Output

A page of organizations.

## Rules

- Authorization: implicit; only organizations where the principal is a member
  are returned.
- Runs in-request. It returns a page, not an [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`not authorized`.
