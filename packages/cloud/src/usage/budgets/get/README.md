<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read a budget with its current consumption.</strong>
</p>

Returns the budget of a scope and how much of it is used so far.

## From the SDK

```ts
const budget = await syner.usage.budgets.get({
  organization: 'acme',
  app: 'billing',
})
```

## From the CLI

```bash
syner usage budgets get --app billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api usage/budgets/get '{"organization": "acme", "app": "billing"}'
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
