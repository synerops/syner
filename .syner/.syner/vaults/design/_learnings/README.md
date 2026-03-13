# Design Learnings

Conocimiento operacional para el agente `design`.

## Propósito

Este vault contiene criterios, patrones y decisiones que el agente design debe conocer al dar recomendaciones. No son reflexiones personales — son reglas destiladas de experiencia real.

## Estructura sugerida

```
_learnings/
├── component-patterns.md    # Cuándo crear variante vs extender vs componer
├── decision-criteria.md     # Criterios para trade-offs comunes
├── stack-specifics.md       # Particularidades de Next.js + shadcn + @syner/ui
└── anti-patterns.md         # Qué evitar y por qué
```

## Cómo llega contenido aquí

1. Observación repetida (`/design-grow-specialist observe`)
2. Reflexión madura en `notes/_design/`
3. Promoción vía `/syner-grow-note`
4. Se mueve aquí cuando es operacional

## Convención

- Archivos que empiezan con `_` son drafts
- Sin `_` = conocimiento validado que el agente puede citar
