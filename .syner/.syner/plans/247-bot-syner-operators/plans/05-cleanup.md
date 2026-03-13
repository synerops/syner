# Plan 05: Cleanup main repo + skills update

## Objetivo

Remover `.syner/` del main repo y actualizar skills para usar syner.md via curl. El main repo queda limpio: solo código. El OS vive en `synerops/os`, accesible via syner.md.

## Cómo

### Paso 1: Verificar que todo funciona sin `.syner/` local

Antes de borrar:
- [ ] `curl localhost:3000/synerops/plans/247/README.md` funciona
- [ ] syner.md sirve contenido del repo `os`
- [ ] glob, grep, tree funcionan via query params

### Paso 2: Actualizar skills

Skills que referencian `.syner/` cambian a curl via syner.md:

| Skill | Antes | Después |
|-------|-------|---------|
| `load-all` | `Glob .syner/vaults/**/*.md` | `Bash: curl localhost:3000/synerops?glob=vaults/**/*.md` |
| `find-ideas` | `Glob .syner/vaults/**/*.md` | `Bash: curl "localhost:3000/synerops?grep=type: idea&glob=vaults/**/*.md"` |
| `find-links` | `Glob .syner/vaults/**/*.md` | Curl glob + read via syner.md |
| `track-idea` | `Glob .syner/vaults/**/*.md` | Curl glob + read via syner.md |
| `grow-note` | `Read/Write .syner/vaults/...` | Curl read/PUT via syner.md |
| `backlog-hygiene` | `Glob .syner/vaults/**/backlog*.md` | Curl glob via syner.md |
| `whats-next` | `Glob .syner/vaults/**/backlog*.md` | Curl glob via syner.md |
| `syner` orchestrator | `Glob .syner/vaults/**/*.md` | Curl glob via syner.md |

### Paso 3: Remover `.syner/` del main repo

```bash
rm -rf .syner/
```

### Paso 4: Actualizar .gitignore

`.syner/` en el main repo ahora es **cache de syner.md** (apps/vaults), no el OS:

```gitignore
# Syner cache (como .next/ y .turbo/)
.syner/
```

La línea ya existe — el significado cambia pero el gitignore no.

### Paso 5: Remover symlink `vaults/`

```bash
rm vaults
```

### Paso 6: Actualizar CLAUDE.md

Reescribir secciones que referencian `.syner/`:

- **Vault Architecture**: es `synerops/os` via syner.md, no `.syner/` local
- **Context Loading**: skills usan curl a syner.md
- **Project Structure**: `.syner/` ya no es parte de la estructura
- Agregar sección "OS Access" explicando que syner.md es el runtime

### Paso 7: Actualizar SYNER.md y PHILOSOPHY.md

Reflejar:
- syner.md como runtime del OS
- Dos repos (syner + os)
- No clone local del OS

## Definición de Done

- [ ] `.syner/` no contiene datos del OS en el main repo
- [ ] `.syner/` solo es cache de apps/vaults (se regenera)
- [ ] Todos los skills usan curl a syner.md, no filesystem paths
- [ ] Symlink `vaults/` removido
- [ ] CLAUDE.md actualizado
- [ ] SYNER.md y PHILOSOPHY.md actualizados
- [ ] Build pasa

## Riesgos

- **Skills rotos temporalmente**: Entre borrar y actualizar, skills no funcionan. Mitigación: actualizar skills (paso 2) ANTES de borrar `.syner/` (paso 3).
- **`bun dev` como prerequisito**: Skills requieren que syner.md esté corriendo. Mitigación: documentar en CLAUDE.md.
