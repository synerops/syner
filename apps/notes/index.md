<!-- index.md files define the context for a directory. When an agent or skill loads a folder, it reads index.md first to understand what the folder contains and how to interpret its files. This is the root index for the entire content directory. -->

# Notes

Knowledge base served by [syner.md](./projects/syner.md).

## Conventions

### `index.md`

`index.md` is the context file for a directory. If it exists, it defines what the folder is about and how to interpret its contents. Skills and code both resolve `index.md` first when loading a folder (see `apps/notes/lib/content.ts`).

### Frontmatter

Only use frontmatter in `index.md` of project directories, and only for operational metadata that can't be derived from git (e.g. `host`). Don't duplicate what git already tracks (author, dates, name).
