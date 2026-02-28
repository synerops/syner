---
path: apps/notes
host:
  local: localhost:3000
  public: https://syner.md
---

# syner.md

## common stack

follow [common stack](../common-stack.md) guidelines

## app: notes

Wiki/knowledge base that serves markdown from `apps/notes/content/`.

### routes

| route | behavior |
|-------|----------|
| `GET /` | lists folders in `content/` |
| `GET /[...slug]` | `.md` file or `index.md` → HTML |
| `GET /[...slug]` (directory without index) | lists directory contents |

### content negotiation

Same URL, different format based on `Accept` header:

```bash
# HTML (browser default)
curl http://localhost:3000/projects/common-stack

# Raw markdown (agents/CLI)
curl -H "Accept: text/markdown" http://localhost:3000/projects/common-stack
```

Configured in `next.config.ts`:
- Detects `text/markdown` or `text/plain` in Accept header
- Rewrites to `/api/markdown/:path*` internally

### path resolution

The loader (`lib/content.ts`) resolves in order:
1. `content/slug.md` → direct file
2. `content/slug/index.md` → folder with index
3. `content/slug/` → list directory (fallback)

### security

- Paths validated against `content/` (cannot escape directory)
- Symlinks blocked
- Out of scope → 404

### run locally

```bash
cd apps/notes && bun dev
```

## dependencies

- react-markdown
- next 16
- react 19

## how tos

### add a note
Create `apps/notes/content/category/my-note.md`

### create section with index
```
content/my-section/
  index.md    ← /my-section
  sub.md      ← /my-section/sub
```

### consume from agents
```bash
curl -H "Accept: text/markdown" http://localhost:3000/path/to/note
```
