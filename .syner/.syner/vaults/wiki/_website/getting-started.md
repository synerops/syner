# Comenzando con Syner

Syner es tu orquestador personal de agentes. Entiende tu contexto a través de notas en markdown y coordina especialistas para ejecutar tareas.

## La Idea Simple

Tú piensas, Syner ejecuta.

```
Tú (intención)
  ↓
Syner (orquestador)
  ↓
Leads (coordinan especialistas)
  ↓
Especialistas (ejecutan)
```

## Cómo Funciona

### 1. Tú Tienes un Orquestador

**Syner** es tu punto de entrada. No hace todo — sabe a quién delegar.

Cuando le pides algo, Syner:
1. Entiende qué necesitas
2. Carga contexto de tus notas (si es relevante)
3. Delega al lead apropiado
4. Verifica el resultado

### 2. Los Leads Coordinan Especialistas

Hay 4 leads, cada uno con su equipo:

| Lead | Dominio | Especialistas |
|------|---------|---------------|
| **dev** | Ingeniería + Testing | 19 especialistas |
| **design** | Diseño + Spatial/XR | 15 especialistas |
| **bot** | Marketing + Soporte | 17 especialistas |
| **notes** | Producto + PM | 11 especialistas |

### 3. Los Especialistas Son 71 Agentes

Vienen de [agency-agents](https://github.com/msitarzewski/agency-agents) y están en tu máquina en `~/.claude/agents/`.

Ejemplos:
- `agency-eng-frontend-developer` — React, Vue, performance
- `agency-design-ux-architect` — CSS systems, layout
- `agency-mkt-growth-hacker` — User acquisition
- `agency-prod-sprint-prioritizer` — Backlog, planning

## Cómo Usarlo

### Forma Simple: Habla con Syner

```
"Revisa este componente React"
```

Syner → delega a dev → dev activa frontend + security + accessibility

### Forma Directa: Habla con el Lead

```
"Hey dev, necesito optimizar performance"
```

Dev activa los especialistas relevantes directamente.

### Forma Específica: Activa un Especialista

```
"Activate agency-test-accessibility-auditor"
```

El especialista se activa y trabaja en el contexto actual.

## Qué Puedes Pedir

| Tipo de Tarea | Quién Responde |
|---------------|----------------|
| "Revisa este código" | dev → especialistas de engineering/testing |
| "Revisa esta UI" | design → especialistas de UX/UI |
| "Prepara un lanzamiento" | bot → especialistas de marketing |
| "Planifica el sprint" | notes → especialistas de producto/PM |
| "Investiga X" | syner-researcher (web o vault) |
| "Contexto sobre Y" | notes (lee tus notas) |

## El Flujo Típico

1. **Tú:** "Necesito agregar dark mode"
2. **Syner:** Entiende que es diseño + código
3. **Design:** Activa UX Architect + UI Designer
4. **Dev:** Activa Frontend + Accessibility
5. **Resultado:** Guía de implementación + consideraciones

## Tus Notas Son el Contexto

Syner lee tus notas para entenderte:
- Qué estás trabajando
- Tu estilo de código
- Tus preferencias
- Tu contexto actual

No necesitas explicar todo cada vez. Syner ya sabe.

## Resumen

| Concepto | Qué Es |
|----------|--------|
| **Syner** | Orquestador principal |
| **Leads** | 4 coordinadores por dominio |
| **Especialistas** | 71 agentes con expertise profunda |
| **Vaults** | Tus notas = tu contexto |
| **Skills** | Capacidades invocables con /nombre |

---

## Próximos Pasos

1. Prueba: "Hey syner, qué especialistas tienes disponibles?"
2. Lee: `apps/notes/vaults/agents/agency-agents.md` para la lista completa
3. Experimenta: Pide algo y observa cómo delega
