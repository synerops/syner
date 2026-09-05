# principals

Owns principals: the identities that can act, as represented by the cloud.

## Model (`principal.ts`)

- `id`: stable.
- `kind`: `human`, `agent`, `service`.
- `name`: display.
- `subject`: opaque reference from the authentication provider.
- `status`: `active`, `disabled`.
- `firstSeenAt, lastSeenAt`: timestamps.

## Rules

- Principals are created by the authentication layer, never by a verb here.
- `kind` never changes.
- A disabled principal is refused at authorization, whatever its permissions.

## Use cases

### `get.ts`

Reads one principal.

### `list.ts`

Lists the principals of an organization, paged.

## Exposure

Public location pending for `get`, `list`: see [api](../../../api/AGENTS.md).
Nothing under `api/` exists for it yet.
