<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/70cee063-9701-479d-a61e-f1da868c0957" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/4859e8b3-58ab-4649-bf39-a2fb1b7ea6b7" alt="Syner" height="48"/>
  </picture>
</p>

<h1 align="center">storage</h1>

<p align="center">
  <strong>Data and files that outlive a session.</strong>
</p>

Agents produce things worth keeping: results, notes, datasets, uploads.
Storage keeps them. A store is a named container owned by the organization,
optionally tied to an app. Inside a store live documents, structured data
addressed by key, and files, blobs addressed by path.

## What's inside

| Thing | What it is |
|---|---|
| [stores](stores/README.md) | a named container for documents and files. |
| [documents](documents/README.md) | structured data inside a store, addressed by key. |
| [files](files/README.md) | blobs inside a store, addressed by path. |

## Exposure

Exposed through [`/storage/stores`](../../api/storage/stores/README.md),
[`/storage/stores/:id`](../../api/storage/stores/[id]/README.md),
[`/storage/stores/:id/documents`](../../api/storage/stores/[id]/documents/README.md),
[`/storage/stores/:id/documents/:key`](../../api/storage/stores/[id]/documents/[key]/README.md),
[`/storage/stores/:id/files`](../../api/storage/stores/[id]/files/README.md),
[`/storage/stores/:id/files/:path`](../../api/storage/stores/[id]/files/[path]/README.md).

## What it needs from infrastructure

- **stores.** save, load by id or by organization and name, list by
  organization and app, update status.
- **document engine** (provider). put, get, list by prefix, and remove keyed
  JSON bodies with a version per key.
- **file engine** (provider). put a stream under a path, hand back a read
  handle, list by prefix, remove.

## How it relates to the rest

Storage is Syner's own; reaching a third party's storage is a
[connection](../connections/README.md). Apps and agents both use it. Execution
artifacts from [compute](../compute/README.md) can land here. Space and
operations are metered in [usage](../usage/README.md).
