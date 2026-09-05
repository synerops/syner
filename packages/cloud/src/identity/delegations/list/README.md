<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List delegations in an organization.</strong>
</p>

Returns delegations, filtered by human, agent, or status, in pages.

## From the SDK

```ts
const page = await syner.identity.delegations.list({
  organization: 'acme',
  status: 'active',
})
```

## From the CLI

```bash
syner identity delegations list --status active
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api identity/delegations/list '{
  "organization": "acme",
  "status": "active"
}'
```

## Response

```json
{
  "items": [
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
  ],
  "next": null
}
```
