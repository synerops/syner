<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one delegation.</strong>
</p>

Returns the delegation with its status.

## From the SDK

```ts
const d = await syner.identity.delegations.get({ id })
```

## From the CLI

```bash
syner identity delegations get <id>
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api identity/delegations/get '{"id": "del_2m4n"}'
```

## Response

```json
{
  "id": "del_2m4n",
  "fromPrincipalId": "prn_ana",
  "toPrincipalId": "prn_bot",
  "scope": {
    "organizationId": "org_3f9k",
    "appId": "app_7c3a"
  },
  "limits": "all",
  "expiresAt": "2026-12-31T00:00:00Z",
  "status": "active",
  "createdAt": "2026-09-04T18:20:00Z",
  "revokedAt": null
}
```
