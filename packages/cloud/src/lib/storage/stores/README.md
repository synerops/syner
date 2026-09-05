<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">stores</h1>

<p align="center">
  <strong>A named container for documents and files.</strong>
</p>

A store is the unit you create, grant, and remove. It has a name inside the
organization and, when it belongs to an app, follows that app's permissions.
Everything inside it is addressed relative to the store.

## What a store looks like

- **Name.** unique in the organization.
- **Organization.** the owner.
- **App.** optional: the app it belongs to.
- **Status.** pending, ready, or removed.
- **Created by, at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `create.ts` | Provision a store. |
| `get.ts` | Read one store. |
| `list.ts` | List the stores of an organization. |
| `remove.ts` | Remove a store and everything in it. |

## Exposure

Exposed through `POST /storage/stores`, `GET /storage/stores/:id`, `GET
/storage/stores`, `DELETE /storage/stores/:id`. Contracts:
[/storage/stores](../../../api/storage/stores/README.md),
[/storage/stores/:id](../../../api/storage/stores/[id]/README.md).

## How it relates to the rest

[Documents](../documents/README.md) and [files](../files/README.md) live
inside a store. Provisioning and removal run as
[operations](../../operations/README.md).
