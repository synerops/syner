<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the connections of an organization.</strong>
</p>

Returns connections, newest first, in pages.

## From the SDK

```ts
const page = await syner.connections.list({ organization: 'acme' })
```

## From the CLI

```bash
syner connections list
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api connections/list '{"organization": "acme"}'
```

## Response

```json
{
  "items": [
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
  ],
  "next": null
}
```
