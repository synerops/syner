<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove a connection.</strong>
</p>

Revokes every grant, destroys the credential, and removes the connection.

## Example

```ts
await syner.connections.remove({ id })
```

In the CLI: `syner connections remove stripe`.

## What happens next

Apps that used it fail on their next call to the service; their activity shows
why.
