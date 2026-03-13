# Syner Plan - Marzo 2026

> Análisis honesto generado por syner-planner

## La Verdad

**Syner hoy es:** Un catálogo de prompts organizados en un monorepo. No es un producto. Es:
- 30 instrucciones markdown para Claude Code
- Un patrón de naming (`/syner-x-y`)
- 2 packages reales (@github, @vercel) que son wrappers thin
- 4 Next.js apps que solo existen para tener vaults
- Filosofía documentada que suena bien pero no se ejecuta sola

**Verificación:**
```
apps/notes/app/page.tsx: "Coming soon"
apps/bot/app/page.tsx: "Coming soon"
packages/github: ~200 LOC, auth token exchange
packages/vercel: ~300 LOC, wrappers
```

## Decisión Crítica

| Opción | Qué es | Tiempo | Valor |
|--------|--------|--------|-------|
| **A** | Herramienta personal para TI | 2-4 semanas | Altísimo para ti, cero para otros |
| B | Framework para que otros construyan | 4-8 semanas | Moderado |
| C | Producto SaaS | 3-6 meses | Alto si funciona, es un startup |

**Recomendación:** Opción A. Claro. Enfocado. Ya lo usas.

## Entregables (2-4 semanas, ~14h)

### 1. Persistent Agent State (3h) - P1
**Problema:** Skills no recuerdan decisiones previas.

**Solución:**
- `.syner/state/{skill}.json`
- Format: `{ lastRun, processed[], decisions{} }`
- Skill load antes, append después

**Verificable:** Backlog triager no re-triage items en segundo run.

### 2. Vault Search + Auto-Context (4h) - P1
**Problema:** `/syner-load-all` es overkill para queries pequeñas.

**Solución:**
- `/syner search <query>`
- Grep + fuzzy en vaults
- Auto-carga en siguiente prompt

**Verificable:** "what did I say about X" retorna la nota correcta.

### 3. Skill Quality Audit (5h) - P2
**Problema:** 30 skills, no sabes cuáles están rotos.

**Solución:**
- `/syner-audit-skills`
- Verifica paths, ejemplos, {TODO}s
- Report en `.syner/reports/skills-audit.md`

**Verificable:** Report lista status de cada skill.

### 4. Honest Architecture Doc (2h) - P2
- ARCHITECTURE.md single source of truth
- "This is a personal framework, not a product"

## NO Hacer

1. NO arregles UI de Next.js apps
2. NO hagas Syner "open source ready"
3. NO construyas backend serverless
4. NO agregues más skills (mejora los existentes)
5. NO diseñes UI nunca - vaults + CLI son tu UI

## Clarificaciones Pendientes

1. **Goal:** ¿Personal tool o framework para otros?
2. **Next.js apps:** ¿UI real algún día o solo vaults?
3. **Background agents:** ¿CLI manual, scheduled jobs, o serverless?

## Diferenciador Defendible

Después de estos entregables:

> "Personal AI agent framework where your notes ARE the database and CLI is the interface"

- Vault system con auto-discovery
- State persistence (no amnesia)
- Audit/quality automático
- Sin UI web, sin backend
- Todo local + GitHub API
