<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/storage/stores/:id/documents/:key</h1>

<p align="center">
  <strong>External contract of `/storage/stores/:id/documents/:key`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
PUT, GET, DELETE. Path parameters: `:id`, `:key`.

### PUT /storage/stores/:id/documents/:key

Writes a JSON body under a key. Same key, new version.

Read it back with [get](README.md).

**Request.** Path: `:id` becomes `storeId`, `:key` becomes `key`. Headers:
`Authorization: Bearer <token>`; `If-Match: <version>` for the conditional
write the contract calls `ifVersion`. Body:

- `body`: JSON.

**Response.** `201 Created` when the key or path is new, `200 OK` when it
replaces. The document's key and new version.

```json
{
  "key": "2026/03/inv-1042",
  "version": 4
}
```

**Authorization.** Authorization: the principal needs `documents:write` on the
store, checked through
[permissions/authorize](../../../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `403` not authorized, `409` version
mismatch, `413` body too large.

**Use case.** `put.ts` in
[lib/storage/documents](../../../../../../lib/storage/documents/README.md).

**From the SDK.**

```ts
await syner.storage.documents.put({
  store: 'invoices',
  key: '2026/03/inv-1042',
  body: { total: 120 },
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b/documents/2026/03/inv-1042 -X PUT --input - <<'JSON'
{
  "body": {
    "total": 120
  }
}
JSON
```

### GET /storage/stores/:id/documents/:key

Returns the body and version under a key.

**Request.** Path: `:id` becomes `storeId`, `:key` becomes `key`. Headers:
`Authorization: Bearer <token>`. No body.

**Response.** `200 OK`. The document.

```json
{
  "storeId": "sto_1a2b",
  "key": "2026/03/inv-1042",
  "body": {
    "total": 120
  },
  "version": 4,
  "updatedBy": "prn_bot",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `documents:read` on the
store, checked through
[permissions/authorize](../../../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `404` document not found, `403` not
authorized.

**Use case.** `get.ts` in
[lib/storage/documents](../../../../../../lib/storage/documents/README.md).

**From the SDK.**

```ts
const doc = await syner.storage.documents.get({
  store: 'invoices',
  key: '2026/03/inv-1042',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b/documents/2026/03/inv-1042
```

### DELETE /storage/stores/:id/documents/:key

Removes the key. Optionally conditional on version.

**Request.** Path: `:id` becomes `storeId`, `:key` becomes `key`. Headers:
`Authorization: Bearer <token>`; `If-Match: <version>` for the conditional
write the contract calls `ifVersion`. No body.

**Response.** `204 No Content`.

**Authorization.** Authorization: the principal needs `documents:write` on the
store, checked through
[permissions/authorize](../../../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `404` document not found, `403` not
authorized, `409` version mismatch.

**Use case.** `remove.ts` in
[lib/storage/documents](../../../../../../lib/storage/documents/README.md).

**From the SDK.**

```ts
await syner.storage.documents.remove({
  store: 'invoices',
  key: '2026/03/inv-1042',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b/documents/2026/03/inv-1042 -X DELETE
```

## Pending on this route

- Keys may contain `/`. How a multi-segment key is captured by `[key]` is
  pending.
