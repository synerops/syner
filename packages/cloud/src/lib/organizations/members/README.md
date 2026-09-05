<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">members</h1>

<p align="center">
  <strong>Who belongs to an organization, and with what role.</strong>
</p>

A member is a principal, human or agent, with a role in the organization.
Roles are bundles of permissions: owner, admin, member, viewer. Adding a
member is how a person or an agent gets in; removing them is how they leave.
Fine-grained rights beyond the role come from
[permissions](../../permissions/README.md).

## What a member looks like

- **Principal.** who.
- **Role.** owner, admin, member, or viewer.
- **Added by, at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `add.ts` | Add a member. |
| `remove.ts` | Remove a member. |
| `list.ts` | List the members of an organization. |

## Exposure

Public location pending for `add`, `remove`, `list`: see
[api](../../../api/README.md). Nothing under `api/` exists for it yet.

## How it relates to the rest

Roles become permissions through [permissions](../../permissions/README.md).
An agent member usually acts under a
[delegation](../../identity/delegations/README.md) from a human member.
Changes show in [activity](../../activity/README.md).
