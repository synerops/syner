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

## From the SDK

```ts
await syner.permissions.grant({
  principal: anaId,
  action: 'deployments:rollback',
  resource: {
    kind: 'app',
    id: appId,
  },
})
```

## From the CLI

```bash
syner permissions grant ana@acme.com deployments:rollback --app billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api permissions/grant '{
  "principal": "prn_ana",
  "action": "deployments:rollback",
  "resource": {
    "kind": "app",
    "id": "app_7c3a"
  }
}'
```

## Response

```json
{
  "principalId": "prn_ana",
  "action": "deployments:rollback",
  "resource": {
    "kind": "app",
    "id": "app_7c3a"
  },
  "source": "grant",
  "grantedBy": "prn_ana",
  "grantedAt": "2026-09-04T18:24:30Z"
}
```
