# El patrón observe-cheap, promote-expensive

2026-03-09

---

Acabo de usar `/design-grow-specialist observe` por primera vez y el patrón es elegante.

## La idea

No intentes definir especialistas desde cero. Observa decisiones reales donde faltó criterio, deja que los patrones emerjan, y solo entonces crea algo.

```
Observar = gratis, hazlo siempre
Proponer = barato, cuando hay patrón
Graduar = caro, requiere evidencia
Promover = muy caro, requiere impacto probado
```

## Por qué funciona

Los especialistas genéricos (agency-*) son útiles pero no conocen:
- El stack específico (Next.js + shadcn + @syner/ui)
- Las decisiones ya tomadas (por qué MinimalBackground es variante y no prop)
- El contexto del proyecto

Un especialista evolucionado sí lo sabe porque nació de observaciones reales.

## Conexión con PKM

Es el mismo principio que `/syner-grow-note`:
- Captura barato (daily notes, observations)
- Promueve caro (cuando hay sustancia)

El conocimiento no se diseña, se destila.

---

*Pendiente: ver si este patrón aplica a otros dominios (dev, notes, bot)*
