# documents

Owns documents: keyed JSON bodies inside a store, versioned on write.

## Model (`document.ts`)

- `storeId`: the store.
- `key`: unique in the store; path-like keys are allowed.
- `body`: JSON.
- `version`: integer, strictly increasing per key.
- `updatedBy, updatedAt`: principal and timestamp.

## Rules

- Put replaces the whole body; there is no partial update.
- An optional `ifVersion` on put and remove makes the write conditional; a
  mismatch is rejected.
- Keys are case-sensitive.

## Use cases

### `put.ts`

Creates or replaces a document whole.

- With `ifVersion`, the write happens only if the current version matches.
- Metered as a write in [usage](../../usage/AGENTS.md).

### `get.ts`

Reads one document.

### `list.ts`

Lists documents of a store by prefix, paged.

### `remove.ts`

Deletes one document.

## Exposure

Exposed through `PUT /storage/stores/:id/documents/:key`, `GET
/storage/stores/:id/documents/:key`, `GET /storage/stores/:id/documents`,
`DELETE /storage/stores/:id/documents/:key`. Contracts:
[/storage/stores/:id/documents](../../../api/storage/stores/[id]/documents/AGENTS.md),
[/storage/stores/:id/documents/:key](../../../api/storage/stores/[id]/documents/[key]/AGENTS.md).
