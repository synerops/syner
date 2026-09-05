<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">get</h1>

<p align="center">
  <strong>Read one store.</strong>
</p>

Returns a store by id, or by organization and name.

## Example

```ts
const store = await syner.storage.stores.get({ organization: 'acme', name: 'invoices' })
```

In the CLI: `syner storage stores get invoices`.

## What happens next

List its contents with [documents/list](../../documents/list/README.md) or
[files/list](../../files/list/README.md).
