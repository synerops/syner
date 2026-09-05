# stores

Owns stores: named containers with an owner and a status.

## Schema (index)

- `id`: stable.
- `organizationId`: the owner.
- `appId`: optional.
- `name`: unique in the organization.
- `status`: `pending`, `ready`, `removed`.
- `createdBy, createdAt`: principal and timestamp.

## Rules

- `name` is unique in the organization.
- A store tied to an app is readable and writable by whoever can read and
  update that app.
- A removed store keeps its name reserved until its contents are gone, then
  releases it.

## Verbs

- [create](create/AGENTS.md): provisions a store
- [get](get/AGENTS.md): returns the store
- [list](list/AGENTS.md): returns the organization's stores
- [remove](remove/AGENTS.md): removes the store and its contents
