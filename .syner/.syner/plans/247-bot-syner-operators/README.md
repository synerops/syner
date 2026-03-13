# Plan: syner.md como runtime del OS

**Issue:** [#247](https://github.com/synerops/syner/issues/247)
**Branch:** `feat/247-bot-syner-operators`
**Estado:** En planificación
**Parent:** [#243](https://github.com/synerops/syner/issues/243) Phase 3 (completada)

## Contexto

`.syner/` hoy vive dentro del main repo (`synerops/syner`), gitignored. Esto significa:
- Solo existe en local — no hay acceso remoto
- Skills acceden via filesystem — funciona en local, no en producción
- El bot no tiene acceso a `.syner/` porque el sandbox solo ve lo committed
- syner.md (apps/vaults) es un shell vacío

Después de Q&A con especialistas ([#247 comment](https://github.com/synerops/syner/issues/247#issuecomment-4043066115)):
- Bot como coding agent descartado — no más Vercel Sandbox
- Bot como event pipeline extraído a [#250](https://github.com/synerops/syner/issues/250)
- `.syner/` se mueve a un repo privado separado (`synerops/os`)
- **syner.md no es un dashboard — es el runtime del OS**

## Insight principal

syner.md (apps/vaults) es un **Storage runtime disfrazado de filesystem web**. Todos los consumers acceden al OS a través de syner.md. La UI es solo una de sus interfaces.

```
syner.md
├── Filesystem-like URLs      → /synerops/plans/247/README.md
├── Content negotiation       → text/html (UI), text/plain (raw), application/json (API)
├── Storage adapters internos → GitHubStorage (prod), LocalStorage (dev)
├── Cache local (.syner/)     → como .next/ y .turbo/
└── Consumers                 → Claude Code, Slack, GitHub bot, Browser
```

## Decisiones

| Decisión | Resultado |
|----------|-----------|
| Source of truth | Repo privado `synerops/os` (GitHub) |
| Runtime | syner.md (apps/vaults) — gateway único al OS |
| URL pattern | Filesystem-like: `syner.md/synerops/plans/247/README.md` |
| Content negotiation | `text/html` (UI), `text/plain` (raw), `application/json` (structured) |
| Cache | `.syner/` local en apps/vaults (como `.next/`, `.turbo/`) |
| Storage interface | En `@syner/sdk`, adapters en packages |
| No clone local del OS | Claude Code y Slack acceden via HTTP a syner.md |
| Bot coding agent | Descartado |

## Arquitectura objetivo

```
GitHub:
  synerops/syner          → código (apps, packages, skills, agents)
  synerops/os             → OS state (plans, ops, vaults, research, system)

syner.md (apps/vaults):
  /synerops/plans/247/README.md   → GET (read), PUT (write)
  /synerops/vaults/**/*.md        → filesystem-like navigation
  /synerops?glob=vaults/**/*.md   → discovery
  /synerops?grep=architecture     → search

  Internals:
    GitHubStorage adapter  → Contents API + Trees API + Search API
    LocalStorage adapter   → filesystem (solo dev de syner.md)
    .syner/cache/          → filesystem cache (gitignored)

Consumers (todos via HTTP a syner.md):
  Claude Code       → curl localhost:3000 (bun dev) o curl syner.md (prod)
  Slack bot         → fetch() → syner.md
  GitHub bot (#250) → fetch() → syner.md
  Browser           → navegación directa → syner.md
```

## Storage interface (`@syner/sdk`)

```typescript
export interface Storage {
  // CRUD
  read(path: string): Promise<string | null>
  write(path: string, content: string, message?: string): Promise<void>
  delete(path: string, message?: string): Promise<void>
  exists(path: string): Promise<boolean>

  // Discovery
  glob(pattern: string): Promise<string[]>
  grep(pattern: string, globPattern?: string): Promise<GrepMatch[]>
  tree(prefix?: string): Promise<string[]>
}

export interface GrepMatch {
  path: string
  line: number
  text: string
}
```

### Adapters

```typescript
// packages/github — GitHub API (Contents + Trees + Search)
import { createGitHubStorage } from '@syner/github'

// packages/syner — filesystem (solo dev local de syner.md)
import { createLocalStorage } from 'syner/storage'
```

### Cache layer

```
apps/vaults/.syner/          ← gitignored, como .next/ y .turbo/
  cache/
    tree.json                ← full tree del repo (glob)
    files/
      plans/247/README.md   ← archivos cacheados
    search/
      <hash>.json            ← resultados de grep
  manifest.json              ← TTLs, timestamps, SHAs
```

- Primer read → GitHub API → cache → respond
- Reads subsiguientes → cache hit (0ms)
- Writes → GitHub API → invalidate cache
- `rm -rf .syner/` → se reconstruye solo

## Claude Code access

Claude Code accede al OS directamente via curl a syner.md (`bun dev` debe estar corriendo):

```bash
# Read
curl localhost:3000/synerops/plans/247/README.md -H "Accept: text/plain"

# Glob
curl "localhost:3000/synerops?glob=vaults/**/*.md"

# Grep
curl "localhost:3000/synerops?grep=architecture"

# Tree
curl "localhost:3000/synerops?tree=plans/"

# Write
echo "content" | curl -X PUT localhost:3000/synerops/ops/obs.md \
  -H "Content-Type: text/plain" -d @-
```

Skills se actualizan para usar estos patterns en vez de filesystem paths.

## Sub-plans

| # | Plan | Estado | Dependencias |
|---|------|--------|--------------|
| 01 | [Repo privado + migración](plans/01-private-repo.md) | Pendiente | Ninguna |
| 02 | [Storage interface + adapters](plans/02-storage-interface.md) | Pendiente | Ninguna |
| 03 | [syner.md como runtime](plans/03-syner-md-runtime.md) | Pendiente | 01, 02 |
| 04 | [Slack como control remoto](plans/04-slack-control.md) | Pendiente | 03 |
| 05 | [Cleanup main repo](plans/05-cleanup.md) | Pendiente | 03 |

**Orden de ejecución:** (01 + 02 en paralelo) → 03 → (04 + 05 en paralelo)

## Fuera de scope

- Bot como event pipeline → [#250](https://github.com/synerops/syner/issues/250)
- Promote-note skill → epic futuro
- Build reduction → observar por separado
- Bot como coding agent → descartado
- GuardedStorage para restricciones de acceso → futuro, cuando haya más consumers
