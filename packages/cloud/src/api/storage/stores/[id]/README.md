<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/storage/stores/:id</h1>

<p align="center">
  <strong>External contract of `/storage/stores/:id`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET, DELETE. Path parameters: `:id`.

## Below this route

- [`/storage/stores/:id/documents`](documents/README.md)
- [`/storage/stores/:id/files`](files/README.md)

### GET /storage/stores/:id

Returns a store by id, or by organization and name.

List its contents with [documents/list](documents/README.md) or
[files/list](files/README.md).

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `200 OK`. The store.

```json
{
  "id": "sto_1a2b",
  "organizationId": "org_3f9k",
  "appId": "app_7c3a",
  "name": "invoices",
  "status": "ready",
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```

**Authorization.** Authorization: the principal needs `stores:read` on the
store, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `403` not authorized.

**Use case.** `get.ts` in
[lib/storage/stores](../../../../lib/storage/stores/README.md).

**From the SDK.**

```ts
const store = await syner.storage.stores.get({
  organization: 'acme',
  name: 'invoices',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b
```

### DELETE /storage/stores/:id

Deletes the documents and files, then the store. Long-running.

**Request.** Path: `:id` becomes `id`. Headers: `Authorization: Bearer
<token>`. No body.

**Response.** `202 Accepted`. An operation reference; its result is the
removed store. The `Location` header will point to the operation once the
operations route is agreed.

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "storage/stores/remove",
  "resource": {
    "kind": "store",
    "id": "sto_1a2b"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 3,
    "message": "removing contents"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```

**Authorization.** Authorization: the principal needs `stores:remove` on the
store, checked through
[permissions/authorize](../../../../lib/permissions/README.md).

**Operation tracking.** Long-running. It returns an
[operation](../../../../lib/operations/README.md) reference at once; the
removed store arrives through it.

**Errors.** `404` store not found, `403` not authorized, `409` removal in
progress.

**Use case.** `remove.ts` in
[lib/storage/stores](../../../../lib/storage/stores/README.md).

**From the SDK.**

```ts
const op = await syner.storage.stores.remove({ id })
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b -X DELETE
```
