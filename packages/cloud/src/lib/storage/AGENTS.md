# storage

Owns stores and what they hold: documents and files.

## Things

- [stores](stores/AGENTS.md): a named container for documents and files.
- [documents](documents/AGENTS.md): structured data inside a store, addressed
  by key.
- [files](files/AGENTS.md): blobs inside a store, addressed by path.

## Rules

- A store belongs to one organization and, optionally, to one app.
- A document or a file lives inside exactly one store.
- The engines behind documents and files are chosen in infrastructure; the
  schema here is engine-neutral.
- Removing a store removes its contents; it is long-running.

## Ports (`ports.ts`)

Persistence:

- `stores`: save, load by id or by organization and name, list by organization
  and app, update status.

Providers:

- `document engine`: put, get, list by prefix, and remove keyed JSON bodies
  with a version per key.
- `file engine`: put a stream under a path, hand back a read handle, list by
  prefix, remove.
