<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">grant</h1>

<p align="center">
  <strong>Let an app or a principal use a connection.</strong>
</p>

A grant is the only way to use a connection. It names an app or a principal;
the holder never sees the credential.

## From the SDK

```ts
await syner.connections.grant({
  id,
  app: 'billing',
})
```

## From the CLI

```bash
syner connections grant stripe --app billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api connections/grant '{"id": "con_5e7r", "app": "billing"}'
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
