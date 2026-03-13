# Plan 03: syner.md como runtime del OS

## Objetivo

Convertir apps/vaults (syner.md) de un shell vacío a el **runtime central del OS**. Filesystem-like URLs, content negotiation, cache local, Storage adapters internos.

## Estado actual

apps/vaults es una página "Coming soon". No tiene:
- API endpoints
- Storage layer
- Cache
- Conexión a nada

## Estado deseado

syner.md es el **gateway único** al OS. Todos los consumers acceden a `synerops/os` a través de syner.md:

```
GET  /synerops/plans/247/README.md     → leer archivo
PUT  /synerops/plans/247/README.md     → escribir archivo
GET  /synerops/plans/                   → listar directorio
GET  /synerops?glob=vaults/**/*.md      → glob
GET  /synerops?grep=architecture        → search
GET  /synerops?tree=plans/              → tree
```

### Content negotiation

Misma URL, distinta respuesta:

| Accept header | Response |
|--------------|----------|
| `text/html` | Dashboard UI — markdown rendered, file browser |
| `text/plain` | Raw markdown content |
| `application/json` | `{ path, content, sha, lastModified }` |

### Cache layer

```
apps/vaults/.syner/          ← gitignored
  cache/
    tree.json                ← full tree (TTL: 60s)
    files/
      plans/247/README.md   ← cacheado
    search/
      <hash>.json            ← resultados grep
  manifest.json              ← TTLs, timestamps, SHAs
```

- Read → check cache → hit: serve (0ms) / miss: GitHub API → cache → serve
- Write → GitHub API → invalidate cache path + parent
- `rm -rf apps/vaults/.syner/` → se reconstruye, como `.next/`

## Cómo

### Paso 1: Catch-all route

```typescript
// apps/vaults/app/synerops/[...path]/route.ts
import { getStorage } from '@/lib/storage'

export async function GET(req: Request, { params }) {
  const path = params.path.join('/')
  const accept = req.headers.get('accept') || ''
  const storage = getStorage()
  const url = new URL(req.url)

  // Query params: glob, grep, tree
  if (url.searchParams.has('glob')) {
    const results = await storage.glob(url.searchParams.get('glob')!)
    return Response.json(results)
  }
  if (url.searchParams.has('grep')) {
    const results = await storage.grep(
      url.searchParams.get('grep')!,
      url.searchParams.get('glob') || undefined
    )
    return Response.json(results)
  }
  if (url.searchParams.has('tree')) {
    const results = await storage.tree(url.searchParams.get('tree')!)
    return Response.json(results)
  }

  // File or directory
  const content = await storage.read(path)

  if (content === null) {
    // Try as directory
    const entries = await storage.tree(path)
    if (entries.length > 0) {
      if (accept.includes('text/html')) return renderDirectoryUI(path, entries)
      return Response.json(entries)
    }
    return new Response('Not found', { status: 404 })
  }

  // File found
  if (accept.includes('text/plain')) {
    return new Response(content, { headers: { 'Content-Type': 'text/plain' } })
  }
  if (accept.includes('application/json')) {
    return Response.json({ path, content })
  }
  // Default: render HTML
  return renderMarkdownUI(path, content)
}

export async function PUT(req: Request, { params }) {
  const path = params.path.join('/')
  const content = await req.text()
  const message = req.headers.get('x-commit-message') || `update: ${path}`
  const storage = getStorage()

  await storage.write(path, content, message)

  // Invalidate cache
  revalidatePath(`/synerops/${path}`)

  return Response.json({ ok: true })
}
```

### Paso 2: Storage con cache

```typescript
// apps/vaults/lib/storage.ts
import { createGitHubStorage } from '@syner/github'
import { createLocalStorage } from 'syner/storage'
import { createCachedStorage } from './cache'

export function getStorage(): Storage {
  const base = process.env.NODE_ENV === 'development'
    ? createLocalStorage(process.env.OS_PATH || '../../os')
    : createGitHubStorage(octokit, 'synerops', 'os')

  return createCachedStorage(base, {
    cacheDir: '.syner/cache',
    ttl: { tree: 60, file: 60, search: 30 },
  })
}
```

### Paso 3: Cache wrapper

```typescript
// apps/vaults/lib/cache.ts
export function createCachedStorage(inner: Storage, opts): Storage {
  return {
    async read(path) {
      const cached = await readCache(`files/${path}`)
      if (cached && !isExpired(cached, opts.ttl.file)) return cached.content
      const content = await inner.read(path)
      if (content) await writeCache(`files/${path}`, content)
      return content
    },
    async tree(prefix) {
      const cached = await readCache('tree.json')
      if (cached && !isExpired(cached, opts.ttl.tree)) {
        return filterByPrefix(cached.content, prefix)
      }
      const tree = await inner.tree()
      await writeCache('tree.json', tree)
      return filterByPrefix(tree, prefix)
    },
    async write(path, content, message) {
      await inner.write(path, content, message)
      await invalidateCache(`files/${path}`)
      await invalidateCache('tree.json')
    },
    // ... rest delegates to inner with cache layer
  }
}
```

### Paso 4: Auth

Producción necesita auth — no cualquiera puede leer tus vaults:

- Claude Code (curl): API key en header (`Authorization: Bearer <token>`)
- Slack bot: Server-side fetch con shared secret
- Browser: GitHub OAuth o Vercel Auth
- Desarrollo local: sin auth (localhost)

### Paso 5: UI mínima

Para `Accept: text/html`:
- Directory listing: lista de archivos clickeables
- File view: markdown rendered con `react-markdown` + `shiki`
- No editor en v1 — writes via CLI o Slack

## Definición de Done

- [ ] `GET /synerops/{path}` funciona para archivos y directorios
- [ ] `PUT /synerops/{path}` escribe al repo `os`
- [ ] Content negotiation: text/html, text/plain, application/json
- [ ] `?glob=`, `?grep=`, `?tree=` query params
- [ ] Cache en `.syner/` con TTL e invalidación en writes
- [ ] Auth en producción
- [ ] UI mínima (directory listing + markdown viewer)
- [ ] `bun dev` sirve syner.md en localhost:3000

## Riesgos

- **Scope creep**: Es tentador construir Obsidian. Mitigación: v1 es API + viewer. No editor web.
- **Cache stale**: Si alguien escribe directo al repo (sin pasar por syner.md), el cache queda stale. Mitigación: TTL corto (60s) + endpoint de flush manual.
- **Latencia primer request**: Sin cache, un glob necesita Trees API (~300ms). Mitigación: pre-warm cache on startup.
