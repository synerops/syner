# Planning Mode

Fase del loop autónomo que transforma hallazgos en Acceptance Criteria.

## Qué es

Un **protocolo de operación**, no un skill. Convierte análisis en checklist actionable.

## Cuándo se activa

Label `needs-planning` en un issue.

## Qué hace

1. Lee el issue body (busca findings/análisis)
2. Transforma cada finding → criterio verificable
3. Actualiza el issue con `## Acceptance Criteria`
4. Swap labels: `needs-planning` → `claude`

## Quién lo usa

Cualquier workflow que produzca findings:
- `skill-review.yml` → audita skills, genera findings
- `daily-standup.yml` → analiza actividad, genera findings
- (futuros workflows)

## Dónde está documentado

- `.github/prompts/planning.md` — instrucciones para el agente
- `packages/github/planning.md` — arquitectura del loop

## El loop completo

```
Trigger (schedule, manual)
       ↓
   Análisis
       ↓
[needs-planning]
       ↓
 Planning Mode → Acceptance Criteria
       ↓
    [claude]
       ↓
Execution Mode → branch + commits
       ↓
   Auto-PR
       ↓
  👤 Merge
       ↓
  next.yml → ¿más items? → [claude] (loop)
                 ↓ no
            Close issue
```

## Principio clave

Planning es agnóstico del origen. Solo necesita findings para funcionar.
