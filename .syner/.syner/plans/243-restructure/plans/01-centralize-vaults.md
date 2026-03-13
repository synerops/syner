# Plan 01: Centralizar Vaults en .syner/vaults/

## Objetivo

Mover todo el pensamiento (vaults) dentro de `.syner/vaults/`, centralizando el cerebro del OS. Separar claramente de `content/` (oficial, per-app).

## Estado actual

```
vaults/                          # Project-level (1 archivo, gitignored)
apps/wiki/vaults/                # 19 committed + ~10 gitignored
  ├── syner/                     # committed (shared project context)
  │   ├── what-is-syner.md
  │   ├── plan.md
  │   ├── compare.md
  │   └── ideas/syner-semantic.md
  ├── _blog/                     # gitignored (artículos terminados)
  ├── _ideas/                    # gitignored (seeds)
  ├── _ronny/                    # gitignored (personal)
  └── _website/                  # gitignored (website copy)
apps/dev/vaults/                 # 2 committed
apps/bot/vaults/                 # 0 committed
apps/design/vaults/              # ~10 committed (branding, components)
```

## Estado deseado

```
.syner/vaults/                   # TODO el pensamiento, centralizado
  ├── syner/                     # Project-level thinking
  ├── wiki/                      # Ex apps/wiki/vaults/
  ├── dev/                       # Ex apps/dev/vaults/
  ├── bot/                       # Ex apps/bot/vaults/
  └── design/                    # Ex apps/design/vaults/

vaults/ → .syner/vaults/         # Symlink para coding agent compat
```

## Cómo

### Paso 1: Mover vaults/ de raíz a .syner/vaults/

```bash
mv vaults/ .syner/vaults/
```

El contenido de `vaults/syner/` (1 archivo local) se convierte en `.syner/vaults/syner/`.

### Paso 2: Mover app-level vaults

```bash
# Mover contenido committed Y local
mv apps/wiki/vaults/* .syner/vaults/wiki/
mv apps/dev/vaults/* .syner/vaults/dev/
mv apps/bot/vaults/* .syner/vaults/bot/
mv apps/design/vaults/* .syner/vaults/design/

# Eliminar directorios vacíos
rmdir apps/wiki/vaults/ apps/dev/vaults/ apps/bot/vaults/ apps/design/vaults/
```

### Paso 3: Crear symlink para coding agents

```bash
ln -s .syner/vaults vaults
```

Coding agents que buscan `vaults/**/*.md` siguen funcionando.

### Paso 4: Decisión — vault content committed

Hoy hay ~30 archivos committed en vaults:
- `apps/wiki/vaults/syner/` — project context (what-is-syner, plan, compare)
- `apps/design/vaults/syner/branding/` — design system docs

**Estos necesitan una decisión:**

Opción A: Se mueven a `content/` de sus respectivas apps (son contenido oficial).
Opción B: Se quedan en `.syner/vaults/` pero se commitean (excepciones al gitignore).
Opción C: Se mueven a `.syner/vaults/` y se dejan de commitear (se vuelven locales).

**Recomendación:** Opción A para el branding/design content (ya es oficial). Opción C para los vault files de wiki/syner (son contexto operacional, no contenido público). Pero esto depende de si las apps tienen `content/` configurado (Plan 03).

**Decisión temporal:** Mover todo a `.syner/vaults/`, mantener el gitignore actual. Resolver la migración a `content/` cuando Fumadocs esté configurado.

### Paso 5: Actualizar .gitignore

```gitignore
# === Syner OS ===
# Vaults — todo el pensamiento es privado
.syner/vaults/
# ... (mantener resto de .syner/ rules)

# === Compatibilidad ===
# El symlink vaults/ apunta a .syner/vaults/, no necesita regla propia
```

### Paso 6: Actualizar vault discovery en skills

Todos los skills que globean vaults necesitan actualización:

| Skill | Pattern actual | Pattern nuevo |
|-------|---------------|---------------|
| `load-all` | `vaults/**/*.md` + `apps/*/vaults/**/*.md` | `vaults/**/*.md` (symlink resuelve) |
| `find-ideas` | `apps/*/vaults/**/*.md` | `vaults/*/` + subfolders |
| `find-links` | `apps/*/vaults/**/*.md` | `vaults/*/` + subfolders |
| `track-idea` | `apps/*/vaults/**/*.md` | `vaults/*/` + subfolders |
| `grow-note` | `apps/*/vaults/**/*.md` | `vaults/*/` + subfolders |
| `backlog-hygiene` | `apps/*/vaults/**/backlog*.md` | `vaults/**/backlog*.md` |
| `whats-next` | `apps/*/vaults/**/backlog*.md` | `vaults/**/backlog*.md` |
| `syner` orchestrator | `vaults/**/*.md` + `apps/*/vaults/**/*.md` | `vaults/**/*.md` |

**Nota:** Si el symlink `vaults/ → .syner/vaults/` funciona con Glob, solo necesitan `vaults/**/*.md`. Verificar que Glob sigue symlinks.

### Paso 7: Actualizar CLAUDE.md y SYNER.md

Reflejar nueva ubicación de vaults y discovery patterns.

## Definición de Done

- [ ] `.syner/vaults/` contiene todo el pensamiento (syner/, wiki/, dev/, bot/, design/)
- [ ] `vaults/` es symlink a `.syner/vaults/`
- [ ] `apps/*/vaults/` no existe
- [ ] `.gitignore` ignora `.syner/vaults/`
- [ ] Vault discovery funciona via symlink (verificar con `/load-all`)
- [ ] Skills actualizados con nuevos patterns
- [ ] CLAUDE.md actualizado
- [ ] Build pasa

## Riesgos

- **Symlink + Glob**: Si Glob no sigue symlinks, el discovery se rompe. Mitigación: probar antes de commitear.
- **Git history**: Mover archivos committed pierde history a menos que se use `git mv`. Para los ~30 archivos committed, usar `git mv`.
- **Otros coding agents**: Si otro agent (Cursor, Copilot) no sigue symlinks a `vaults/`, el descubrimiento falla. Mitigación: documentar en CLAUDE.md.
