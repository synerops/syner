<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove an organization and everything it owns.</strong>
</p>

Tears down apps, stores, jobs, connections, and memberships. Irreversible.

## Example

```ts
const op = await syner.organizations.remove({ id })
```

In the CLI: `syner organizations remove acme`.

## What happens next

Follow the operation. The slug is never reused.
