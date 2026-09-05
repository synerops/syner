<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read an app's purpose.</strong>
</p>

Returns the declaration with its latest evaluation.

## From the SDK

```ts
const p = await syner.purpose.get({ app: 'billing' })
```

## From the CLI

```bash
syner purpose get billing
```

The same call through the raw API. The path is the node; the body is the
input.

```bash
syner api purpose/get '{"app": "billing"}'
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
  "evaluations": [
    {
      "at": "2026-09-04T18:24:30Z",
      "result": "partial",
      "evidence": [
        {
          "criterion": "invoices-on-time",
          "met": true,
          "measured": "100% before the 3rd",
          "source": "activity"
        },
        {
          "criterion": "failed-charges",
          "met": false,
          "measured": "3.1% failed",
          "source": "activity"
        },
        {
          "criterion": "monthly-cost",
          "met": true,
          "measured": "$12.60",
          "source": "usage"
        }
      ]
    }
  ]
}
```
