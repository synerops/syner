<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">documents</h1>

<p align="center">
  <strong>Structured data inside a store, addressed by key.</strong>
</p>

A document is a JSON body under a key. Put creates or replaces it whole; get
reads it; list walks keys by prefix. Every write bumps a version, so a reader
can tell whether it saw the latest.

## What a document looks like

- **Store.** where it lives.
- **Key.** unique inside the store.
- **Body.** JSON.
- **Version.** increases on every put.
- **Updated by, at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `put.ts` | Create or replace a document. |
| `get.ts` | Read a document. |
| `list.ts` | List documents by key prefix. |
| `remove.ts` | Delete a document. |

## Exposure

Exposed through `PUT /storage/stores/:id/documents/:key`, `GET
/storage/stores/:id/documents/:key`, `GET /storage/stores/:id/documents`,
`DELETE /storage/stores/:id/documents/:key`. Contracts:
[/storage/stores/:id/documents](../../../api/storage/stores/[id]/documents/README.md),
[/storage/stores/:id/documents/:key](../../../api/storage/stores/[id]/documents/[key]/README.md).

## How it relates to the rest

Lives in a [store](../stores/README.md). For blobs use
[files](../files/README.md). Writes are metered in
[usage](../../usage/README.md).
