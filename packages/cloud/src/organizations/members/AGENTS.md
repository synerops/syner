# members

Owns membership: principal, role, and when it was granted.

## Schema (index)

- `organizationId`: the organization.
- `principalId`: the member.
- `role`: `owner`, `admin`, `member`, `viewer`.
- `addedBy, addedAt`: principal and timestamp.

## Rules

- The last owner cannot be removed or demoted.
- A principal holds one role per organization; adding again with another role
  replaces it.
- Removing a member revokes the permissions and delegations tied to that
  membership.

## Verbs

- [add](add/AGENTS.md): adds a principal with a role
- [remove](remove/AGENTS.md): removes a principal from the organization
- [list](list/AGENTS.md): returns the members with their roles
