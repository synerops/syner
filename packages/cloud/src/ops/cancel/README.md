<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">cancel</h1>

<p align="center">
  <strong>Ask an operation to stop.</strong>
</p>

Cancellation is a request: the operation stops at its next safe point and
reports cancelled.

## Example

```ts
await syner.ops.cancel({ id })
```

In the CLI: `syner ops cancel <id>`.

## What happens next

Read the operation: its result says what was done before the stop and what was
rolled back.
