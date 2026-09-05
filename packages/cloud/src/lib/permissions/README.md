<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">permissions</h1>

<p align="center">
  <strong>Who may do what, on which resource.</strong>
</p>

A permission is a triple: a principal, an action, a resource. Roles from
membership grant bundles of them; grant adds single ones on top. Every use
case in the cloud asks the same question before acting, through authorize, so
every entry point behaves the same. When an agent acts under a delegation, the
question is asked about the human, then narrowed by the delegation's limits.

## What a permission looks like

- **Principal.** who.
- **Action.** a name like `apps:create` or `documents:read`.
- **Resource.** an organization, an app, a store, a connection, a job.
- **Source.** the role that implies it, or the explicit grant.
- **Granted by, at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `grant.ts` | Give a principal a permission on a resource. |
| `revoke.ts` | Take an explicit permission away. |
| `list.ts` | List permissions by principal or by resource. |
| `authorize.ts` | Decide whether a principal may perform an action on a resource. |

## Exposure

Public location pending for `grant`, `revoke`, `list`, `authorize`: see
[api](../../api/README.md). Nothing under `api/` exists for it yet.

## What it needs from infrastructure

- **grants.** save, load, list by principal or by resource, remove; read fast
  enough to run on every call.

## How it relates to the rest

Roles in [members](../organizations/members/README.md) imply permissions.
[Delegations](../identity/delegations/README.md) narrow them for agents.
Denials and grants appear in [activity](../activity/README.md). This is the
control behind "who has access?" in Syner OS.
