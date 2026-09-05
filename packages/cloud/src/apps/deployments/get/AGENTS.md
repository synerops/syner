# get

Reads one deployment of an app.

## Input

- `appId`: the app.
- `id`: the deployment.

## Output

The deployment.

## Rules

- Authorization: the principal needs `deployments:read` on the app, checked
  through [permissions/authorize](../../../permissions/authorize/AGENTS.md).
- Runs in-request. It returns the deployment, not an
  [operation](../../../ops/AGENTS.md).
- The acting principal comes from the request context, never from the input.

## Errors

- `app not found`
- `deployment not found`
- `not authorized`
