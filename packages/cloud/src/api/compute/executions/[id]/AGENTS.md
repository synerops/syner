# /compute/executions/:id

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/compute/executions](../../../../lib/compute/executions/AGENTS.md).

## Operations

### GET

- `GET /compute/executions/:id` calls `get.ts` in
  [lib/compute/executions](../../../../lib/compute/executions/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the execution.
- Success: `200`. The execution.
- Authorization: the principal needs `executions:read` on the execution,
  checked through
  [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the execution, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` execution not found, `403` not authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
