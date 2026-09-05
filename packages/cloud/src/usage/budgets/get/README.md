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

## Example

```ts
const b = await syner.usage.budgets.get({ organization: 'acme', app: 'billing' })
```

In the CLI: `syner usage budgets get --app billing`.

## What happens next

Syner OS shows this as the answer to what is it costing.
