<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Register a connection to an external service.</strong>
</p>

Name the service and give the non-secret settings. The credential comes
separately, through [credentials/set](../credentials/set/README.md), so the
secret never travels with the configuration.

## From the SDK

```ts
const connection = await syner.connections.create({
  organization: 'acme',
  name: 'stripe',
  service: 'stripe',
  config: {
    account: 'acct_123',
  },
})
```

## From the CLI

```bash
syner connections create stripe --service stripe --config account=acct_123
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api connections/create '{
  "organization": "acme",
  "name": "stripe",
  "service": "stripe",
  "config": {
    "account": "acct_123"
  }
}'
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
  "credentialSetAt": null,
  "grants": [],
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```
