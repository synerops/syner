<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">update</h1>

<p align="center">
  <strong>Change an app's name, backend, or frontend definition.</strong>
</p>

Updating changes what the app is, not what is running. A new backend entry
point or a new frontend applies to the next version you create; the live
deployment keeps serving the version it was given.

## From the SDK

```ts
await syner.apps.update({
  app: 'billing',
  backend: {
    runtime: 'node',
    entry: 'src/main.ts',
    env: ['STRIPE_KEY', 'SENTRY_DSN'],
  },
})
```

## From the CLI

```bash
syner apps update billing --entry src/main.ts
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api apps/update '{
  "app": "billing",
  "backend": {
    "runtime": "node",
    "entry": "src/main.ts",
    "env": [
      "STRIPE_KEY",
      "SENTRY_DSN"
    ]
  }
}'
```

## Response

```json
{
  "id": "app_7c3a",
  "name": "billing",
  "organizationId": "org_3f9k",
  "backend": {
    "runtime": "node",
    "entry": "src/main.ts",
    "env": [
      "STRIPE_KEY",
      "SENTRY_DSN"
    ]
  },
  "frontend": null,
  "currentDeploymentId": "dep_2b7q",
  "createdBy": "prn_ana",
  "createdAt": "2026-09-04T18:20:00Z",
  "updatedAt": "2026-09-04T18:24:30Z"
}
```
