<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove an organization and everything it owns.</strong>
</p>

Tears down apps, stores, jobs, connections, and memberships. Irreversible.

## From the SDK

```ts
const op = await syner.organizations.remove({ id })
```

## From the CLI

```bash
syner organizations remove acme
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api organizations/remove '{"id": "org_3f9k", "confirm": "acme"}'
```

## Response

```json
{
  "id": "op_4x1m",
  "organizationId": "org_3f9k",
  "kind": "organizations/remove",
  "resource": {
    "kind": "organization",
    "id": "org_3f9k"
  },
  "status": "pending",
  "progress": {
    "current": 0,
    "total": 6,
    "message": "removing apps"
  },
  "result": null,
  "error": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "finishedAt": null
}
```
