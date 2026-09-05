<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">revoke</h1>

<p align="center">
  <strong>Take a grant away.</strong>
</p>

Removes one grant. The holder's next call through the connection fails.

## Example

```ts
await syner.connections.revoke({ id, app: 'billing' })
```

In the CLI: `syner connections revoke stripe --app billing`.

## What happens next

Activity records the revocation with who did it.
