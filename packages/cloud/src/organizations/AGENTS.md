# organizations

Owns organizations and their membership.

## Schema (index)

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

## Verbs

- [create](create/AGENTS.md): creates the organization with the creator as
  owner
- [get](get/AGENTS.md): returns the organization
- [list](list/AGENTS.md): returns the organizations the principal belongs to
- [remove](remove/AGENTS.md): tears down everything the organization owns

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for organizations and members.
