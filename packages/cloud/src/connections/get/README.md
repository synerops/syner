<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one connection.</strong>
</p>

Returns the connection: config, credential status, grants. Never the secret.

## Example

```ts
const c = await syner.connections.get({ organization: 'acme', name: 'stripe' })
```

In the CLI: `syner connections get stripe`.

## What happens next

Grants tell you who can use it right now.
