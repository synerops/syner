# /connections/:id

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/connections](../../../lib/connections/AGENTS.md).

## Operations

### GET

- `GET /connections/:id` calls `get.ts` in
  [lib/connections](../../../lib/connections/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the connection, or; `organizationId + name` the pair.
- Success: `200`. The connection.
- Authorization: the principal needs `connections:read` on the connection,
  checked through [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the connection, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` connection not found, `403` not authorized.

### DELETE

- `DELETE /connections/:id` calls `remove.ts` in
  [lib/connections](../../../lib/connections/AGENTS.md).
- Path to arguments: `:id` is passed as `id`.
- Input: `id` the connection.
- Success: `204`. Nothing but confirmation.
- Authorization: the principal needs `connections:remove` on the connection,
  checked through [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns confirmation, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` connection not found, `403` not authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
