# principals

Owns principals: the identities that can act, as represented by the cloud.

## Schema (index)

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

## Verbs

- [get](get/AGENTS.md): returns the principal
- [list](list/AGENTS.md): returns the principals of an organization
