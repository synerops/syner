# organizations

Owns organizations and their membership.

## Model (`organization.ts`)

- `id`: stable.
- `slug`: unique across the cloud.
- `name`: display name.
- `status`: `active`, `removed`.
- `createdBy, createdAt`: principal and timestamp.

## Rules

- An organization always has at least one owner.
- `slug` is unique across the cloud and never reused.
- An organization is not subordinate to an app; apps belong to it.
- Removing an organization removes every resource it owns; it is long-running
  and irreversible.

## Owns

- [members](members/AGENTS.md): who belongs to the organization and with what
  role.

## Use cases

### `create.ts`

Creates an organization with the acting human as owner.

- The creator is added as `owner` in the same request.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  organization, and the outcome.

### `get.ts`

Reads one organization.

### `list.ts`

Lists the organizations of the acting principal, paged.

### `remove.ts`

Removes an organization and all its resources.

- Only an `owner` holds this permission; it cannot be delegated to an agent.
- Resources are removed module by module; activity of the removal stays
  readable to former owners.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  organization, and the outcome.

## Ports (`ports.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `organizations`: save, load by id or slug, list by principal, update status.
- `members`: save, load by organization and principal, list by organization
  with filters, remove.

## Exposure

Public location pending for `create`, `get`, `list`, `remove`: see
[api](../../api/AGENTS.md). Nothing under `api/` exists for it yet.
