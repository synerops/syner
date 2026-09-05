<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">/storage/stores/:id/files</h1>

<p align="center">
  <strong>External contract of `/storage/stores/:id/files`.</strong>
</p>

Route marked by `index.ts`, the provisional marker of the scaffold. Methods:
GET. Path parameters: `:id`.

## Below this route

- [`/storage/stores/:id/files/:path`]([path]/README.md)

### GET /storage/stores/:id/files

Walks the paths of a store, optionally under a prefix, in pages.

**Request.** Path: `:id` becomes `storeId`. Headers: `Authorization: Bearer
<token>`. Query: `prefix` optional.; `cursor, limit` paging. No body.

**Response.** `200 OK`. A page of file metadata.

```json
{
  "items": [
    {
      "storeId": "sto_1a2b",
      "path": "pdf/inv-1042.pdf",
      "contentType": "application/pdf",
      "size": 48213,
      "etag": "9f3c…",
      "updatedBy": "prn_bot",
      "updatedAt": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```

**Authorization.** Authorization: the principal needs `files:read` on the
store, checked through
[permissions/authorize](../../../../../lib/permissions/README.md).

**Errors.** `404` store not found, `403` not authorized.

**Use case.** `list.ts` in
[lib/storage/files](../../../../../lib/storage/files/README.md).

**From the SDK.**

```ts
const page = await syner.storage.files.list({
  store: 'invoices',
  prefix: 'pdf/',
})
```

**Raw, from the CLI.** Flags follow `vercel api` and are a proposal: `-X`
selects the method (GET by default), `-F` adds a field, `--input` reads a body
from a file or `-` for stdin, `-H` adds a header.

```bash
syner api "/storage/stores/sto_1a2b/files?prefix=pdf/"
```
