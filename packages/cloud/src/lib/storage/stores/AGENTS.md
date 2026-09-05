# stores

Owns stores: named containers with an owner and a status.

## Model (`store.ts`)

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

## Use cases

### `create.ts`

Creates a store and drives it to ready.

- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the store, and the outcome.

### `get.ts`

Reads one store.

### `list.ts`

Lists the stores of an organization, paged.

### `remove.ts`

Removes a store with its contents.

- Contents are removed before the store; a partial failure leaves the store
  `pending` removal, never half-visible.
- Side effect: one [activity](../../activity/AGENTS.md) entry with the actor,
  the store, and the outcome.

## Exposure

Exposed through `POST /storage/stores`, `GET /storage/stores/:id`, `GET
/storage/stores`, `DELETE /storage/stores/:id`. Contracts:
[/storage/stores](../../../api/storage/stores/AGENTS.md),
[/storage/stores/:id](../../../api/storage/stores/[id]/AGENTS.md).
