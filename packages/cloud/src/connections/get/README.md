<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one connection.</strong>
</p>

Returns the connection: config, credential status, grants. Never the secret.

## From the SDK

```ts
const connection = await syner.connections.get({
  organization: 'acme',
  name: 'stripe',
})
```

## From the CLI

```bash
syner connections get stripe
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api connections/get '{"organization": "acme", "name": "stripe"}'
```

## Response

```json
{
  "id": "con_5e7r",
  "organizationId": "org_3f9k",
  "name": "stripe",
  "service": "stripe",
  "config": {
    "account": "acct_123"
  },
  "credentialSetAt": "2026-09-04T18:24:30Z",
  "grants": [
    {
      "appId": "app_7c3a",
      "grantedBy": "prn_ana",
      "at": "2026-09-04T18:24:30Z"
    }
  ],
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```
