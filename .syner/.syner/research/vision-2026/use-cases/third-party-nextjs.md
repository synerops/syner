# Use Case: Un tercero integra su app Next.js

Date: 2026-03-12
Related: adoption-nextjs.md, architecture.md

## Escenario

Un developer tiene una app Next.js que genera facturas PDF. Quiere que sea discoverable como agente en el ecosistema syner.

## Sin osprotocol

El developer expone un API endpoint. Otros sistemas lo llaman con JSON. Si falta un campo, retorna 400. Si el PDF sale mal, nadie se entera. No hay forma estándar de saber qué hace la app, qué necesita, o si el resultado es correcto.

## Con osprotocol — paso a paso

### 1. SKILL.md — Context (auto-descripción)

El developer crea un archivo `SKILL.md` en la raíz de su proyecto:

```markdown
# Invoice Generator

I generate PDF invoices from structured data.

## I am for
Finance teams, accounting software, any agent that needs invoices.

## I am NOT
A payment processor. I don't handle money, cobros, ni transacciones.

## Inputs
- client_name (required)
- line_items (required, array of {description, amount})
- tax_rate (required, decimal)

## Outputs
PDF invoice with calculated totals.
```

Esto no es documentación decorativa — es el contrato de auto-presentación que osprotocol requiere. Cualquier agente que lea este SKILL.md sabe exactamente qué puede pedir y qué no.

### 2. withSyner() — Registro

```js
// next.config.js
import { withSyner } from '@syner/dev'
export default withSyner({ /* existing config */ })
```

Esto expone `/agent/invoice-generator` con el SKILL.md publicado en esa URL. Zero breaking changes en la app existente. La app sigue funcionando exactamente como antes — solo ganó un endpoint de discovery.

### 3. Route handler — osprotocol en acción

```typescript
// app/agent/route.ts
export async function POST(req) {
  // osprotocol: context → action → verification
}
```

Cuando otro agente lo invoca:

**Context:**
- "Me piden generar una factura"
- "Tengo: client_name='Acme Corp', 3 line items, tax_rate=0.21"
- "Mi SKILL.md dice que puedo hacer esto"
- "Verifico precondiciones: todos los campos requeridos presentes → sí"

**Action:**
- "Voy a generar un PDF"
- **Precondición:** todos los campos requeridos presentes ✓
- **Efecto esperado:** PDF válido con totales correctos

**Verification:**
- ¿El PDF se generó? Sí
- ¿Los totales cuadran? $1000 + $500 + $200 = $1700, tax $357, total $2057
- ¿Coincide con el PDF generado? Sí → **pasa**

### 4. Cuando falla — escalación

Si el request llega sin `tax_rate`:
- La **precondición** falla antes de ejecutar
- El agente **no genera nada** — no adivina
- Escala de vuelta al agente que lo invocó con: "me falta tax_rate, es requerido"
- El agente caller puede pedir el dato al usuario o usar un default

Esto es fundamentalmente distinto a un API que retorna `400 Bad Request`. osprotocol no solo dice "falló" — dice *qué falta*, *por qué no puede continuar*, y *qué necesita para intentar de nuevo*.

## La escalera de adopción

| Paso | Qué hace | Se convierte en | Tiempo |
|---|---|---|---|
| 1 | `npm install @syner/dev` + SKILL.md | **Skill agent** (discoverable, invocable) | 5 min |
| 2 | Agrega Queues para comunicación inter-agente | **Tool agent** (compone, tiene estado) | Horas |
| 3 | Colabora como par del ecosistema | **App agent** (ciudadano completo) | Días |

Cada paso agrega, nunca reemplaza. Como integrar Stripe: primero un botón de pago, después webhooks, después suscripciones. Nunca rompes lo que ya funciona.

## Por qué importa

El patrón replica las integraciones más exitosas del ecosistema web:

- Static website + Stripe = payments anywhere
- Next.js + next-auth = auth anywhere
- Code repo + GitHub Actions = CI anywhere
- **Next.js + @syner/dev + SKILL.md = agent anywhere**

La barrera de entrada es un archivo markdown y una línea en el config. El protocol hace el resto.

## Agentes involucrados

- **App del tercero** — invoice generator, ahora es un skill agent
- **Cualquier agente caller** — puede descubrirlo y usarlo vía osprotocol
- **syner.dev** — provee el runtime y el wrapper `withSyner()`

## Patrón osprotocol demostrado

**Progressive adoption with contract guarantees** — el SKILL.md es el contrato mínimo. La auto-descripción habilita discovery. El route handler implementa context → action → verification. La escalera de adopción permite ir de "discoverable" a "ciudadano completo" sin migración.
