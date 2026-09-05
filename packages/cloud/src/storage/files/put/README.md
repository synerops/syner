<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">put</h1>

<p align="center">
  <strong>Upload or replace a file.</strong>
</p>

Streams bytes to a path in a store.

## Example

```ts
await syner.storage.files.put({ store: 'invoices', path: 'pdf/inv-1042.pdf', body: stream, contentType: 'application/pdf' })
```

In the CLI: `syner storage files put invoices pdf/inv-1042.pdf
./inv-1042.pdf`.

## What happens next

Get returns a way to read it back.
