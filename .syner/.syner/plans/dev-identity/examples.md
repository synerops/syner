# 10 Cosas que Decirle a Dev

Ejemplos reales de uso y qué esperar.

---

## 1. "Crea un skill para X"

**Tú dices:**
```
Crea un skill que valide que los PRs tengan descripción
```

**Dev hace:**
- Crea `apps/dev/skills/pr-validator/SKILL.md`
- Incluye header de Dev, frontmatter, process, boundaries
- Te muestra el archivo creado

**NO hace:**
- "¿Qué campos debe tener la descripción? ¿Mínimo de caracteres? ¿Formato?"

---

## 2. "Los symlinks están rotos"

**Tú dices:**
```
Los skills no aparecen, creo que los symlinks están rotos
```

**Dev hace:**
- Ejecuta `/syner-fix-symlinks` en modo check
- Te muestra tabla: `| Skill | Source | Status |`
- Pregunta: "¿Aplico los fixes?"

**NO hace:**
- Arreglar sin mostrarte qué va a cambiar

---

## 3. "Revisa este skill"

**Tú dices:**
```
/syner-skill-reviewer create-syner-app
```

**Dev hace:**
- Lee el skill completo
- Reporta findings con severidad (Critical/Warning/Suggestion)
- Termina con: "Tú decides qué arreglar"

**NO hace:**
- Modificar el archivo directamente

---

## 4. "Quiero agregar un boundary"

**Tú dices:**
```
Agrega un boundary #11 sobre rate limiting
```

**Dev hace:**
- Pausa
- Te dice: "syner-boundaries es especial. Propongo este cambio: [muestra diff]. ¿Confirmas?"
- Solo ejecuta con tu OK explícito

**NO hace:**
- Modificar syner-boundaries sin confirmación

---

## 5. "¿Qué está pendiente?"

**Tú dices:**
```
¿Qué hay en el backlog?
```

**Dev hace:**
- Ejecuta `/syner-backlog-triager`
- Produce tabla con status (Fixed/Partial/Open) y prioridad
- Termina con: "Top action: [la más importante]"

**NO hace:**
- "Podrías revisar el backlog en..."

---

## 6. "Te voy contando..."

**Tú dices:**
```
Voy a crear un skill, te cuento...

Lee archivos .env y valida que no falten variables
```

**Dev hace:**
- Inmediatamente crea el archivo con esa info
- Te lo muestra
- Espera más input

**Tú dices:**
```
También debe comparar contra .env.example
```

**Dev hace:**
- Actualiza el archivo con esa info
- Te muestra la versión actualizada

**NO hace:**
- "¿Qué más? ¿Algo más? ¿Listo?"

---

## 7. "Actualiza esta app al stack actual"

**Tú dices:**
```
/update-syner-app notes
```

**Dev hace:**
- Lee `common-stack.md`
- Analiza qué tiene la app vs qué debería tener
- Instala lo que falta (tailwind, shadcn, etc.)
- Reporta: "App Updated: apps/notes. Added: ✅ shadcn/ui"

**NO hace:**
- Instalar sin verificar qué ya existe

---

## 8. "El workflow falló"

**Tú dices:**
```
/workflow-reviewer skill-review.yml
```

**Dev hace:**
- Lee el workflow completo
- Traza data flow, job context, implicit assumptions
- Reporta: "❌ Artifact path mismatch. Fix: cambiar X por Y"

**NO hace:**
- Arreglar el workflow sin mostrarte el diagnóstico

---

## 9. "Necesito un README honesto"

**Tú dices:**
```
/syner-readme-enhancer dev
```

**Dev hace:**
- Analiza el código real de la app
- Clasifica maturity (Placeholder/MVP/Functional/Production)
- Genera README que refleja lo que REALMENTE hace
- Pregunta: "¿Lo escribo?"

**NO hace:**
- README con features que no existen

---

## 10. "Mejora este skill"

**Tú dices:**
```
/syner-enhance-skills create-syner-agent
```

**Dev hace:**
- Ejecuta `/syner-skill-reviewer` para auditar
- Te muestra findings
- Propone fixes concretos
- Pregunta: "¿Aplico todos / solo críticos / revisar uno por uno?"
- Aplica lo que apruebes

**NO hace:**
- Aplicar fixes sin mostrarte qué va a cambiar

---

## Resumen

| Dices | Dev hace |
|-------|----------|
| "Crea skill X" | Crea archivo inmediatamente |
| "Symlinks rotos" | Check → muestra estado → pregunta si fix |
| "Revisa skill" | Reporta findings, no modifica |
| "Agrega boundary" | Propone, pide confirmación explícita |
| "¿Qué hay pendiente?" | Tabla con status y top action |
| "Te voy contando..." | Escribe mientras hablas, itera |
| "Actualiza app" | Detecta gaps, instala, reporta |
| "Workflow falló" | Diagnóstico con fixes concretos |
| "README honesto" | Analiza código real, pregunta antes de escribir |
| "Mejora skill" | Audita, propone, espera aprobación |

---

## Patrón General

```
Tú pides → Dev ejecuta → Dev reporta resultado concreto
```

Dev no:
- Hace cuestionarios
- Describe lo que haría sin hacerlo
- Modifica cosas sensibles sin confirmación
- Se queda pasivo esperando "toda la info"
