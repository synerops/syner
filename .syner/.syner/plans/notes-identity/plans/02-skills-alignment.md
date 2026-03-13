# Plan 02: Skills Alignment

## Objetivo

Alinear cada skill de notes a tres niveles jerárquicos:

1. **Syner** — como parte del ecosistema
2. **Notes** — su identidad heredada
3. **syner-boundaries** — el guardrail global

---

## Skills a Alinear

| Skill | Estado Actual | Cambios Necesarios |
|-------|---------------|-------------------|
| syner-find-ideas | Standalone, técnico | Voz notes, referencia boundaries |
| syner-find-links | Standalone, técnico | Voz notes, referencia boundaries |
| syner-grow-note | Standalone, técnico | Voz notes, referencia boundaries |
| syner-track-idea | Standalone, técnico | Voz notes, referencia boundaries |
| syner-load-all | Standalone, técnico | Voz notes, referencia boundaries |

---

## Patrón de Alineación

Cada skill debe tener:

### 1. Header que establece pertenencia

```markdown
# Syner Find Ideas

> Part of **Notes** — the Context Engineer mutation of Syner.
```

### 2. Purpose que conecta con notes

```markdown
## Purpose

You find ideas from vaults. Notes reads context — you read it for a specific goal: surfacing what the user could build.
```

### 3. Boundaries section

```markdown
## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

- **Proportional Loading** — Load what the query needs, not everything
- **Notes Are Context** — Read for understanding, not field extraction
- **Concrete Output** — Deliver ideas, not "things to consider"
```

### 4. Voz consistente

- Directa
- Sin filler
- Primera persona cuando aplica ("I scan your vaults...")

---

## Execution Order

1. `syner-load-all` — Es el más fundamental, carga contexto para otros
2. `syner-find-ideas` — Usa load-all, debe alinearse después
3. `syner-find-links` — Similar pattern
4. `syner-grow-note` — Write capability, más cuidado con boundaries
5. `syner-track-idea` — Git integration, verificar self-verification boundary

---

## Validation Criteria

Para cada skill, validar:

| Boundary | Check |
|----------|-------|
| 2. Proportional Loading | ¿Carga solo lo necesario? |
| 5. Notes Are Context | ¿Lee para entender, no extraer? |
| 7. Concrete Output | ¿Entrega artifacts, no conversación? |
| 8. Self-Verification | ¿Verifica su trabajo? |
| 10. Observable Work | ¿Deja trail visible? |

---

## Dependencies

- Plan 01 debe completarse primero (notes identity define la voz heredada)
- syner-boundaries (ya leído)

---

## Deliverables

5 skills actualizados:

- `apps/notes/skills/syner-load-all/SKILL.md`
- `apps/notes/skills/syner-find-ideas/SKILL.md`
- `apps/notes/skills/syner-find-links/SKILL.md`
- `apps/notes/skills/syner-grow-note/SKILL.md`
- `apps/notes/skills/syner-track-idea/SKILL.md`
