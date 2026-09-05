# permissions

Owns explicit permissions and the single authorization check every use case
calls.

## Schema (index)

- `principalId`: who.
- `action`: `<module>:<verb>` or `<thing>:<verb>` names, as used in every
  verb's contract.
- `resource`: `kind` and `id`; `kind` is `organization`, `app`, `store`,
  `connection`, `job`, `environment`.
- `source`: `role:<name>` or `grant`.
- `grantedBy, grantedAt`: principal and timestamp.

## Rules

- Deny by default: an action with no matching permission is refused.
- Permissions on an organization apply to every resource inside it;
  permissions on a resource apply to it and what it owns.
- Role permissions are derived, never stored as grants; removing the role
  removes them.
- authorize is the only path to a decision; no use case reads permissions
  directly.

## Verbs

- [grant](grant/AGENTS.md): adds an explicit permission
- [revoke](revoke/AGENTS.md): removes an explicit permission
- [list](list/AGENTS.md): returns permissions by principal or by resource
- [authorize](authorize/AGENTS.md): answers allowed or denied, with a reason

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for explicit grants; role bundles are
defined here, not persisted.
