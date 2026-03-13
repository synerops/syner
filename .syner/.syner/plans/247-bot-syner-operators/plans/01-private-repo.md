# Plan 01: Repo privado + migración

## Objetivo

Crear `synerops/os` como repo privado y migrar todo el contenido de `.syner/` del main repo.

## Estado actual

```
synerops/syner/.syner/        ← dentro del main repo, gitignored
  ├── plans/                  ← 4 epics con subplans
  ├── ops/                    ← grow specialist observations
  ├── research/               ← 8 research artifacts
  ├── system/                 ← config
  └── vaults/                 ← notas personales
```

Todo gitignored. Solo existe en local.

## Estado deseado

```
synerops/os                   ← repo privado en GitHub (source of truth)
  ├── plans/
  ├── ops/
  ├── research/
  ├── system/
  ├── vaults/
  ├── README.md               ← qué es este repo
  └── CLAUDE.md               ← instrucciones para Claude Code
```

No hay clone local del OS para trabajo diario. Todos acceden via syner.md.

## Cómo

### Paso 1: Crear el repo privado

```bash
gh repo create synerops/os --private --description "Syner OS — plans, observations, vaults, research"
```

### Paso 2: Inicializar con contenido actual

```bash
cd ~/synerops
mkdir os && cd os
git init
cp -r ../syner/.syner/* .
```

### Paso 3: Crear README.md y CLAUDE.md

**README.md**: Explica el repo — qué es cada directorio, quién lo consume, cómo funciona.

**CLAUDE.md**: Instrucciones para Claude Code cuando trabaje directamente en el repo (raro, pero posible):
- Estructura del OS
- Convenciones de naming
- Qué es cada directorio

### Paso 4: Crear .gitignore

```gitignore
.DS_Store
.obsidian/
*.swp
*~
```

No hay vaults gitignored — el repo entero es privado.

### Paso 5: Push inicial

```bash
git add -A
git commit -m "init: migrate from syner/.syner"
git remote add origin git@github.com:synerops/os.git
git push -u origin main
```

### Paso 6: Configurar acceso

- GitHub App (`synerbot`) necesita installation access al repo `os`
- Verificar que el token de la App puede leer/escribir via Contents API
- Verificar Trees API y Search API funcionan contra el repo

## Definición de Done

- [ ] Repo `synerops/os` creado y privado
- [ ] Todo el contenido migrado (plans, ops, research, system, vaults)
- [ ] README.md y CLAUDE.md creados
- [ ] .gitignore configurado
- [ ] GitHub App tiene acceso al repo
- [ ] Contents API, Trees API, y Search API funcionan contra el repo
- [ ] No se necesita clone local para operación diaria

## Riesgos

- **Pérdida de datos**: Si el push falla parcialmente. Mitigación: no borrar `.syner/` local hasta verificar que el repo remoto está completo.
- **GitHub App access**: Si la App no tiene permisos sobre el nuevo repo. Mitigación: paso 6 verifica antes de continuar.
