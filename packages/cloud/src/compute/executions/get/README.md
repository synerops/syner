<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one execution.</strong>
</p>

Returns an execution with its status and, when finished, its result.

## Example

```ts
const exec = await syner.compute.executions.get({ id })
```

In the CLI: `syner compute executions get <id>`.

## What happens next

Output is a reference you can read as a stream; artifacts point into storage.
