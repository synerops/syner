<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one job.</strong>
</p>

Returns the definition and a summary of its latest run.

## Example

```ts
const job = await syner.jobs.get({ organization: 'acme', name: 'close-month' })
```

In the CLI: `syner jobs get close-month`.

## What happens next

See its history with [runs/list](../runs/list/README.md).
