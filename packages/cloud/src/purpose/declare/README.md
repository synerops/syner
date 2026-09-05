<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">declare</h1>

<p align="center">
  <strong>Write what an app is for.</strong>
</p>

You declare a purpose when the app is created, or when its reason to exist
changes. Declaring again replaces the whole declaration; the old one stays in
the app's history.

Nothing runs yet. The first result appears when
[evaluate](../evaluate/README.md) runs, on a schedule or on demand.

## From the SDK

```ts
await syner.purpose.declare({
  app: 'billing',
  statement:
    "Issue every customer's invoice for the month " +
    "and collect it through Stripe before the 5th.",
  criteria: [
    {
      name: 'invoices-on-time',
      target: '100% of invoices issued before the 3rd',
      source: 'activity',
    },
    {
      name: 'failed-charges',
      target: 'fewer than 2% of charges fail',
      source: 'activity',
    },
    {
      name: 'monthly-cost',
      target: 'usage under $40 per month',
      source: 'usage',
    },
  ],
})
```

## From the CLI

```bash
syner purpose declare billing --from purpose.json
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api purpose/declare '{
  "app": "billing",
  "statement": "Issue every customer's invoice for the month and collect it through Stripe before the 5th.",
  "criteria": [
    {
      "name": "invoices-on-time",
      "target": "100% of invoices issued before the 3rd",
      "source": "activity"
    },
    {
      "name": "failed-charges",
      "target": "fewer than 2% of charges fail",
      "source": "activity"
    },
    {
      "name": "monthly-cost",
      "target": "usage under $40 per month",
      "source": "usage"
    }
  ]
}'
```

## Response

```json
{
  "appId": "app_7c3a",
  "statement": "Issue every customer's invoice for the month and collect it through Stripe before the 5th.",
  "criteria": [
    {
      "name": "invoices-on-time",
      "target": "100% of invoices issued before the 3rd",
      "source": "activity"
    },
    {
      "name": "failed-charges",
      "target": "fewer than 2% of charges fail",
      "source": "activity"
    },
    {
      "name": "monthly-cost",
      "target": "usage under $40 per month",
      "source": "usage"
    }
  ],
  "declaredBy": "prn_ana",
  "since": "2026-09-04T18:20:00Z",
  "evaluations": []
}
```
