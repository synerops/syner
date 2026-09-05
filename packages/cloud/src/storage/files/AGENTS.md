# files

Owns files: byte blobs under a path inside a store.

## Schema (index)

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

## Verbs

- [put](put/AGENTS.md): uploads or replaces the file
- [get](get/AGENTS.md): returns metadata and a way to read the bytes
- [list](list/AGENTS.md): returns paths by prefix
- [remove](remove/AGENTS.md): deletes it
