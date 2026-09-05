<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">delegations</h1>

<p align="center">
  <strong>A human letting an agent act for them, within a scope, until it expires.</strong>
</p>

When Syner Bot or any agent does something for you, it does it under a
delegation: your identity, your permissions, a scope you chose, and an expiry.
The delegation is what makes the action yours and bounded. Revoke it and the
agent stops at once.

## What a delegation looks like

- **From.** the human.
- **To.** the agent.
- **Scope.** an organization, or one app inside it.
- **Limits.** all of the human's permissions in the scope, or a named subset.
- **Expires.** when it ends on its own.
- **Status.** active, revoked, or expired.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Delegate to an agent. |
| `revoke.ts` | End a delegation now. |
| `get.ts` | Read one delegation. |
| `list.ts` | List delegations in an organization. |

## Exposure

Public location pending for `create`, `revoke`, `get`, `list`: see
[api](../../../api/README.md). Nothing under `api/` exists for it yet.

## How it relates to the rest

[permissions/authorize](../../permissions/README.md) applies the delegation on
every call the agent makes. Every action the agent takes appears in
[activity](../../activity/README.md) with the delegation chain.
[Connections](../../connections/README.md) granted to an agent require the
human to hold the grant too.
