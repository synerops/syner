<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/storage/stores/:id/files/:path</h1>

<p align="center">
  <strong>External contract of `/storage/stores/:id/files/:path`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
PUT, GET, DELETE. Path parameters: `:id`, `:path`.

### PUT /storage/stores/:id/files/:path

Streams bytes to a path in a store.

**Request.** Path: `:id` becomes `storeId`, `:path` becomes `path`. Headers:
`Authorization: Bearer <token>`; `Content-Type`: the file's type. Body: the
file's bytes, streamed.

**Response.** `201 Created` when the key or path is new, `200 OK` when it
replaces. The file's metadata with its new etag.

```json
{
  "storeId": "sto_1a2b",
  "path": "pdf/inv-1042.pdf",
  "contentType": "application/pdf",
  "size": 48213,
  "etag": "9f3c…",
  "updatedBy": "prn_bot",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```

**Authorization.** Authorization: the principal needs `files:write` on the
store, checked through
[permissions/authorize](../../../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `403` not authorized, `413` file too large.

**Use case.** `put.ts` in
[lib/storage/files](../../../../../../lib/storage/files/README.md).

**From the SDK.**

```ts
await syner.storage.files.put({
  store: 'invoices',
  path: 'pdf/inv-1042.pdf',
  body: stream,
  contentType: 'application/pdf',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b/files/pdf/inv-1042.pdf -X PUT -H "Content-Type: application/pdf" --input ./inv-1042.pdf
```

### GET /storage/stores/:id/files/:path

Returns metadata and a read handle for the bytes.

**Request.** Path: `:id` becomes `storeId`, `:path` becomes `path`. Headers:
`Authorization: Bearer <token>`. No body.

**Response.** `200 OK`. The file's metadata and a read handle or short-lived
URL.

```json
{
  "storeId": "sto_1a2b",
  "path": "pdf/inv-1042.pdf",
  "contentType": "application/pdf",
  "size": 48213,
  "etag": "9f3c…",
  "updatedBy": "prn_bot",
  "updatedAt": "2026-09-04T18:24:30Z",
  "read": {
    "url": "https://files.syner.app/…",
    "expiresAt": "2026-09-04T18:35:00Z"
  }
}
```

**Authorization.** Authorization: the principal needs `files:read` on the
store, checked through
[permissions/authorize](../../../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `404` file not found, `403` not authorized.

**Use case.** `get.ts` in
[lib/storage/files](../../../../../../lib/storage/files/README.md).

**From the SDK.**

```ts
const file = await syner.storage.files.get({
  store: 'invoices',
  path: 'pdf/inv-1042.pdf',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b/files/pdf/inv-1042.pdf
```

### DELETE /storage/stores/:id/files/:path

Removes the path from the store.

**Request.** Path: `:id` becomes `storeId`, `:path` becomes `path`. Headers:
`Authorization: Bearer <token>`. No body.

**Response.** `204 No Content`.

**Authorization.** Authorization: the principal needs `files:write` on the
store, checked through
[permissions/authorize](../../../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `404` file not found, `403` not authorized.

**Use case.** `remove.ts` in
[lib/storage/files](../../../../../../lib/storage/files/README.md).

**From the SDK.**

```ts
await syner.storage.files.remove({
  store: 'invoices',
  path: 'pdf/inv-1042.pdf',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api /storage/stores/sto_1a2b/files/pdf/inv-1042.pdf -X DELETE
```

## Pending on this route

- Paths contain `/`. How a multi-segment path is captured by `[path]` is
  pending.
- The PUT body is the file's bytes, streamed; the GET response carries
  metadata and a read handle. Streaming mechanics are pending.
