# get

Reads the purpose of an app with its latest evaluation.

## Input

- `appId`: the app.
- `history`: optional; include all evaluations.

## Output

The purpose. `evaluations` holds the latest one, or all of them when `history`
is set.

## Rules

- Authorization: the principal needs `purpose:read` on the app, checked
  through [permissions/authorize](../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the purpose, not an
  [operation](../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

`app not found`, `purpose not declared`, `not authorized`.
