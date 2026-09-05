<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">list</h1>

<p align="center">
  <strong>List the versions of an app.</strong>
</p>

Returns the app's versions, newest first, in pages.

## From the SDK

```ts
const page = await syner.apps.versions.list({ app: 'billing' })
```

## From the CLI

```bash
syner apps versions list billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api apps/versions/list '{"app": "billing"}'
```

## Response

```json
{
  "items": [
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
  ],
  "next": null
}
```
