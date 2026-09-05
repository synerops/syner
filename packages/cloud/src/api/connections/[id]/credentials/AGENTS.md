# /connections/:id/credentials

Route marked by `index.ts`. Params: `id`. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/connections/credentials](../../../../lib/connections/credentials/AGENTS.md).

## Operations

### PUT

- `PUT /connections/:id/credentials` calls `set.ts` in
  [lib/connections/credentials](../../../../lib/connections/credentials/AGENTS.md).
- Path to arguments: `:id` is passed as `connectionId`.
- Input: `connectionId` the connection.; `material` the secret; shape defined
  by the service.
- Success: `200`. The credential status: `setAt` and `fingerprint`.
- Authorization: the principal needs `credentials:set` on the connection,
  checked through
  [permissions/authorize](../../../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Runs in-request. It returns the credential status, not an
  [operation](../../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` connection not found, `403` not authorized, `422` invalid
  material.

## Pending

- The credential is write-only; this route never returns material.
- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
