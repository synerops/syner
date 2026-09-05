# permissions

Owns explicit permissions and the single authorization check every use case
calls.

## Model (`permission.ts`)

- `principalId`: who.
- `action`: `<module>:<verb>` or `<thing>:<verb>` names, as used in every
  verb's contract.
- `resource`: `kind` and `id`; `kind` is `organization`, `app`, `environment`
  (an app's), `compute-environment`, `store`, `connection`, `job`.
- `source`: `role:<name>` or `grant`.
- `grantedBy, grantedAt`: principal and timestamp.

## Rules

- Deny by default: an action with no matching permission is refused.
- Permissions on an app apply to its environments; permissions on an
  environment apply to it and its deployments.
- Permissions on an organization apply to every resource inside it;
  permissions on a resource apply to it and what it owns.
- Role permissions are derived, never stored as grants; removing the role
  removes them.
- authorize is the only path to a decision; no use case reads permissions
  directly.

## Use cases

### `grant.ts`

Adds an explicit permission.

- A permission already implied by the principal's role is accepted and
  recorded as a grant anyway, so it survives a role change.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  principal, the action, and the resource, and the outcome.

### `revoke.ts`

Removes an explicit permission.

- Revoking a grant that does not exist changes nothing.
- Side effect: one [activity](../activity/AGENTS.md) entry with the actor, the
  principal, the action, and the resource, and the outcome.

### `list.ts`

Lists effective permissions, paged, by principal or by resource.

- Role-implied permissions are included and marked by source.

### `authorize.ts`

Answers allowed or denied for a principal, an action, and a resource.

- Deny by default.
- For a human: allowed if a role or a grant covers the action on the resource
  or on something that owns it.
- For an agent under delegation: allowed only if the human would be allowed,
  the resource is inside the delegation scope, the action is within its
  limits, and the delegation is active.
- For an agent without delegation: allowed only through the agent's own
  grants; never through a human's.
- A disabled principal is denied whatever else holds.
- Denials are recorded in [activity](../activity/AGENTS.md); allowed decisions
  are not, the action itself is.

## Infrastructure (`infrastructure.ts`)

Interfaces this module requires. Implemented in
[infrastructure](../../../../infrastructure/AGENTS.md), never here; injected
into use cases by api and worker; spoken in this module's own types.

Persistence:

- `grants`: save, load, list by principal or by resource, remove; read fast
  enough to run on every call.

## Exposure

Public location pending for `grant`, `revoke`, `list`, `authorize`: see
[api](../../api/AGENTS.md). Nothing under `api/` exists for it yet.
