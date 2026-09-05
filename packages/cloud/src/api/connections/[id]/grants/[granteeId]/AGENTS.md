# /connections/:id/grants/:granteeId

Route marked by `index.ts`. Params: `id`, `granteeId`. Each operation
validates its input, resolves the acting principal from the bearer token, and
calls one use case in
[lib/connections](../../../../../lib/connections/AGENTS.md).

## Operations

### DELETE

- `DELETE /connections/:id/grants/:granteeId` calls `revoke.ts` in
  [lib/connections](../../../../../lib/connections/AGENTS.md).
- Path to arguments: `:id` is passed as `id`; `:granteeId` is passed as `appId
  or principalId`.
- Input: `id` the connection.; `appId or principalId` exactly one.
- Success: `204`. The connection with its remaining grants.
- Authorization: the principal needs `connections:revoke` on the connection,
  checked through
  [permissions/authorize](../../../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns the connection, not an
  [operation](../../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` connection not found, `403` not authorized.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
