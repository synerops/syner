<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove a job.</strong>
</p>

Cancels active runs and removes the definition. Finished runs stay readable.

## Example

```ts
await syner.jobs.remove({ id })
```

In the CLI: `syner jobs remove close-month`.

## What happens next

The name is free; run history answers to runs/list by job id.
