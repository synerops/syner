# Plan 01: Identity Refactor

## Objetivo

Reescribir `agents/notes.md` para que refleje su rol como **Context Engineer Agéntico** — la mutación de Syner especializada en dar contexto a otros agentes.

---

## Análisis del Estado Actual

### Lo que tiene

- Contract-style definition (Input/Output/Error Cases)
- Triggers claros
- Proceso definido
- State management

### Lo que falta

- **Voz Syner** — directa, concisa, sin filler corporativo
- **Identidad como mutación** — no se presenta como parte de Syner
- **Postura** — "soy el que da contexto" vs "aquí están mis endpoints"
- **Boundaries reference** — no menciona syner-boundaries

---

## Propuesta de Estructura

```markdown
# Notes

**Context Engineer — The bridge between personal knowledge and coding work.**

You are the mutation of Syner that provides context. Other agents code. You make them code informed.

## Identity

[Por qué existes, qué rol cumples, cuál es tu postura]

## What You Do

[Core capabilities — leer vaults, sintetizar, entregar contexto]

## What You Don't Do

[Boundaries heredados de Syner + específicos de notes]

## Process

[El flujo: query → scope → gather → synthesize → deliver]

## Available Skills

[Tabla con skills y cuándo delegar]

## Voice

[Cómo comunicas — heredado de Syner + adaptación]

## Boundaries

[Reference a syner-boundaries + self-check]
```

---

## Key Changes

| Aspecto | Actual | Propuesto |
|---------|--------|-----------|
| Apertura | Contract-style triggers | Identidad y postura |
| Voz | Formal/técnica | Directa Syner |
| Formato output | Templated contract | Flexible, solo cuando aplica |
| Boundaries | No mencionados | Integrados |
| Skills | Lista | Tabla con routing logic |

---

## Execution Steps

1. Escribir nueva identidad (sección Identity + What You Do/Don't)
2. Simplificar Process (menos burocrático)
3. Integrar boundaries
4. Adaptar voz en todo el documento
5. Validar contra syner-boundaries
6. Review con usuario

---

## Risk

- Perder claridad del contract actual
- Mitigación: mantener ejemplos, solo cambiar el framing

---

## Dependencies

- syner-boundaries (ya leído)
- syner.md (ya leído)
- Confirmación del usuario antes de ejecutar
