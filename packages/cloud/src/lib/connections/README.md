<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">connections</h1>

<p align="center">
  <strong>Configured access to an external service, with its secret kept on the server.</strong>
</p>

Apps and agents need third parties: a payment processor, a mail sender, a git
host. A connection is that access, configured once by the organization. It has
three separate parts: the connection itself, which is visible; its credential,
which is written once and never read back; and its grants, which say which
apps and principals may use it. Whoever uses a connection reaches the service
without ever seeing the secret.

## What a connection looks like

- **Name.** unique in the organization.
- **Service.** what it connects to: a named kind of service.
- **Config.** the non-secret settings: account, region, base URL.
- **Credential.** its status only: set or missing, and when it was last set.
- **Grants.** the apps and principals allowed to use it.
- **Created by, at.** who and when.

## What it owns

- [credentials](credentials/README.md): the secret material, write-only.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Register a connection to an external service. |
| `get.ts` | Read one connection. |
| `list.ts` | List the connections of an organization. |
| `remove.ts` | Remove a connection. |
| `grant.ts` | Let an app or a principal use a connection. |
| `revoke.ts` | Take a grant away. |

## Exposure

Exposed through `POST /connections`, `GET /connections/:id`, `GET
/connections`, `DELETE /connections/:id`, `POST /connections/:id/grants`,
`DELETE /connections/:id/grants/:granteeId`. Contracts:
[/connections](../../api/connections/README.md),
[/connections/:id](../../api/connections/[id]/README.md),
[/connections/:id/grants](../../api/connections/[id]/grants/README.md),
[/connections/:id/grants/:granteeId](../../api/connections/[id]/grants/[granteeId]/README.md).

## What it needs from infrastructure

- **connections.** save, load by id or by organization and name, list by
  organization and service, update grants and credential status.
- **secrets vault** (provider). store secret material by reference, replace it
  atomically, hand it to the cloud only at the moment of use, destroy it.

## How it relates to the rest

An [app](../apps/README.md) uses a connection from its backend. An agent uses
one under a [delegation](../identity/delegations/README.md). Grants and
revocations show in [activity](../activity/README.md); the secret never does.
Calls through a connection are metered in [usage](../usage/README.md).
