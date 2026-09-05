<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">create</h1>

<p align="center">
  <strong>Provision a store.</strong>
</p>

Creates a named container. Provisioning may take a moment, so you get an
operation.

## Example

```ts
const op = await syner.storage.stores.create({ organization: 'acme', name: 'invoices', app: 'billing' })
```

In the CLI: `syner storage stores create invoices --app billing`.

## What happens next

When ready, put [documents](../../documents/put/README.md) or
[files](../../files/put/README.md) into it.
