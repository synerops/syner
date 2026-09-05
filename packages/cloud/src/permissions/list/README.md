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

## From the SDK

```ts
const page = await syner.permissions.list({
  resource: {
    kind: 'app',
    id: appId,
  },
})
```

## From the CLI

```bash
syner permissions list --app billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api permissions/list '{"resource": {"kind": "app", "id": "app_7c3a"}}'
```

## Response

```json
{
  "items": [
    {
      "principalId": "prn_ana",
      "action": "deployments:rollback",
      "resource": {
        "kind": "app",
        "id": "app_7c3a"
      },
      "source": "role:admin",
      "grantedBy": "prn_ana",
      "grantedAt": "2026-09-04T18:20:00Z"
    }
  ],
  "next": null
}
```
