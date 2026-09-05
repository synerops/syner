<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">set</h1>

<p align="center">
  <strong>Create or replace a budget.</strong>
</p>

Set a limit for an organization or an app, and choose what happens when it is
reached.

## From the SDK

```ts
await syner.usage.budgets.set({
  organization: 'acme',
  app: 'billing',
  limit: {
    cost: 40,
    currency: 'USD',
  },
  period: 'month',
  action: 'notify',
})
```

## From the CLI

```bash
syner usage budgets set --app billing --cost 40 --period month --action notify
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api usage/budgets/set '{
  "organization": "acme",
  "app": "billing",
  "limit": {
    "cost": 40,
    "currency": "USD"
  },
  "period": "month",
  "action": "notify"
}'
```

## Response

```json
{
  "scope": {
    "organizationId": "org_3f9k",
    "appId": "app_7c3a"
  },
  "limit": {
    "cost": 40,
    "currency": "USD"
  },
  "period": "month",
  "action": "notify",
  "current": 12.6,
  "remaining": 27.4,
  "setBy": "prn_ana",
  "setAt": "2026-09-04T18:24:30Z"
}
```
