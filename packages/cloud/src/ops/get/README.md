<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one operation.</strong>
</p>

Returns the operation with its status, progress, and, when finished, its
result or error.

## Example

```ts
const op = await syner.ops.get({ id })
if (op.status === 'succeeded') console.log(op.result)
```

In the CLI: `syner ops get <id>`, or `syner ops get <id> --wait` to block
until it ends.

## What happens next

Waiting is the client's job: poll, or let the SDK's `op.result()` do it.
