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

## Needs from infrastructure

[ports](ports/AGENTS.md): persistence for stores; a document engine and a file
engine.
