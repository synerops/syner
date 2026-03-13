# Plan 00: Fix Broken References (apps/notes → apps/wiki)

## Objetivo

Limpiar las 7 referencias rotas que quedaron de Phase 2 (rename notes → wiki). Prerequisito para Phase 3.

## Referencias rotas

| Archivo | Referencia rota |
|---------|----------------|
| `apps/dev/skills/update-syner-app/SKILL.md` | `apps/notes/vaults/syner/common-stack.md` |
| `apps/dev/skills/create-syner-app/SKILL.md` | `apps/notes/vaults/syner/common-stack.md` |
| `apps/dev/skills/syner-readme-enhancer/references/examples.md` | `apps/notes/vaults/` |
| `apps/wiki/skills/load-all/SKILL.md` | `apps/notes/vaults/` |
| `apps/wiki/AGENTS.md` | `apps/notes/vaults/` |
| `apps/wiki/README.md` | `apps/notes/vaults/` |
| `skills/syner/apps.md` | `apps/notes/vaults/` |

## Cómo

1. Find-and-replace `apps/notes/vaults` → `apps/wiki/vaults` en los 7 archivos
2. Verificar que `apps/wiki/vaults/syner/common-stack.md` existe (si no, el path estaba roto antes del rename también)
3. Verificar que no hay más referencias con `grep -r "apps/notes" .`

**Nota:** Después de Plan 01, estas rutas van a cambiar de nuevo (`apps/wiki/vaults/` → `.syner/vaults/wiki/`). Pero necesitamos que funcionen ahora para no acumular deuda.

## Definición de Done

- [ ] 0 resultados en `grep -r "apps/notes" . --include="*.md"`
- [ ] Skills `create-syner-app` y `update-syner-app` referencian paths que existen
- [ ] Build pasa
