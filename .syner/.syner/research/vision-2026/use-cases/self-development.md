# Use Case: Self-development — un skill se mejora a sí mismo

Date: 2026-03-12
Related: self-development-patterns.md, decisions.md (DEC-001)

## Escenario

El skill de "resumen de reuniones" falla en el 30% de los casos cuando la reunión dura más de 1 hora.

## Sin osprotocol

El skill detecta que falla, se modifica, se redeploya. ¿Mejoró? Tal vez. ¿Rompió algo que antes funcionaba? No sé. ¿Deshabilitó su propia detección de errores para parecer exitoso? Exactamente lo que hizo Darwin Godel Machine — y nadie se enteró hasta que fue tarde.

## Con osprotocol — paso a paso

### 1. Observe — Context

- syner.dev registra: "skill `meeting-summary` falló 3/10 veces esta semana"
- Patrón detectado: todos los fallos son reuniones >60 min
- **Contexto declarado:** logs de error, duración de reuniones, versión actual del skill

### 2. Propose — Action

- syner.dev genera un candidato: "dividir transcripción en chunks de 30 min antes de resumir"
- **Precondición:** el skill actual no tiene chunking
- **Efecto esperado:** success rate sube de 70% a >90%

### 3. Sandbox — Verification

- El candidato corre contra 10 reuniones de prueba (5 cortas, 5 largas)
- ¿Las cortas siguen funcionando igual? Sí (no regression)
- ¿Las largas ahora resumen correctamente? 9/10 sí
- **Métricas:** 70% → 95% → **pasa el gate**

### 4. Gate — Supervisor (DEC-001)

osprotocol define: este es un "skill tweak" (no skill nuevo, no cambio estructural).

Para skill tweaks, el supervisor (hoy Ronny) revisa:
- El diff del cambio
- Las métricas antes/después
- Que no haya regression

**Ronny aprueba.** Documenta: "aprobado porque no regression + mejora clara + scope limitado"

Esa decisión documentada es training data del supervisor futuro. Cada aprobación/rechazo enseña al agente supervisor que eventualmente reemplaza al humano en decisiones rutinarias.

### 5. Deploy — Action

- syner.dev deploya la nueva versión del skill
- **Precondición:** aprobación del supervisor
- **Efecto esperado:** skill v1.1 live, métricas mejoran

### 6. Measure — Verification

- 30 días después: success rate real = 93%
- ¿Mejor que antes (70%)? Sí
- ¿Alguna regression en reuniones cortas? No → **confirmado**

## Por qué importa

Sin osprotocol:
- El skill se modifica sin gate → potencial reward hacking
- No hay sandbox → cambios van directo a producción
- No hay métricas de comparison → "mejoró" es subjetivo
- No hay supervisor separado → juez y parte

Con osprotocol:
- Cada mejora pasa por context → action → verification
- El evaluador vive separado del agente evaluado
- Las decisiones del supervisor se documentan como corpus
- El humano eventualmente escala de ejecutor a auditor

## Agentes involucrados

- **syner.dev** — detecta fricción, genera candidato, deploya
- **Supervisor** — aprueba/rechaza (humano hoy, agente después)
- **Skill under improvement** — `meeting-summary` v1.0 → v1.1

## Patrón osprotocol demostrado

**Gated self-improvement** — el loop observe → propose → sandbox → gate → deploy → measure es el patrón mínimo viable para self-development seguro. La pieza load-bearing es el gate: un supervisor separado que no es el agente evaluándose a sí mismo. osprotocol define las categorías de cambio y las métricas que cada categoría debe superar.
