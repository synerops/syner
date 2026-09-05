# documents

Owns documents: keyed JSON bodies inside a store, versioned on write.

## Schema (index)

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

## Verbs

- [put](put/AGENTS.md): creates or replaces the document
- [get](get/AGENTS.md): returns it
- [list](list/AGENTS.md): returns keys by prefix, with bodies on request
- [remove](remove/AGENTS.md): deletes it
