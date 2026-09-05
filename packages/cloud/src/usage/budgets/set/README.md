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

## Example

```ts
await syner.usage.budgets.set({ organization: 'acme', app: 'billing', limit: { cost: 40, currency: 'USD' }, period: 'month', action: 'notify' })
```

In the CLI: `syner usage budgets set --app billing --cost 40 --period month
--action notify`.

## What happens next

Usage records from now on are checked against it.
