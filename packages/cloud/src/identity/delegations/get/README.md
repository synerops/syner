<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one delegation.</strong>
</p>

Returns the delegation with its status.

## Example

```ts
const d = await syner.identity.delegations.get({ id })
```

In the CLI: `syner identity delegations get <id>`.

## What happens next

Check `expiresAt` and `limits` to know what the agent may still do.
