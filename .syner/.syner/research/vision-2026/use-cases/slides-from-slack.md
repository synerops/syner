# Use Case: Slides desde Slack

Date: 2026-03-12
Related: architecture.md, syner-apps.md

## Escenario

Un usuario pide desde Slack: "hazme una presentación sobre nuestro Q1"

## Sin osprotocol

syner.bot recibe el mensaje, llama a syner.design, syner.design genera algo, se lo manda al usuario. ¿Funcionó? No sé. ¿Tenía el contexto correcto? No sé. ¿Las slides siguen el design system? Nadie verificó.

## Con osprotocol — paso a paso

### 1. syner.bot — Context

- "Tengo un mensaje del usuario: 'hazme una presentación sobre nuestro Q1'"
- "Sé que este channel de Slack está asociado al skill de presentaciones"
- "Necesito contexto de Q1 → se lo pido a syner.md"

### 2. syner.md — Context

- "Me piden contexto de Q1"
- "Tengo en vaults: métricas de ventas, OKRs, notas de planning"
- Declara qué cargó y qué no encontró

### 3. syner.md — Action

- "Voy a compilar un brief de Q1 con: métricas, highlights, objetivos"
- **Precondición:** los vaults de Q1 existen y están actualizados
- **Efecto esperado:** un brief markdown con datos verificables

### 4. syner.md — Verification

- ¿El brief tiene métricas? Sí
- ¿Las fechas son de Q1 y no de Q4? Sí
- ¿Falta alguna fuente que debería estar? No → **pasa**

### 5. syner.design — Context

- "Recibí un brief de Q1 de syner.md"
- "Tengo los design tokens actuales (colores, tipografía, spacing)"
- "El formato solicitado es presentación"

### 6. syner.design — Action

- "Voy a generar 8 slides siguiendo el design system"
- **Precondición:** brief completo, tokens cargados
- **Efecto esperado:** slides que pasan validación visual

### 7. syner.design — Verification

- ¿Los colores son del sistema? Sí
- ¿La tipografía es correcta? Sí
- ¿El contenido refleja el brief? Sí → **pasa**

### 8. syner.bot — Action

- "Voy a entregar las slides al usuario en Slack"
- **Precondición:** slides verificadas por syner.design
- **Efecto esperado:** archivo entregado, usuario notificado

### 9. syner.bot — Verification

- ¿El mensaje se envió? Sí
- ¿El archivo es accesible? Sí → **completado**

## Por qué importa

Cada paso tiene trazabilidad. Si las slides tienen colores incorrectos, sabes exactamente dónde falló la verificación. Sin osprotocol, el error se descubre cuando el usuario abre las slides y dice "esto no se ve bien" — sin forma de saber si fue el contexto, el diseño, o la entrega.

## Agentes involucrados

- **syner.bot** — recibe, rutea, entrega
- **syner.md** — compila contexto de Q1
- **syner.design** — genera slides con validación visual

## Patrón osprotocol demostrado

**Chain of verified handoffs** — cada agente recibe output verificado del anterior, ejecuta con precondiciones claras, y verifica antes de pasar al siguiente. La cadena completa es auditable.
