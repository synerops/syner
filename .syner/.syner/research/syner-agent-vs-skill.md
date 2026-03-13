# Research: syner Agent vs syner Skill

> Date: 2026-03-10
> Status: **Needs Action** - Overlap arquitectónico identificado

---

## TL;DR

Tenemos **dos orquestadores con el mismo nombre** y responsabilidades solapadas. No es abandono (ambos están activos), es **falta de claridad en la separación de concerns**.

| Archivo | Última actualización | Propósito declarado |
|---------|---------------------|---------------------|
| `agents/syner.md` | 2026-03-09 | "Main orchestrator when tasks span multiple domains" |
| `skills/syner/SKILL.md` | 2026-03-10 | "Orchestrator for tasks that need your personal context" |

**El problema:** Ambas descripciones son casi idénticas.

---

## 1. Análisis del Agent

**Archivo:** `agents/syner.md`

```yaml
name: syner
model: opus
tools: Agent(notes, bot, dev, design), Read, Glob, Grep, Skill, Write, Bash
skills:
  - syner          # ← Carga el skill!
  - syner-boundaries
```

**Características:**
- Modelo explícito: `opus`
- Acceso a `Agent()` tool - puede delegar a otros agents
- Core loop: Context → Action → Verify → Repeat
- Subagents definidos: notes, bot, dev, design, syner-worker, syner-planner, syner-researcher
- Voice y language guidelines
- Diseñado para background/autonomous execution

**Lo que hace bien:**
- Delegación clara a subagents
- Reglas específicas de cuándo delegar vs ejecutar directo
- Comportamiento diferenciado (invocado vs background)

---

## 2. Análisis del Skill

**Archivo:** `skills/syner/SKILL.md`

```yaml
name: syner
agent: general-purpose
tools: [Read, Glob, Grep, Task, Skill, AskUserQuestion, Write]
version: "0.3.1"
```

**Características:**
- Sin modelo propio (hereda del caller)
- Usa `Task()` para delegar a subagents
- Routing a specialist skills (/track-idea, /find-ideas, etc.)
- Audit file writing
- Planning mode

**Lo que hace bien:**
- Step-by-step claro (Step 0-4)
- Context loading proportional (none → app → targeted → full)
- Delegation patterns documentados
- Audit trail

---

## 3. El Problema: Overlap

### 3.1 Ambos son "orquestadores"

| Aspecto | Agent | Skill |
|---------|-------|-------|
| Descripción | "Main orchestrator" | "Orchestrator for tasks" |
| Context loading | ✓ Implícito | ✓ Explícito (Step 1) |
| Routing | ✓ Agent() | ✓ Task(), Skill() |
| Delegation rules | ✓ Subagent table | ✓ Route table |

### 3.2 El agent carga el skill

```yaml
# En agents/syner.md
skills:
  - syner  # ← El agent tiene acceso al skill
```

Esto sugiere que el agent debería **usar** el skill, pero ¿para qué si ambos hacen routing?

### 3.3 Invocación confusa

- `/syner` invoca el skill
- Task con `subagent_type: syner` invocaría el agent (si está registrado)
- ¿Cuál usa el usuario? ¿Cuándo?

---

## 4. Diferencias Reales (Encontradas)

A pesar del overlap, hay diferencias que no están explícitas:

| Aspecto | Agent | Skill |
|---------|-------|-------|
| **Execution context** | Session-based, puede correr background | Fork, retorna y termina |
| **Model** | Opus (explícito) | Hereda del caller |
| **Agent delegation** | `Agent(notes, bot, dev, design)` | No tiene Agent() |
| **Audit writing** | No mencionado | Step 4: escribe audits |
| **Planning mode** | No mencionado | Explícito en Step 2 |

**Insight clave:** El skill no puede invocar otros agents directamente (no tiene `Agent()` tool), solo puede usar `Task()` para subagents.

---

## 5. Recomendación

### Option A: Clarificar Separación (Recomendado)

**El skill es el entry point interactivo:**
- Usuario invoca `/syner`
- Routing ligero a specialist skills
- Delega trabajo pesado a `syner-worker` via Task()
- Escribe audits

**El agent es el executor autónomo:**
- Triggered por CI, schedules, webhooks
- Corre en background sin interacción
- Orquesta otros agents (notes, bot, dev)
- Produce outputs concretos (PRs, reports)

```
┌─────────────────────────────────────────┐
│  Usuario                                │
│    ↓                                    │
│  /syner (skill)                         │
│    ├─ Entiende intent                   │
│    ├─ Carga context                     │
│    ├─ Ruta a specialist skills          │
│    └─ Delega a syner-worker si complex  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  CI / Schedule / Webhook                │
│    ↓                                    │
│  agents/syner (agent)                   │
│    ├─ Recibe trigger                    │
│    ├─ Carga context de vaults           │
│    ├─ Orquesta via Agent()              │
│    └─ Entrega output (PR, Slack, etc.)  │
└─────────────────────────────────────────┘
```

### Cambios Propuestos

**1. En `agents/syner.md`, agregar:**

```markdown
## When This Agent Runs

This agent runs **autonomously** when triggered by:
- GitHub Actions (CI)
- Scheduled jobs
- Webhooks
- Background tasks

For **interactive user help**, users invoke `/syner` skill instead.
```

**2. En `skills/syner/SKILL.md`, clarificar:**

```markdown
## Relationship to agents/syner

This skill is the **user-facing entry point**. It handles interactive requests.

For autonomous/background orchestration (no user interaction), the system uses `agents/syner` which is triggered by CI, schedules, or webhooks.

This skill may delegate to `syner-worker` for complex execution, but does NOT invoke `agents/syner` directly.
```

**3. Considerar renombrar para claridad:**

| Actual | Propuesto | Razón |
|--------|-----------|-------|
| `skills/syner` | `skills/syner` (keep) | Entry point conocido |
| `agents/syner` | `agents/syner-orchestrator` | Diferencia el rol |

O al revés: el skill podría ser `syner-interactive` y el agent `syner`.

### Option B: Consolidar

Si el agent y el skill hacen lo mismo en la práctica:
- Eliminar uno
- Mantener solo el que tenga más uso

**No recomendado** porque tienen contextos de ejecución diferentes (interactive vs background).

---

## 6. Preguntas Abiertas

1. **¿El agent `syner` se usa actualmente en CI?**
   - Si no, ¿debería eliminarse o es aspiracional?

2. **¿El skill `syner` debería tener acceso a `Agent()` tool?**
   - Actualmente no lo tiene, lo cual es una diferencia real

3. **¿Qué pasa cuando el agent carga el skill?**
   - `skills: - syner` en el agent ¿qué hace exactamente?

---

## 7. Next Steps

- [ ] Decidir: ¿clarificar o consolidar?
- [ ] Si clarificar: agregar documentación explícita en ambos archivos
- [ ] Si consolidar: elegir cuál mantener
- [ ] Actualizar CLAUDE.md con la distinción
- [ ] Considerar renaming para evitar confusión futura

---

## Referencias

- `agents/syner.md` - El agent
- `skills/syner/SKILL.md` - El skill
- `PHILOSOPHY.md` - "Skills, not monoliths"
- Research previo: `skills-vs-subagents.md`
