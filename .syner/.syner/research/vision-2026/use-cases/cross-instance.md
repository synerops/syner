# Use Case: Cross-instance — tu syner habla con mi syner

Date: 2026-03-12
Related: decisions.md (DEC-002), osprotocol-positioning.md

## Escenario

El syner de Ana (marketing) necesita un design review del syner de Ronny (engineering/design).

Ana no sabe nada de vaults, tokens, ni internals de Ronny. Solo sabe que Ronny tiene un skill de design review porque él le pasó la URL.

## Sin osprotocol

Ana le manda un email a Ronny con screenshots. Ronny abre Figma, revisa, escribe feedback en un doc, se lo manda. Toma horas. Si Ronny no está disponible, no pasa nada hasta que vuelva.

Con agentes pero sin protocolo: el agente de Ana llama a un endpoint de Ronny. ¿Qué formato espera? ¿Cómo sabe que el review fue riguroso? ¿Cómo sabe que usó los tokens correctos? No hay contrato — solo esperanza.

## Con osprotocol — paso a paso

### 1. Discovery — el agente decide cómo ser descubierto (DEC-002)

- El syner de Ronny expone su instancia como un agente único hacia afuera
- Publica selectivamente: el skill de "design review" es público, los vaults son privados
- URL: `ronny.syner.app/agent/design-review`
- SKILL.md público describe: acepta screenshots, retorna feedback estructurado con sugerencias actionable

El syner de Ana conoce esta URL porque Ronny se la pasó — como pasar un link. No hay registry centralizado. Tu syner es tu sitio web, tus agentes son tus páginas.

### 2. El syner de Ana — Context

- "Tengo 3 mockups que el equipo de marketing generó"
- "Necesito design review externo"
- "Conozco el skill de design review en `ronny.syner.app/agent/design-review`"
- "Su SKILL.md dice: acepta screenshots PNG/JPG, máximo 10 por request, retorna feedback por screenshot"
- Precondiciones del SKILL.md del otro: ¿tengo screenshots? Sí. ¿Son menos de 10? Sí (3). → puedo invocar

### 3. Delegación (A2A entrega la tarea)

El syner de Ana envía la tarea al syner de Ronny:
- 3 screenshots adjuntos
- Contexto: "mockups para campaña de Q2, audiencia B2B"

**A2A hace la entrega. Aquí termina A2A.** Lo que pasa dentro del syner de Ronny es "opaque" para A2A — pero no para osprotocol.

### 4. Syner de Ronny — Context

- "Recibí 3 screenshots de una instancia externa"
- "Tengo los design tokens del sistema de Ronny cargados (colores, tipografía, spacing, componentes)"
- "El skill de design review está activo"
- "Contexto adicional: campaña Q2, audiencia B2B"

**No expone sus vaults al exterior.** Usa su contexto interno para evaluar, pero el output es el review, no los internals.

### 5. Syner de Ronny — Action

- "Voy a evaluar cada screenshot contra el design system"
- **Precondición:** screenshots legibles, tokens actualizados, skill activo
- **Efecto esperado:** feedback estructurado con issues y sugerencias por screenshot

### 6. Syner de Ronny — Verification

- ¿Evalué los 3 screenshots? Sí
- ¿Mi feedback es actionable? Verifico que cada punto tiene:
  - Qué está mal (issue)
  - Por qué (justificación contra el design system)
  - Cómo arreglarlo (sugerencia concreta)
- ¿Hay puntos vagos como "se ve mal"? No → **pasa**

### 7. Resultado de vuelta a Ana

El syner de Ronny retorna:

```markdown
## Screenshot 1 — Hero Section
- Issue: El heading usa 32px, el sistema define 36px para H1
- Sugerencia: Subir a 36px o usar H2 si es intencional

## Screenshot 2 — CTA Grid
- Issue: El spacing entre cards es 16px, el sistema usa 24px para grids
- Sugerencia: Ajustar gap a 24px
- Issue: Color del CTA button es #3B82F6, el sistema define #2563EB para primary
- Sugerencia: Usar el token --color-primary

## Screenshot 3 — Footer
- Sin issues. Sigue el design system correctamente.
```

Ana recibe feedback actionable sin haber sabido nada sobre los internals de Ronny.

### 8. El syner de Ana — Verification

- ¿Recibí feedback de los 3 screenshots? Sí
- ¿El formato es el que esperaba según el SKILL.md? Sí
- ¿Puedo entregarle esto al equipo de marketing? Sí → **completado**

## Por qué importa

**La instancia como agente** es la pieza clave de cross-instance. Desde afuera, el syner de Ronny es un solo agente con capacidades publicadas. Desde adentro, es un ecosistema completo con vaults, tokens, múltiples skills. osprotocol define ambas caras:

- **Hacia afuera:** SKILL.md como contrato, verification del output antes de retornar
- **Hacia adentro:** context → action → verification completo con acceso a internals

Esto habilita colaboración entre instancias sin:
- Exponer datos privados (vaults quedan internos)
- Depender de un registry centralizado (URLs como la web)
- Inventar un protocolo nuevo (A2A para entrega, osprotocol para ejecución)

## La analogía (DEC-002)

Tu syner es tu sitio web. Tus agentes son tus páginas.

- La web no tiene un registry centralizado de sitios → DNS y links
- Discovery es: alguien te pasa un link, o publicas para ser indexado
- Tu instancia = tu sitio
- Tus agentes = tus páginas
- Compartir = pasar una URL
- Privacidad = no publicar

No es una red mágica de agentes descubriéndose solos. Es personas que comparten sus URLs.

## Agentes involucrados

- **Syner de Ana** — invoca, recibe resultado, entrega al equipo
- **Syner de Ronny** — ejecuta design review con contexto interno
- **A2A** — transporte de la tarea entre instancias
- **osprotocol** — gobierna la ejecución dentro de cada instancia

## Patrón osprotocol demostrado

**Sovereign execution with public contracts** — cada instancia controla qué expone (SKILL.md público) y qué mantiene privado (vaults, tokens). osprotocol gobierna la ejecución interna con full context, mientras el output verificado es lo único que cruza la frontera. A2A hace la entrega; osprotocol hace el trabajo.
