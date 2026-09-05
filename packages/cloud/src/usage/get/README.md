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

## Example

```ts
const u = await syner.usage.get({ organization: 'acme', app: 'billing', since: '2026-03-01', until: '2026-04-01', by: 'metric' })
```

In the CLI: `syner usage get --app billing --since 2026-03-01`.

## What happens next

Compare with the budget to see how close you are.
