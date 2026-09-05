<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one version of an app.</strong>
</p>

Returns a version by number.

To see where it ran, list [deployments](../../deployments/list/README.md).

## From the SDK

```ts
const version = await syner.apps.versions.get({
  app: 'billing',
  number: 3,
})
```

## From the CLI

```bash
syner apps versions get billing 3
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api apps/versions/get '{"app": "billing", "number": 3}'
```

## Response

```json
{
  "id": "ver_9b21",
  "appId": "app_7c3a",
  "number": 3,
  "source": {
    "kind": "git",
    "ref": "main",
    "commit": "4e1f0c9",
    "artifactId": "art_5d8e"
  },
  "backend": {
    "runtime": "node",
    "entry": "src/server.ts",
    "env": [
      "STRIPE_KEY"
    ]
  },
  "frontend": null,
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z"
}
```
