# Plan 04: README como Manual del OS

## Objetivo

Reescribir el README root para que funcione como la interfaz del OS — lo que un humano o agente lee para saber qué puede hacer con syner.

## El problema actual

El README es un README de proyecto técnico: cómo instalar, estructura de carpetas, stack. No dice:
- Qué puedes **hacer** (operaciones disponibles)
- Cómo fluye el **contenido** (vaults → content → app)
- Qué puedes **crear** (apps, skills, agents, packages)
- Cómo **interactuar** (qué skills usar, cuándo)

## Qué debe comunicar

### 1. Qué es Syner (1 párrafo)

Agent orchestrator que entiende tu contexto personal a través de markdown notes.

### 2. Arquitectura: dos capas

```
.syner/vaults/     → pensamiento (privado, gitignored, raw md)
apps/*/content/    → contenido oficial (committed, MDX, Fumadocs)
```

### 3. Las apps

| App | URL | Qué hace | Source |
|-----|-----|----------|--------|
| `apps/vaults` | syner.md | Personal dashboard — browse your thinking | `.syner/vaults/` |
| `apps/dev` | syner.dev | Developer docs, specs, changelog | `apps/dev/content/` |
| `apps/bot` | syner.bot | Integration platform | `apps/bot/content/` |
| `apps/design` | syner.design | Design system, component catalog | `apps/design/content/` |

### 4. Qué puedes hacer (skills)

```
/syner              → Orchestrator principal
/whats-next         → Qué hacer hoy
/find-ideas         → Descubrir ideas en tus vaults
/find-links         → Conectar dominios
/grow-note          → Promover pensamiento a documento
/backlog-hygiene    → Limpiar backlog
/load-all           → Cargar todo tu contexto
```

### 5. Qué puedes crear

```
/create-syner-app     → Nueva app Next.js
/create-syner-skill   → Nuevo skill
/create-syner-agent   → Nuevo agente
```

### 6. Quick start

```bash
bun install
bun run dev
```

## Cómo

### Paso 1: Auditar README actual

Leer el README actual e identificar qué se mantiene, qué se elimina, qué se agrega.

### Paso 2: Escribir nuevo README

Seguir la estructura de arriba. Tono: directo, conciso, voz Syner.

### Paso 3: Validar con el usuario

Mostrar draft, iterar.

## Definición de Done

- [ ] README root reescrito
- [ ] Arquitectura vault/content explicada
- [ ] Tabla de apps con identidad clara
- [ ] Lista de skills disponibles
- [ ] Quick start funcional
- [ ] Tono consistente con voz Syner

## Dependencias

- **Requiere:** Plan 01 (vault centralización real), Plan 02 (app rename finalizado), Plan 03 (Fumadocs configurado)
- **Estrictamente último** — documenta lo que YA existe, no aspiraciones

## Notas

- No es un README de proyecto open source genérico. Es la interfaz del OS.
- Usar `/syner-readme-enhancer` como herramienta para generar el draft.
- El README de cada app puede seguir siendo específico de esa app.
- NO listar skills que no existan aún (como promote-note).
