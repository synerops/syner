<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Delegate to an agent.</strong>
</p>

Let an agent act as you, in an organization or one app, until a date.

## From the SDK

```ts
await syner.identity.delegations.create({
  to: synerBotId,
  scope: {
    organization: 'acme',
    app: 'billing',
  },
  limits: 'all',
  expiresAt: '2026-12-31T00:00:00Z',
})
```

## From the CLI

```bash
syner identity delegations create \
  --to syner-bot --app billing --until 2026-12-31
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api identity/delegations/create '{
  "to": "prn_bot",
  "scope": {
    "organization": "acme",
    "app": "billing"
  },
  "limits": "all",
  "expiresAt": "2026-12-31T00:00:00Z"
}'
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
