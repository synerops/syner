# Plan: Reestructuración `.syner` como OS

**Issue:** [#243](https://github.com/synerops/syner/issues/243)
**Estado:** Fase 3 completada.
**Concerns:** [#246](https://github.com/synerops/syner/issues/246)

## Fases

### Fase 1: Reestructuración ✅

Consolidar `.syner/` como OS interno. PR #245.

### Fase 2: Convención ✅

`apps/notes` → `apps/wiki`. Symlinks recreados.

### Fase 3: Norte de desarrollo

Separar vaults (pensamiento privado) de content (contenido oficial).

**Decisiones (Q&A en #246):**

- Vaults vuelven a `.syner/vaults/` (centralizados, todo el pensamiento dentro del OS)
- App vaults se centralizan: `apps/*/vaults/` → `.syner/vaults/{app}/`
- Symlink `vaults/ → .syner/vaults/` para compat con coding agents
- `apps/wiki` → `apps/vaults` (personal dashboard, web-based Obsidian)
- `apps/vaults` NO usa content framework — renderiza markdown crudo
- `apps/dev`, `apps/bot`, `apps/design` usan Fumadocs Headless para `content/`
- Content per-app (`apps/*/content/`), NO root `content/`
- Graduation mechanism (promote-note) fuera de scope de este epic

```
.syner/vaults/ (pensamiento crudo, gitignored)
  ↓ [futuro: graduación]
apps/*/content/ (oficial, committed, MDX + Zod schemas)
  ↓ build (Next.js + Fumadocs Headless)
Apps (syner.dev, syner.bot, syner.design)

.syner/vaults/ → apps/vaults (dashboard personal, syner.md)
```

**Sub-plans:**

| # | Plan | Estado | Dependencias |
|---|------|--------|--------------|
| 00 | [Fix broken refs](plans/00-fix-broken-refs.md) | ⏭️ Superseded | Ninguna |
| 01 | [Centralizar vaults en .syner](plans/01-centralize-vaults.md) | ✅ Completado | 00 |
| 02 | [Wiki → Vaults rename](plans/02-wiki-to-vaults-rename.md) | ✅ Completado | 01 |
| 03 | [Fumadocs Headless setup](plans/03-fumadocs-headless.md) | ✅ Completado | 01 |
| 04 | [README como manual del OS](plans/04-readme-os-manual.md) | ✅ Completado | 01, 02, 03 |

**Orden de ejecución:** 00 → 01 → (02 + 03 en paralelo) → 04

**Fuera de scope (→ epics hijos):**
- syner.md como runtime del OS + repo privado `synerops/os` → [#247](https://github.com/synerops/syner/issues/247)
- Bot como event pipeline → [#250](https://github.com/synerops/syner/issues/250)
- Build reduction → observar, trackear en `ops/dev-grow-specialist/observations.md`
- Graduation mechanism (promote-note) → epic futuro post-Phase 3
