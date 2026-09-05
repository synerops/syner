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

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [create](create/README.md) | a member with storage rights, or an agent | provisions a store |
| [get](get/README.md) | anyone who can read it | returns the store |
| [list](list/README.md) | anyone who can read the organization | returns the organization's stores |
| [remove](remove/README.md) | a member with remove rights | removes the store and its contents |

## How it relates to the rest

[Documents](../documents/README.md) and [files](../files/README.md) live
inside a store. Provisioning and removal run as
[operations](../../ops/README.md).
