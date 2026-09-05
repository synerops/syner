# get

Reads one delegation.

## Input

- `id`: the delegation.

## Output

The delegation.

## Rules

- Authorization: the human, the agent, or an admin of the scope's
  organization.
- Runs in-request. It returns the delegation, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `delegation not found`
- `not authorized`
