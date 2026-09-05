<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/storage/stores</h1>

<p align="center">
  <strong>External contract of `/storage/stores`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, POST. Path parameters: none.

## Below this route

- [`/storage/stores/:id`]([id]/README.md)

### GET /storage/stores

Returns stores, newest first, in pages.

**Request.** Headers: `Authorization: Bearer <token>`. Query: `organizationId`
required.; `appId` optional filter.; `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of stores.

```json
{
  "items": [
    {
      "id": "sto_1a2b",
      "organizationId": "org_3f9k",
      "appId": "app_7c3a",
      "name": "invoices",
      "status": "ready",
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z"
    }
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `stores:read` on the
organization, checked through
[permissions/authorize](../../../lib/permissions/README.md).

**Errors.** `404` organization not found, `403` not authorized.

**Use case.** `list.ts` in
[lib/storage/stores](../../../lib/storage/stores/README.md).

**From the SDK.**

```ts
const page = await syner.storage.stores.list({ organization: 'acme' })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/storage/stores?organizationId=org_3f9k"
```

### POST /storage/stores

Creates a named container. Provisioning may take a moment, so you get an
operation.

When ready, put [documents]([id]/documents/[key]/README.md) or
[files]([id]/files/[path]/README.md) into it.

**Request.** Headers: `Authorization: Bearer <token>`. Body:

- `organizationId`: the owner.
- `name`: unique in the organization.
- `appId`: optional.

**Response.** `202 Accepted`. An operation reference; its result is the store,
ready. The `Location` header will point to the operation once the operations
route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "storage/stores/create",
  "resource": {
    "kind": "store",
    "id": "sto_1a2b"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "provisioning"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `stores:create` on the
organization, or the app when given, checked through
[permissions/authorize](../../../lib/permissions/README.md). When the
principal is an agent acting under a delegation, the check applies to the
human's permissions, never to a wider set.

**Operation tracking.** Long-running. It returns an
[operation](../../../lib/operations/README.md) reference at once; the store
arrives through it.

**Errors.** `404` organization not found, `404` app not found, `403` not
authorized, `409` name taken.

**Use case.** `create.ts` in
[lib/storage/stores](../../../lib/storage/stores/README.md).

**From the SDK.**

```ts
const op = await syner.storage.stores.create({
  organization: 'acme',
  name: 'invoices',
  app: 'billing',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores -X POST \
  -F organizationId=org_3f9k \
  -F name=invoices \
  -F appId=app_7c3a
```
