<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">revoke</h1>

<p align="center">
  <strong>Take an explicit permission away.</strong>
</p>

Removes a grant. Role-implied permissions are unaffected; change the role for
those.

## Example

```ts
await syner.permissions.revoke({ principal: anaId, action: 'deployments:rollback', resource: { kind: 'app', id: appId } })
```

In the CLI: `syner permissions revoke ana@acme.com deployments:rollback --app
billing`.

## What happens next

If the role still implies the action, authorize still says allowed.
