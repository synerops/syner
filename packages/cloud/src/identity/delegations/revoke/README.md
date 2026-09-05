<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">revoke</h1>

<p align="center">
  <strong>End a delegation now.</strong>
</p>

The agent's next call under it is refused.

## Example

```ts
await syner.identity.delegations.revoke({ id })
```

In the CLI: `syner identity delegations revoke <id>`.

## What happens next

Activity shows the revocation and who did it.
