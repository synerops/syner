# /compute/executions

Route marked by `index.ts`. Params: none. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/compute/executions](../../../lib/compute/executions/AGENTS.md).

## Operations

### GET

- `GET /compute/executions` calls `list.ts` in
  [lib/compute/executions](../../../lib/compute/executions/AGENTS.md).
- Input: `environmentId or organizationId` one is required.; `status` optional
  filter.; `cursor, limit` paging.
- Success: `200`. A page of executions.
- Authorization: the principal needs `executions:read` on the environment or
  the organization, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` environment not found, `404` organization not found, `403` not
  authorized.

### POST

- `POST /compute/executions` calls `start.ts` in
  [lib/compute/executions](../../../lib/compute/executions/AGENTS.md).
- Input: `environmentId` optional; when absent an ephemeral environment is
  allocated.; `command` required.; `input` optional.; `runtime, resources`
  used only when allocating implicitly.
- Success: `201`. The execution with status `queued` or `running`.
- Authorization: the principal needs `executions:start` on the environment, or
  the organization when allocating, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Returns the execution itself, which carries its own status; no operation is
  created.
- The acting principal comes from the request context, never from the input.
- Errors: `404` environment not found, `409` environment stopped, `403` not
  authorized, `422` unknown runtime.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
