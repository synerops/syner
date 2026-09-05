<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">organizations</h1>

<p align="center">
  <strong>The owner of everything: apps, stores, jobs, connections, and the people and agents that use them.</strong>
</p>

An organization is the customer. Every resource in the cloud belongs to one,
and every principal acts inside one. Membership says who belongs and with what
role; permissions say what each one may do.

## What an organization looks like

- **Name and slug.** the display name and the unique handle.
- **Members.** principals with a role: owner, admin, member, viewer.
- **Status.** active or removed.
- **Created by, at.** who and when.

## What it owns

- [members](members/README.md): who belongs to the organization and with what
  role.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Create an organization. |
| `get.ts` | Read one organization. |
| `list.ts` | List the organizations you belong to. |
| `remove.ts` | Remove an organization and everything it owns. |

## Exposure

Public location pending for `create`, `get`, `list`, `remove`: see
[api](../../api/README.md). Nothing under `api/` exists for it yet.

## What it needs from infrastructure

- **organizations.** save, load by id or slug, list by principal, update
  status.
- **members.** save, load by organization and principal, list by organization
  with filters, remove.

## How it relates to the rest

Every module reads the organization to know the owner.
[Identity](../identity/README.md) says who a member is;
[permissions](../permissions/README.md) turn roles into what each member may
do. [Usage](../usage/README.md) and [budgets](../usage/budgets/README.md) are
per organization.
