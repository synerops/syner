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

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [grant](grant/README.md) | an owner or admin of the resource's organization | adds an explicit permission |
| [revoke](revoke/README.md) | an owner or admin | removes an explicit permission |
| [list](list/README.md) | an admin, or the principal about themselves | returns permissions by principal or by resource |
| [authorize](authorize/README.md) | every use case, on every call | answers allowed or denied, with a reason |

## How it relates to the rest

Roles in [members](../organizations/members/README.md) imply permissions.
[Delegations](../identity/delegations/README.md) narrow them for agents.
Denials and grants appear in [activity](../activity/README.md). This is the
control behind "who has access?" in Syner OS.
