<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">files</h1>

<p align="center">
  <strong>Blobs inside a store, addressed by path.</strong>
</p>

A file is bytes under a path, with a content type and a size. Put streams
bytes in; get hands back a way to read them; list walks paths by prefix. Files
are for what does not fit a JSON body: uploads, exports, artifacts.

## What a file looks like

- **Store.** where it lives.
- **Path.** unique inside the store.
- **Content type and size.** what it is and how big.
- **ETag.** changes on every put.
- **Updated by, at.** who and when.

## Use cases

| File | What it does |
|---|---|
| `put.ts` | Upload or replace a file. |
| `get.ts` | Read a file. |
| `list.ts` | List files by path prefix. |
| `remove.ts` | Delete a file. |

## Exposure

Exposed through `PUT /storage/stores/:id/files/:path`, `GET
/storage/stores/:id/files/:path`, `GET /storage/stores/:id/files`, `DELETE
/storage/stores/:id/files/:path`. Contracts:
[/storage/stores/:id/files](../../../api/storage/stores/[id]/files/README.md),
[/storage/stores/:id/files/:path](../../../api/storage/stores/[id]/files/[path]/README.md).

## How it relates to the rest

Lives in a [store](../stores/README.md). Structured data goes to
[documents](../documents/README.md). Execution artifacts from
[compute](../../compute/executions/README.md) are files. Space is metered in
[usage](../../usage/README.md).
