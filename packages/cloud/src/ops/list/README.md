<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List operations.</strong>
</p>

Returns operations of an organization or a resource, newest first, in pages.

## From the SDK

```ts
const page = await syner.ops.list({
  organization: 'acme',
  status: 'running',
})
```

## From the CLI

```bash
syner ops list --status running
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api ops/list '{"organization": "acme", "status": "running"}'
```

## Response

```json
{
  "items": [
    {
      "id": "op_4x1m",
      "organizationId": "org_3f9k",
      "kind": "apps/deployments/create",
      "resource": {
        "kind": "deployment",
        "id": "dep_2b7q"
      },
      "status": "running",
      "progress": {
        "current": 2,
        "total": 3,
        "message": "provisioning"
      },
      "result": null,
      "error": null,
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z",
      "finishedAt": null
    }
  ],
  "next": null
}
```
