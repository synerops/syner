# Plan 03: Fumadocs Headless Setup ✅

**Estado:** Completado (2026-03-11)

## Objetivo

Configurar Fumadocs Headless como content framework para las apps que renderizan contenido oficial. Proof of concept en `apps/dev`, luego replicar en bot y design.

## Qué app primero

**`apps/dev`**, no vaults. Razones:
- `apps/vaults` renderiza markdown crudo desde `.syner/vaults/` — no necesita content framework
- `apps/dev` es donde specs, changelog, y developer docs van a vivir
- Es la app con más contenido potencial post-graduación (los 8 research papers en `.syner/research/` son candidatos naturales para `apps/dev/content/specs/`)

| App | Source | Framework | Cuándo |
|-----|--------|-----------|--------|
| `apps/vaults` | `.syner/vaults/` (raw md) | Custom markdown renderer | No aplica |
| `apps/dev` | `apps/dev/content/` (MDX) | Fumadocs Headless | **Completado** |
| `apps/bot` | `apps/bot/content/` (MDX) | Fumadocs Headless | Después |
| `apps/design` | `apps/design/content/` (MDX) | Fumadocs Headless | Después |

## Resolución de compatibilidad

1. **Next.js 16 + Fumadocs**: Compatible. fumadocs-mdx v14.2.9 funciona con Next.js 16.
2. **`next.config.ts` vs `.mjs`**: `createMDX()` requiere `.mjs`. Se migró `next.config.ts` → `next.config.mjs`.

## Qué se hizo

### Archivos modificados/creados

| Archivo | Cambio |
|---------|--------|
| `next.config.ts` → `next.config.mjs` | Migrado a ESM con `createMDX()` de `fumadocs-mdx/next` |
| `package.json` | Agregado `postinstall: "fumadocs-mdx"`, `fumadocs-ui`, `@types/mdx` |
| `source.config.ts` | Config completa con `frontmatterSchema`, `metaSchema`, `postprocess` |
| `lib/source.ts` | Import de `@/.source/server` (API v14) con `docs.toFumadocsSource()` |
| `tsconfig.json` | Path alias `@/.source/*` → `./.source/*` |
| `app/docs/[[...slug]]/page.tsx` | Type assertion para `body` en v14 |
| `mdx-components.tsx` | Creado (requerido por MDX) |
| `content/docs/index.mdx` | Primer content file |

### Lección: fumadocs-mdx v13 vs v14

El plan original estaba basado en la API de v13 (legacy en `~/synerops/legacy`). La versión actual (v14.2.9) cambió la arquitectura:

| | v13 (legacy) | v14 (actual) |
|---|---|---|
| `.source/` genera | `index.ts` (single file) | `server.ts`, `browser.ts`, `dynamic.ts` |
| Import path | `@/.source` | `@/.source/server` |
| tsconfig alias | `"@/.source": ["./.source/index.ts"]` | `"@/.source/*": ["./.source/*"]` |
| Source API | `createMDXSource(docs, meta)` | `docs.toFumadocsSource()` |
| createMDX import | `fumadocs-mdx/config` | `fumadocs-mdx/next` |

## Definición de Done

- [x] `fumadocs-core`, `fumadocs-mdx` en `apps/dev/package.json`
- [x] `apps/dev/content/docs/` existe con al menos 1 archivo MDX
- [x] `next.config` wrapeado con `createMDX()`
- [x] `source.ts` configurado con Zod schema
- [x] Al menos 1 página renderiza content en `/docs`
- [x] `bun run build` pasa sin errores
- [ ] No afecta builds de las otras apps — pendiente verificar
- [x] Documentar el patrón para replicar en bot y design — tabla v13 vs v14 arriba

## Patrón para replicar en bot y design

Para agregar Fumadocs a otra app:

```bash
cd apps/{app}
bun add fumadocs-core fumadocs-mdx fumadocs-ui
bun add -d @types/mdx
```

1. Crear `next.config.mjs` con `createMDX()` de `fumadocs-mdx/next`
2. Crear `source.config.ts` con `defineDocs`, `frontmatterSchema`, `metaSchema`
3. Crear `lib/source.ts` importando de `@/.source/server`
4. Agregar `@/.source/*` path alias a `tsconfig.json`
5. Agregar `"postinstall": "fumadocs-mdx"` a scripts
6. Crear `mdx-components.tsx` en raíz del app
7. Crear `content/docs/index.mdx`
8. Crear `app/docs/[[...slug]]/page.tsx`
9. Correr `bunx fumadocs-mdx` para generar `.source/`

## Dependencias

- **Requiere:** Plan 01 (vaults centralizados) — para que la separación vault/content sea real
- **NO requiere:** Plan 02 (wiki→vaults rename) — no toca los mismos archivos
- **Paralelo con:** Plan 02
