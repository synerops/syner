<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">grant</h1>

<p align="center">
  <strong>Give a principal a permission on a resource.</strong>
</p>

Adds one explicit permission on top of what the role already implies.

## Example

```ts
await syner.permissions.grant({ principal: anaId, action: 'deployments:rollback', resource: { kind: 'app', id: appId } })
```

In the CLI: `syner permissions grant ana@acme.com deployments:rollback --app
billing`.

## What happens next

The next authorize for that triple says allowed.
