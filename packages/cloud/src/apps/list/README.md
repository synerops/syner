<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the apps of an organization.</strong>
</p>

Returns the organization's apps, newest first, in pages.

Each item is the same shape [get](../get/README.md) returns. Follow `next` to
read the following page.

## From the SDK

```ts
const page = await syner.apps.list({ organization: 'acme' })
```

## From the CLI

```bash
syner apps list
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api apps/list '{"organization": "acme"}'
```

## Response

```json
{
  "items": [
    {
      "id": "app_7c3a",
      "name": "billing",
      "organizationId": "org_3f9k",
      "backend": {
        "runtime": "node",
        "entry": "src/server.ts",
        "env": [
          "STRIPE_KEY"
        ]
      },
      "frontend": null,
      "currentDeploymentId": "dep_2b7q",
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z",
      "updatedAt": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```
