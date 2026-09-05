<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List permissions by principal or by resource.</strong>
</p>

Answers who can do what on a resource, or what a principal can do.

## Example

```ts
const page = await syner.permissions.list({ resource: { kind: 'app', id: appId } })
```

In the CLI: `syner permissions list --app billing`.

## What happens next

Each item says whether it comes from a role or a grant.
