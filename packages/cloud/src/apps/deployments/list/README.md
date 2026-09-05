<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the deployments of an app.</strong>
</p>

Returns the app's deployments, newest first, in pages.

## From the SDK

```ts
const page = await syner.apps.deployments.list({ app: 'billing' })
```

## From the CLI

```bash
syner apps deployments list billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api apps/deployments/list '{"app": "billing"}'
```

## Response

```json
{
  "items": [
    {
      "id": "dep_2b7q",
      "appId": "app_7c3a",
      "versionId": "ver_9b21",
      "status": "live",
      "url": "https://billing.acme.syner.app",
      "target": {
        "kind": "provider",
        "ref": "prv_east1"
      },
      "operationId": "op_4x1m",
      "createdBy": "prn_ana",
      "createdAt": "2026-09-04T18:20:00Z",
      "finishedAt": "2026-09-04T18:24:30Z"
    }
  ],
  "next": null
}
```
