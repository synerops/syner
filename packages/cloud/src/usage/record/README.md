<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">record</h1>

<p align="center">
  <strong>Append a consumption.</strong>
</p>

Called by the cloud when something is consumed. Clients never call it.

## From inside the cloud

```ts
// inside a cloud use case, after an execution ends
await usage.record({
  metric: 'compute.seconds',
  quantity: 42,
  organizationId,
  appId,
  principalId,
  resource: {
    kind: 'execution',
    id,
  },
})
```

## Response

```json
{
  "id": "use_7q1w",
  "metric": "compute.seconds",
  "quantity": 42,
  "organizationId": "org_3f9k",
  "appId": "app_7c3a",
  "principalId": "prn_bot",
  "resource": {
    "kind": "execution",
    "id": "exe_c41d"
  },
  "period": "2026-09-04T18:00:00Z",
  "recordedAt": "2026-09-04T18:24:30Z"
}
```
