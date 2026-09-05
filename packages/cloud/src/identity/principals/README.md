<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">principals</h1>

<p align="center">
  <strong>A human, an agent, or a service that can act.</strong>
</p>

A principal is anyone who can make a call. Humans sign in; agents act under
delegation; services act with their own credentials. Principals are created by
the authentication layer when someone first appears, which is why this thing
has no create verb: you read principals, you don't make them here.

## What a principal looks like

- **Kind.** human, agent, or service.
- **Name.** how it is shown.
- **Subject.** the reference the authentication provider knows it by.
- **Status.** active or disabled.
- **Seen first, last.** when.

## What you can do with it

| Verb | Who | What happens |
|---|---|---|
| [get](get/README.md) | a member of a shared organization | returns the principal |
| [list](list/README.md) | a member | returns the principals of an organization |

## How it relates to the rest

A principal joins an organization as a
[member](../../organizations/members/README.md). An agent principal acts
through a [delegation](../delegations/README.md).
