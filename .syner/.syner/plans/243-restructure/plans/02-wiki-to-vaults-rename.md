# Plan 02: Wiki → Vaults Rename

## Objetivo

Renombrar `apps/wiki` a `apps/vaults`. La app se convierte en un personal dashboard — web-based Obsidian que renderiza `.syner/vaults/` (markdown crudo, no MDX).

## Identidad

| Antes | Después |
|-------|---------|
| `apps/wiki` | `apps/vaults` |
| syner.md (wiki) | syner.md (personal vault dashboard) |
| Renderiza content framework (Fumadocs/Velite) | Renderiza markdown crudo desde `.syner/vaults/` |
| Contenido público | Contenido privado (personal thinking) |

**Esta app NO usa Fumadocs.** No necesita `content/`. Lee directamente de `.syner/vaults/` y renderiza markdown.

## Cómo

### Paso 1: Rename directorio

```bash
mv apps/wiki apps/vaults
```

### Paso 2: Actualizar package.json

```json
{
  "name": "vaults",
  ...
}
```

### Paso 3: Rename agent

```bash
mv agents/wiki.md agents/vaults.md
# Actualizar symlink
mv apps/vaults/agents/wiki.md apps/vaults/agents/vaults.md
```

### Paso 4: Actualizar skill registry

Skills que viven en `apps/wiki/skills/` → `apps/vaults/skills/`:
- `find-ideas`
- `find-links`
- `grow-note`
- `track-idea`
- `load-all`
- `wiki-grow-specialist` → `vaults-grow-specialist`

### Paso 5: Recrear symlinks

```bash
# Eliminar symlinks rotos
rm skills/find-ideas skills/find-links skills/grow-note skills/track-idea skills/load-all skills/wiki-grow-specialist

# Recrear
ln -s ../apps/vaults/skills/find-ideas skills/find-ideas
ln -s ../apps/vaults/skills/find-links skills/find-links
# ... etc
```

### Paso 6: Actualizar todas las referencias

```bash
grep -r "apps/wiki" . --include="*.md" --include="*.ts" --include="*.json"
# Reemplazar apps/wiki → apps/vaults
```

### Paso 7: Actualizar turbo.json y CI

Verificar que turbo reconoce `apps/vaults` como app.

## Definición de Done

- [ ] `apps/vaults/` existe, `apps/wiki/` no
- [ ] `package.json` name = "vaults"
- [ ] Agent `vaults.md` existe con identidad actualizada
- [ ] Todos los skills re-symlinked
- [ ] `wiki-grow-specialist` → `vaults-grow-specialist`
- [ ] 0 referencias a `apps/wiki` en el codebase
- [ ] Build pasa
- [ ] Turbo reconoce la app

## Dependencias

- **Requiere:** Plan 01 — los vaults ya tienen que estar en `.syner/vaults/` antes de renombrar la app
- **Paralelo con:** Plan 03 — no se tocan los mismos archivos

## Notas

- Es el segundo rename de este app (notes → wiki → vaults). Documentar en el commit history para trazabilidad.
- Los skills de este app (find-ideas, grow-note, etc.) son sobre pensamiento/vaults — se quedan aquí, no migran a otro app.
- La app NO tiene `content/`. Su fuente de datos es `.syner/vaults/` directo.
