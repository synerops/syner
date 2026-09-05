<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one organization.</strong>
</p>

Returns the organization and a count of its members.

## Example

```ts
const org = await syner.organizations.get({ slug: 'acme' })
```

In the CLI: `syner organizations get acme`.

## What happens next

List who belongs with [members/list](../members/list/README.md).
