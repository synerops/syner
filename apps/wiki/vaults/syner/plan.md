# Plan

Cómo syner convierte findings en acciones de plataforma.

## El Flujo

```
skill-review (o cualquier análisis) → findings
              ↓
syner-planner (agent) → plan.json
              ↓
packages/{platform}/plan.md → Platform Action
```

1. **Análisis**: cualquier skill/agente que produce findings
2. **syner-planner**: transforma findings en JSON estructurado (agnóstico)
3. **plan.md**: lee el JSON y ejecuta comandos de la plataforma

## Discovery

```bash
Glob("packages/*/plan.md")
```

Si `packages/{name}/plan.md` existe → ese package puede consumir plans.

## Dónde Viven

Cada package maneja su propio plan.md:

```
packages/github/plan.md   → crea GitHub issues
packages/jira/plan.md     → crea JIRA tickets (futuro)
packages/linear/plan.md   → crea Linear issues (futuro)
```

## Anatomía de plan.md

```yaml
---
name: {platform}-plan
description: Converts plans to {platform} actions
platform: github|jira|linear|etc
input: .syner/plan.json
tools: [Bash]
---
```

### Campos del Frontmatter

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `name` | sí | Identificador único (`{platform}-plan`) |
| `description` | sí | Qué hace |
| `platform` | sí | Plataforma destino (para discovery) |
| `input` | no | Path al JSON de entrada (default: `.syner/plan.json`) |
| `tools` | sí | Tools que necesita Claude |

### Discovery por Platform

```javascript
// Encontrar handler para una plataforma
Glob("packages/*/plan.md")
  .filter(f => f.frontmatter.platform === "github")
```

## Cómo Funciona

1. **syner-planner** produce JSON agnóstico:
   ```json
   {
     "status": "planned",
     "items": [{ "id": "D1", "title": "...", ... }]
   }
   ```

2. **plan.md** lee el JSON y ejecuta comandos de la plataforma:
   ```bash
   gh issue create --title "[D1] ..." --body "..."
   ```

## Crear un Nuevo plan.md

1. Crear `packages/{platform}/plan.md`
2. Definir frontmatter con los campos requeridos
3. Documentar el proceso de conversión
4. Incluir el comando de ejecución

## Principios

- **Agnóstico upstream**: syner-planner no sabe qué plan.md consumirá su output
- **Específico downstream**: cada plan.md conoce su plataforma a fondo
- **Iterativo**: procesar un item a la vez, no batch
- **Markdown**: plan.md es markdown, no código compilado
