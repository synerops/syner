# /connections

Route marked by `index.ts`. Params: none. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/connections](../../lib/connections/AGENTS.md).

## Operations

### GET

- `GET /connections` calls `list.ts` in
  [lib/connections](../../lib/connections/AGENTS.md).
- Input: `organizationId` required.; `service` optional filter.; `cursor,
  limit` paging.
- Success: `200`. A page of connections.
- Authorization: the principal needs `connections:read` on the organization,
  checked through [permissions/authorize](../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized.

### POST

- `POST /connections` calls `create.ts` in
  [lib/connections](../../lib/connections/AGENTS.md).
- Input: `organizationId` the owner.; `name` unique in the organization.;
  `service` a named kind.; `config` non-secret settings.
- Success: `201`. The connection with `credentialSetAt` empty and no grants.
- Authorization: the principal needs `connections:create` on the organization,
  checked through [permissions/authorize](../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Runs in-request. It returns the connection, not an
  [operation](../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized, `409` name
  taken, `422` unknown service, `422` secret in config.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
