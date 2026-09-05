# files

Owns files: byte blobs under a path inside a store.

## Model (`file.ts`)

- `storeId`: the store.
- `path`: unique in the store.
- `contentType`: MIME type.
- `size`: bytes.
- `etag`: opaque, changes on write.
- `updatedBy, updatedAt`: principal and timestamp.

## Rules

- Put replaces the whole file.
- Get returns a read handle or a short-lived URL, never the bytes inline.
- Paths are case-sensitive and use `/` as separator.

## Use cases

### `put.ts`

Writes a file whole under a path.

- Metered as bytes written in [usage](../../usage/AGENTS.md).

### `get.ts`

Reads one file's metadata and a handle to its bytes.

### `list.ts`

Lists files of a store by prefix, paged.

### `remove.ts`

Deletes one file.

## Exposure

Exposed through `PUT /storage/stores/:id/files/:path`, `GET
/storage/stores/:id/files/:path`, `GET /storage/stores/:id/files`, `DELETE
/storage/stores/:id/files/:path`. Contracts:
[/storage/stores/:id/files](../../../api/storage/stores/[id]/files/AGENTS.md),
[/storage/stores/:id/files/:path](../../../api/storage/stores/[id]/files/[path]/AGENTS.md).
