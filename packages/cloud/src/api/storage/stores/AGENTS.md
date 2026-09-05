# /storage/stores

Route marked by `index.ts`. Params: none. Each operation validates its input,
resolves the acting principal from the bearer token, and calls one use case in
[lib/storage/stores](../../../lib/storage/stores/AGENTS.md).

## Operations

### GET

- `GET /storage/stores` calls `list.ts` in
  [lib/storage/stores](../../../lib/storage/stores/AGENTS.md).
- Input: `organizationId` required.; `appId` optional filter.; `cursor, limit`
  paging.
- Success: `200`. A page of stores.
- Authorization: the principal needs `stores:read` on the organization,
  checked through [permissions/authorize](../../../lib/permissions/AGENTS.md).
- Runs in-request. It returns a page, not an
  [operation](../../../lib/operations/AGENTS.md).
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `403` not authorized.

### POST

- `POST /storage/stores` calls `create.ts` in
  [lib/storage/stores](../../../lib/storage/stores/AGENTS.md).
- Input: `organizationId` the owner.; `name` unique in the organization.;
  `appId` optional.
- Success: `202`. An operation reference; its result is the store, ready.
- Authorization: the principal needs `stores:create` on the organization, or
  the app when given, checked through
  [permissions/authorize](../../../lib/permissions/AGENTS.md).
- When the principal is an agent acting under a delegation, the check applies
  to the human's permissions, never to a wider set.
- Long-running. It returns an [operation](../../../lib/operations/AGENTS.md)
  reference at once; the store arrives through it.
- The acting principal comes from the request context, never from the input.
- Errors: `404` organization not found, `404` app not found, `403` not
  authorized, `409` name taken.

## Pending

- Name and signature of the handler exports; `index.ts` is a marker until
  then.
- Discovery, loading, and validation of routes.
- How the organization context travels (query, header, or path prefix); until
  agreed it is an explicit field.
- Publication or generation of schemas and SDK.
