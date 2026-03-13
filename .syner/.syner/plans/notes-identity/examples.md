# Notes Agent: 10 Examples

Ejemplos de uso real. Lo que dices → lo que recibes.

---

## 1. Query ambiguo

**Tú dices:**
> "continúa con lo del cliente"

**Notes responde:**
```markdown
## Context: el cliente

"El cliente" se refiere al proyecto de integración con Acme Corp.

Última sesión:
- OAuth implementado
- Pendiente: refresh tokens
- Bloqueado: esperando credenciales de su equipo

**Sources:** vaults/dev/projects/acme-corp.md, .syner/tasks/state.md
**Confidence:** High — único proyecto de cliente activo
**Gaps:** Ninguno
```

---

## 2. No hay contexto

**Tú dices:**
> "qué tenemos sobre pagos?"

**Notes responde:**
```markdown
## Context: pagos

No encontré notas sobre pagos en ningún vault.

**Sources:** (ninguno)
**Confidence:** N/A
**Gaps:** Considera:
- ¿Es un proyecto nuevo?
- ¿Se llama de otra forma?
- ¿Debería existir documentación?
```

---

## 3. Pedir ideas

**Tú dices:**
> "/syner-find-ideas"

**Notes responde:**
```markdown
### PR Review Copilot

**What:** Bot que hace code review automático usando LLMs

**Origin:** Notas sobre frustración con PRs lentos + interés en LLMs para código

**Why You:** Acceso a comunidad de 500 devs + experiencia en integraciones GitHub

**First Step:** Prototipo que revisa un PR y comenta en Slack

**Risk:** ¿Los devs confiarán en reviews automáticos?
```

---

## 4. Conectar dos temas

**Tú dices:**
> "/syner-find-links meditación productividad"

**Notes responde:**
```markdown
## Bridge: meditación ↔ productividad

### Meditación
- Practicas diarias documentadas
- Interés en focus y claridad mental

### Productividad
- Sistemas de deep work
- Frustración con interrupciones

### Conexiones

1. **Attention training** (strength: high)
   - Evidence: Ambos temas mencionan "focus" repetidamente
   - Implication: La meditación es tu sistema de entrenamiento de atención

2. **Context switching** (strength: medium)
   - Evidence: Notas sobre cómo la meditación reduce el "ruido mental"

### Synthesis
Meditación no es wellness para ti — es infraestructura de productividad.

### Implications
Podrías escribir sobre esto: "Meditation as Developer Tooling"
```

---

## 5. Graduar una idea

**Tú dices:**
> "/syner-grow-note esa idea de async vs sync"

**Notes responde:**
```markdown
## Graduated: When Sync Matters

**Source:** Daily note 2024-01-15, pensamiento sobre async vs meetings
**Format:** Decision Doc

---

# When Sync Matters

## Context
Async communication es default. Pero hay momentos donde sync es mejor.

## Options

| Situation | Recommendation |
|-----------|----------------|
| Feedback with nuance | Sync (call) |
| Status updates | Async (written) |
| Brainstorming | Sync (whiteboard) |
| Decisions with context | Async first, sync to finalize |

## Decision
Default async. Escalar a sync cuando: conflicto, ambigüedad emocional, o creative session.

---

**Gaps:** Falta definir qué herramientas para cada modo
**Suggested Path:** vaults/syner/decisions/async-sync-policy.md
**Next Steps:** Validar con el equipo, agregar ejemplos concretos
```

---

## 6. Ver qué ideas evolucionaron

**Tú dices:**
> "/syner-track-idea"

**Notes responde:**
```markdown
## Ideas con evolución significativa

1. **building-in-public.md** — 8 commits en 4 meses, última edición hace 45 días
   → Pasó de "debería hacer esto" a un plan concreto con audiencia definida

2. **agent-orchestration.md** — 12 commits en 3 meses, última edición hace 7 días
   → Evolucionó de concepto abstracto a arquitectura implementable

¿Quieres que trace alguna? Responde con el nombre.
```

---

## 7. Rastrear una idea específica

**Tú dices:**
> "/syner-track-idea building in public"

**Notes responde:**
```markdown
## Evolution: building in public

### Origin
**2024-09** — Primera mención: "debería documentar más lo que hago"

### Evolution Points

**2024-10** — vaults/syner/ideas.md
"Building in public podría ser marketing gratis"

**2024-11** — vaults/syner/projects/content.md
Definió audiencia: "developers que quieren crear productos"

**2024-12** — vaults/syner/plans/2025.md
Comprometido: "Q1 2025: empezar newsletter"

### Influences
- Leer sobre cómo otros founders documentan su journey
- Frustración con marketing tradicional

### Current State
Plan concreto con audiencia y timeline

### Trajectory
De idea vaga → commitment con fecha
```

---

## 8. Cargar todo el contexto

**Tú dices:**
> "/syner-load-all"

**Notes responde:**
```markdown
## Full Context

### Active Focus
- Syner: agent orchestration system (alta actividad última semana)
- Contenido: planning newsletter Q1 2025

### Background Projects
- Acme Corp integration (bloqueado, esperando credenciales)
- Personal knowledge system (mantenimiento, no activo)

### Key Themes
- Agents y automatización
- Building in public
- Developer productivity

### Open Loops
- ¿Cuándo lanzar la newsletter?
- ¿Monetización de Syner?
- Acme Corp: seguir esperando o escalar?

### Context Window
Alta actividad: syner/, ideas/
Dormant: personal/, archive/
```

---

## 9. Pregunta simple

**Tú dices:**
> "tenemos algo sobre autenticación?"

**Notes responde:**
> Sí. vaults/dev/auth/oauth-flow.md cubre OAuth básico. No hay notas sobre refresh tokens o session management.

---

## 10. Recuperar estado de sesión anterior

**Tú dices:**
> "en qué estábamos?"

**Notes responde:**
```markdown
## Context: sesión anterior

Última sesión trabajaste en:
- Refactor de notes-identity (completado)
- Alineación de 5 skills con la identidad Context Engineer
- Documentación de política de idioma en syner.md

Pendiente:
- Crear bot-identity y dev-identity (tasks creados, no ejecutados)
- Validar cambios con pr.md tests

**Sources:** .syner/tasks/state.md, .syner/tasks/notes-identity/index.md
**Confidence:** High — estado guardado al cerrar sesión
**Gaps:** Ninguno
```

---

## Resumen de Comandos

| Comando | Qué hace |
|---------|----------|
| (pregunta natural) | Notes busca contexto y responde |
| `/syner-find-ideas` | Genera ideas desde tus notas |
| `/syner-find-links A B` | Conecta dos dominios |
| `/syner-grow-note tema` | Gradúa un pensamiento a documento |
| `/syner-track-idea` | Muestra ideas que evolucionaron |
| `/syner-track-idea X` | Rastrea evolución de idea específica |
| `/syner-load-all` | Carga todo el contexto |
