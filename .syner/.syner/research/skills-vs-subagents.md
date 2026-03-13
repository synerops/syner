# Skills vs Subagents: Research

> Date: 2026-03-10
> Sources: Codebase exploration + claude-code-guide

---

## TL;DR

| Aspecto | Skills | Subagents |
|---------|--------|-----------|
| **Ejecución** | Inline en conversación principal | Contexto aislado |
| **Propósito** | Conocimiento + workflows | Tareas aisladas + restricciones |
| **Modelo** | Heredan del padre | Configuran el suyo |
| **Tools** | Heredan o declaran subset | Explícitamente configurados |
| **Estado** | Stateless, on-demand | Session-based, pueden tener memoria |
| **Latencia** | Instantánea | 1-2 segundos startup |

---

## 1. Qué es un Skill

Un **skill** es un archivo markdown (`SKILL.md`) que define una capacidad enfocada y reutilizable.

### Estructura

```yaml
---
name: grow-note
description: Transform thoughts into documents
agent: notes           # Quién lo "posee"
metadata:
  author: syner
  version: "0.1.0"
tools:                  # Tools específicos (subset)
  - Read
  - Glob
  - Write
context: inline|fork    # Modo de ejecución
---

# Instrucciones en markdown...
```

### Características

- **Ubicación:** `apps/{app}/skills/`, `skills/`, symlinked a `.claude/skills/`
- **Invocación:** `/skill-name` o tool `Skill`
- **Scope:** Una cosa, bien hecha
- **Modelo:** Hereda del agente que lo invoca
- **Composabilidad:** Puede invocar otros skills

### Modos de Contexto

| Mode | Comportamiento |
|------|----------------|
| `inline` | Descripción incluida en system prompt del agente |
| `fork` | Instrucciones completas en contexto aislado via subagent |

### Ejemplos en Syner

- `/grow-note` - Transforma pensamientos en documentos
- `/find-ideas` - Descubre ideas en el vault
- `/create-syner-skill` - Scaffold de skills nuevos
- `/syner-skill-reviewer` - Audita calidad de skills

---

## 2. Qué es un Subagent

Un **subagent** es un agente especializado que corre en contexto aislado con su propio system prompt, model y tools.

### Estructura

```yaml
---
name: syner
description: Main orchestrator...
model: opus             # Model explícito
tools: Agent(notes, bot, dev), Read, Glob, Grep, Skill, Write, Bash
skills:                 # Skills disponibles
  - syner
  - syner-boundaries
memory: project         # Opcional
---

# Instrucciones en markdown...
```

### Características

- **Ubicación:** `agents/`, `apps/{app}/agents/`
- **Invocación:** `createSession()` API, Task tool con `subagent_type`
- **Scope:** Orquestación o ejecución de workflows complejos
- **Modelo:** Configuración explícita (`opus`, `sonnet`, `haiku`)
- **Delegación:** Puede invocar otros agents via `Agent()` y skills via `Skill`

### Tipos Built-in (Claude Code)

| Type | Propósito |
|------|-----------|
| `Explore` | Read-only exploration, haiku, rápido |
| `Plan` | Investigación antes de planificar |
| `code-reviewer` | Análisis sin modificar archivos |
| `Bash` | Ejecución de comandos |
| `general-purpose` | Tareas multi-step complejas |

### Ejemplos en Syner

- `syner` - Orquestador principal
- `notes` - Context engineer, sintetiza notas
- `dev` - Ecosystem builder, crea/mantiene skills
- `syner-worker` - Executor de tareas complejas

---

## 3. Diferencias Arquitectónicas

### Contexto

```
Skill (inline):
  Conversación principal → skill cargado → respuesta inline

Skill (fork):
  Conversación principal → Skill tool → subagent creado → resultado resumido

Subagent:
  Conversación principal → Task tool → contexto aislado → resultado resumido
```

### Lifecycle

| Aspecto | Skills | Subagents |
|---------|--------|-----------|
| Duración | On-demand, efímero | Session-based, persistente |
| Estado | Stateless | Puede tener memoria (`memory: project`) |
| Context window | Parte del principal | Propio, aislado |
| Costo tokens | Suma al principal | Cuenta separada |

### Tools y Permisos

**Skills:**
```yaml
tools:
  - Read
  - Glob
  - Write
```
Solo tienen acceso a los tools declarados (filtro del parent).

**Subagents:**
```yaml
tools: Agent(notes, bot, dev), Read, Glob, Grep, Skill, Write, Bash
```
Acceso completo a tools declarados + pueden invocar otros agents y skills.

---

## 4. Cuándo Usar Cada Uno

### Usa Skills cuando:

- [ ] La tarea es conocimiento de referencia (convenciones, patrones)
- [ ] Necesitas feedback loops tight (ask → respond → refine)
- [ ] Las instrucciones son reutilizables entre sesiones
- [ ] Latencia importa (carga instantánea)
- [ ] Una sola capacidad enfocada

### Usa Subagents cuando:

- [ ] Necesitas restricciones de tools (read-only, safe access)
- [ ] Output verbose que no quieres en contexto principal
- [ ] Trabajo paralelo (múltiples agents simultáneos)
- [ ] Control de costos (rutear a haiku)
- [ ] Tarea self-contained sin necesitar contexto de conversación
- [ ] Diferentes permisos o modelo
- [ ] Orquestación de múltiples skills/agents

---

## 5. Patrones de Composición

### Pattern 1: Skill delega a Subagent

```yaml
---
name: deep-research
context: fork           # Corre en subagent
agent: Explore          # Tipo de subagent
---
```

### Pattern 2: Subagent preloads Skills

```yaml
---
name: api-developer
skills:
  - api-conventions     # Contenido inyectado al inicio
  - error-handling
---
```

### Pattern 3: Orquestación

```
Usuario: "Implementa feature"
    ↓
Claude carga /api-conventions (skill - conocimiento)
    ↓
Claude delega a code-reviewer (subagent - análisis aislado)
    ↓
Claude usa /simplify (skill - cleanup inline)
    ↓
Resultado al usuario
```

---

## 6. Stack de Delegación en Syner

```
Tú (intent)
    ↓
syner agent (orchestrator, opus)
    ├─ Agent(notes, bot, dev, design)  → otros subagents
    ├─ Skill tool                       → skills como subagents
    └─ Ejecución directa               → tareas simples
        ↓
Skills (capacidades enfocadas)
    ├─ Cada uno hace una cosa
    ├─ Puede invocar otros skills
    └─ Retorna output concreto
```

---

## 7. Archivos de Referencia

### Skills Architecture
- `packages/vercel/src/skills/loader.ts` - Loading y parsing
- `packages/vercel/src/tools/skill.ts` - Tool implementation

### Agents Architecture
- `apps/bot/lib/agents/loader.ts` - Loading
- `apps/bot/lib/session.ts` - Session management

### Ejemplos
- `agents/syner.md` - Orquestador principal
- `agents/code-reviewer.md` - Reviewer especializado
- `apps/notes/skills/grow-note/SKILL.md` - Skill de transformación
- `apps/dev/skills/create-syner-skill/SKILL.md` - Skill de creación

---

## 8. Insight Clave

> **Context is precious.**

El criterio principal para decidir:

- **¿Enriquece el contexto principal?** → Skill inline
- **¿Produce output verbose o necesita aislamiento?** → Subagent
- **¿Necesita orquestar múltiples capacidades?** → Agent
- **¿Es una sola capacidad enfocada?** → Skill

---

## 9. Filosofía (de PHILOSOPHY.md)

> "A skill is a focused capability. It does one thing well. An agent that 'does everything' is an agent that does nothing reliably."

Por eso Syner tiene:
- Muchos skills pequeños (propósito específico)
- Pocos agents amplios (orquestadores y ejecutores)
- Patrones claros de delegación
