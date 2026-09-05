<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">remove</h1>

<p align="center">
  <strong>Remove a store and everything in it.</strong>
</p>

Deletes the documents and files, then the store. Long-running.

## Example

```ts
const op = await syner.storage.stores.remove({ id })
```

In the CLI: `syner storage stores remove invoices`.

## What happens next

Follow the operation. The name is released when it completes.
