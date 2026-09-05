<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Aggregate consumption over a period.</strong>
</p>

Sums usage by metric, app, or principal for a window, with cost when pricing
is available.

## From the SDK

```ts
const usage = await syner.usage.get({
  organization: 'acme',
  app: 'billing',
  since: '2026-03-01',
  until: '2026-04-01',
  by: 'metric',
})
```

## From the CLI

```bash
syner usage get --app billing --since 2026-03-01
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api usage/get '{
  "organization": "acme",
  "app": "billing",
  "since": "2026-03-01",
  "until": "2026-04-01",
  "by": "metric"
}'
```

## Response

```json
{
  "rows": [
    {
      "key": "compute.seconds",
      "quantity": 18420,
      "cost": 7.4
    },
    {
      "key": "storage.bytes",
      "quantity": 2147483648,
      "cost": 4.2
    },
    {
      "key": "connections.calls",
      "quantity": 1180,
      "cost": 1.0
    }
  ],
  "currency": "USD"
}
```
