# identity

Owns principals and delegations: who acts, and who acts for whom.

## Things

- [principals](principals/AGENTS.md): the humans, agents, and services that
  can act.
- [delegations](delegations/AGENTS.md): a human letting an agent act for them,
  with scope and expiry.

## Rules

- Identity represents; it never authenticates. The authentication provider is
  chosen in infrastructure.
- A principal's kind never changes.
- An agent acting under a delegation never exceeds the delegating human's
  permissions.

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for principals and delegations; an
authentication provider that resolves a request to a principal.
