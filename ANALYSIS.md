# Análisis: Syner Skills vs Top Skills del Ecosistema

**Objetivo**: Identificar patrones en los skills más usados del ecosistema, contrastarlos con los principios de [Context Engineering de Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), y proponer mejoras estructurales para Syner.

---

## 1. Skills Analizados

| Skill | Autor | Enfoque |
|-------|-------|---------|
| [find-skills](https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md) | Vercel | Descubrimiento e instalación de skills |
| [vercel-react-best-practices](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | Vercel | 57 reglas de optimización React/Next.js |
| [remotion-best-practices](https://github.com/remotion-dev/skills/blob/main/skills/remotion/SKILL.md) | Remotion | 35+ reglas para video en React |
| [frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | Anthropic | Diseño de interfaces production-grade |
| [skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) | Anthropic | Meta-skill: crear y optimizar skills |

---

## 2. Patrones Encontrados en los Top Skills

### Patrón 1: Progressive Disclosure (Divulgación Progresiva)

Todos los top skills implementan un sistema de carga en 3 niveles:

```
Nivel 1: Metadata (name + description)  →  ~100 tokens, siempre en contexto
Nivel 2: SKILL.md body                  →  <500 líneas, se carga al activar
Nivel 3: references/rules/ directories  →  bajo demanda, solo lo necesario
```

**Remotion** lo hace explícitamente:
> "When dealing with captions or subtitles, load `./rules/subtitles.md`"
> "When needing to visualize audio, load `./rules/audio-visualization.md`"

**Vercel React** tiene 57 reglas pero el SKILL.md solo muestra una tabla de referencia rápida. El detalle vive en archivos individuales (`rules/async-parallel.md`, `rules/bundle-barrel-imports.md`).

**Anthropic skill-creator** lo formaliza:
> "Keep SKILL.md under 500 lines; use bundled resources for the rest"
> "Reference files clearly from SKILL.md with guidance on WHEN to read them"

**Principio de Context Engineering que lo respalda:**
> "Good context engineering means finding the **smallest possible set of high-signal tokens** that maximize the likelihood of some desired outcome."
>
> El contexto es finito. Cargar todo upfront causa **context rot**: a más tokens, menor capacidad del modelo para recordar información relevante.

### Patrón 2: Conditional Context Loading (Carga Condicional)

Los top skills no cargan todo su conocimiento de golpe. Usan **señales del contexto actual** para decidir qué cargar.

**Remotion**: "When dealing with FFmpeg → load ffmpeg.md. When dealing with 3D → load 3d.md"

**Vercel React**: Categorías por prioridad (CRITICAL → LOW), el agente prioriza qué reglas consultar.

**Anthropic** implementó el **Tool Search Tool** para esto:
> "Claude searches for 'github', and only relevant tools get loaded—not your other 50+ tools."

Esto es análogo: los skills deberían tener un índice que permite al agente cargar solo la parte relevante.

### Patrón 3: Impact Ratings y Priorización

**Vercel React** asigna impacto a cada categoría:

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Eliminating Waterfalls | CRITICAL |
| 2 | Bundle Size | CRITICAL |
| 3 | Server-Side | HIGH |
| 8 | Advanced Patterns | LOW |

Esto le dice al agente: "si tienes poco contexto restante, prioriza las reglas CRITICAL."

**Principio de Context Engineering:**
> "Be thoughtful and keep your context **informative, yet tight**."

### Patrón 4: Ejemplos Concretos sobre Reglas Exhaustivas

**Frontend-design** no dice "usa buenos fonts". Muestra anti-patrones vs patrones buenos:

> **Anti-patrón**: Inter, Roboto, Arial, system fonts, purple gradients on white
> **Patrón**: "Distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices paired thoughtfully"

**Vercel React** en cada regla tiene:
- Incorrect code example + explanation
- Correct code example + explanation

**Anthropic skill-creator** lo formaliza:
> "Curate a set of diverse, canonical examples that effectively portray the expected behavior — don't stuff a laundry list of edge cases."

**Principio de Context Engineering:**
> "Show 3-5 great examples versus exhaustive rule lists."

### Patrón 5: Explain the "Why", no Heavy-Handed MUSTs

**Anthropic skill-creator** es explícito:
> "Try hard to explain the **why** behind everything. Today's LLMs are smart. If you find yourself writing ALWAYS or NEVER in all caps, that's a yellow flag — reframe and explain the reasoning."

**Frontend-design** explica por qué cada decisión de diseño importa:
> "Dominant colors with sharp accents **outperform** timid, evenly-distributed palettes" — no dice "ALWAYS use dominant colors".

**Principio de Context Engineering:**
> "Present ideas at the right altitude — the Goldilocks zone between hardcoded brittle logic and vague high-level guidance."

### Patrón 6: Description como Mecanismo de Triggering

**Anthropic skill-creator** dedica una sección entera a optimizar descriptions:
> "The description field is the **primary mechanism** that determines whether Claude invokes a skill. Make descriptions a little bit 'pushy'."

Ejemplo que dan:
> Malo: "How to build a dashboard"
> Bueno: "How to build a dashboard. **Make sure to use this skill whenever the user mentions dashboards, data visualization, internal metrics**, even if they don't explicitly ask for a 'dashboard.'"

---

## 3. Análisis de Syner vs Estos Patrones

### Lo que Syner hace bien

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Filosofía clara (PHILOSOPHY.md) | Sólido | "Suggest don't enforce", "Context not data extraction" |
| Patrón orchestrator-workers | Sólido | syner → specialists → syner-worker |
| Fork context para aislamiento | Sólido | `context: fork` en skills complejos |
| Deduplicación via note-conventions.md | Sólido | Evita copiar 22 líneas en 5 skills |
| Tool usage explícito | Sólido | Nombra herramientas específicas (Glob, Read, Grep) |
| Verification loops | Sólido | Action → Verify → Repeat en syner-worker |
| Frontmatter completo | Sólido | tools, context, agent, metadata |

### Gaps Identificados

#### Gap 1: No hay Progressive Disclosure

**Estado actual**: Todo el contenido del skill está en SKILL.md. No hay `rules/` ni `references/` directories.

**Ejemplo**: `syner-find-ideas` tiene 8 pasos de instrucciones directamente en el SKILL.md. Si el skill creciera (ej: tips para encontrar ideas en dominios específicos), todo iría al mismo archivo.

**Impacto**: Para skills simples (como los actuales de Syner) no es problema todavía. Pero el diseño no escala. Y más importante: el artículo de context engineering dice que incluso skills cortos se benefician de separar el índice de los detalles.

**Justificación (Context Engineering)**:
> "Keep SKILL.md under 500 lines. If approaching this limit, add hierarchy with clear pointers."
> "Claude reads only the relevant reference file."

#### Gap 2: No hay Conditional Context Loading

**Estado actual**: Los skills de notas siguen un patrón lineal: "Glob all → Read all → Analyze all". No hay lógica de "si el usuario pregunta sobre X, carga Y".

**Ejemplo**: `syner-load-all` carga TODAS las notas. Si el vault crece a 100+ archivos, esto consume contexto innecesariamente.

**Comparación**: Remotion nunca carga sus 35+ archivos de reglas. Solo carga el relevante al contexto actual.

**Justificación (Context Engineering)**:
> "Context rot: as tokens increase, the model's ability to accurately recall information decreases."
> "Three techniques: **compaction** (summarize), **structured notes** (external memory), **sub-agents** (isolated context)."

#### Gap 3: Faltan Ejemplos Concretos (Input → Output)

**Estado actual**: Los skills tienen `## Usage` con invocaciones (`/syner-find-ideas developer-tools`) pero no muestran qué output esperar. No hay pares input/output.

**Ejemplo**: ¿Qué produce `/syner-find-links meditation productivity-systems`? El skill define la estructura de output pero no muestra un ejemplo concreto que el agente pueda imitar.

**Comparación**: Vercel React tiene para CADA regla: código incorrecto → por qué es malo → código correcto → por qué funciona.

**Justificación (Context Engineering)**:
> "Curate a set of diverse, canonical examples. Show 3-5 great examples versus exhaustive rule lists."

#### Gap 4: Los "Why" están Ausentes

**Estado actual**: Las instrucciones son procedurales. "1. Locate. 2. Glob. 3. Read. 4. Analyze."

**Ejemplo en syner-find-ideas**:
> "5. Analyze all notes and extract idea seeds: Problems the user has complained about, Inefficiencies..."

No dice POR QUÉ buscar problemas y frustraciones. Un LLM inteligente entiende mejor si le dices: "Las mejores ideas de startup vienen de problemas que el founder ha vivido en carne propia (founder-market fit). Busca señales de frustración porque ahí está la motivación auténtica."

**Comparación**: Anthropic skill-creator explica el razonamiento detrás de cada instrucción.

**Justificación (Context Engineering)**:
> "Present ideas at the right altitude. If you find yourself writing ALWAYS/NEVER in all caps, reframe and explain the reasoning."

#### Gap 5: Descriptions No Son "Pushy" para Triggering

**Estado actual**: Las descriptions de Syner son descriptivas pero pasivas.

**Ejemplo actual** (`syner-find-ideas`):
> "Generate startup ideas from your vault. Synthesize your unique knowledge..."

**Versión mejorada siguiendo el patrón del skill-creator**:
> "Generate startup ideas from your vault. Synthesize your unique knowledge... **Use this skill whenever the user mentions wanting to build something, exploring ideas, looking for opportunities, brainstorming projects, or says things like 'what should I build', 'I have an idea', or 'what could I do with X'.**"

**Justificación (Context Engineering / Skill Creator)**:
> "Currently Claude has a tendency to 'undertrigger' skills. To combat this, make descriptions a little bit 'pushy'."

#### Gap 6: No hay Anti-Patrones Documentados

**Estado actual**: `syner-enhance-skills` tiene algunos anti-patrones en su checklist, pero los skills individuales no documentan qué NO hacer.

**Ejemplo**: `syner-grow-note` dice "Draft the graduated document" pero no dice "Don't restructure the user's original note. Don't add metadata fields. Don't enforce a template the user didn't ask for."

**Comparación**: Frontend-design tiene una sección explícita de anti-patrones.

---

## 4. Propuesta: Estructura Mejorada para Syner Skills

### 4.1 Estructura de Directorio

```
skills/
└── syner-find-ideas/
    ├── SKILL.md              # Índice + instrucciones core (<200 líneas)
    ├── references/
    │   ├── idea-patterns.md  # Patrones de búsqueda de ideas con ejemplos
    │   └── scoring.md        # Criterios de scoring con justificación
    └── examples/
        └── sample-output.md  # Ejemplo concreto de output esperado
```

Solo los skills que lo necesiten. Los skills simples pueden mantenerse como están (solo SKILL.md). La estructura escala cuando el skill crece.

### 4.2 SKILL.md Mejorado (Template Propuesto)

```yaml
---
name: syner-find-ideas
description: >
  Generate startup ideas from your vault. Synthesize your unique knowledge,
  experiences, and observations into actionable startup or project ideas.
  Use when the user wants to explore what to build, brainstorm projects,
  find opportunities in their knowledge, or says things like "what should
  I build", "I have an idea for...", or "what could I do with X".
metadata:
  author: syner
  version: "2.0"
---

# Syner Find Ideas

Mine your notes for startup and project ideas by finding problems you've
lived, inefficiencies you've observed, and knowledge combinations only
you have.

## Why This Works

The best startup ideas come from founder-market fit — problems you've
experienced firsthand. Your notes are a record of your authentic
frustrations, observations, and expertise. This skill looks for those
signals because ideas grounded in personal experience have higher
conviction and lower risk of building something nobody wants.

## How to Read Notes

Follow conventions in `skills/syner/note-conventions.md`.

## Instructions

1. Locate `apps/notes/content/` from the project root
2. Use `Glob` to find all `.md` files; read `index.md` first per folder
3. Scan for idea seeds:
   - Problems complained about (frustration = motivation)
   - "Someone should build..." moments (validated demand)
   - Unique knowledge intersections (unfair advantage)
   - Workflows hacked together (underserved need)
4. Cross-reference with user's skills and interests
5. Score ideas — for scoring criteria, load `references/scoring.md`
6. Generate ideas that leverage their unfair advantages

## Anti-Patterns

- Don't invent ideas unrelated to the user's notes — every idea must trace back to specific notes
- Don't suggest generic "AI wrapper" ideas without a specific user insight backing them
- Don't add structured metadata to notes (PHILOSOPHY.md: no enforced schema)

## Example

**Input**: `/syner-find-ideas developer-tools`

**Output**:
- **Idea**: CLI tool that auto-generates llms.txt from API docs
- **Origin**: Notes on llms.txt frustration + experience building syner skills
- **Why You**: You've built 12 skills that consume docs — you know what's missing
- **First Step**: Script that converts one OpenAPI spec to llms.txt
- **Risk**: Assumption that llms.txt becomes a standard (check adoption)

## Output Format

For each idea:
- **Idea**: One-line description
- **Origin**: Which notes/insights led here
- **Why You**: Your unfair advantage
- **First Step**: Smallest possible validation
- **Risk**: Main assumption to test

## Usage

/syner-find-ideas [optional: focus area or constraint]
```

### 4.3 Cambios Clave vs Estructura Actual

| Aspecto | Antes | Después | Justificación |
|---------|-------|---------|---------------|
| Description | Descriptiva pasiva | Pushy con trigger phrases | Skill-creator: "combat undertriggering" |
| Why section | Ausente | Explica la lógica del skill | Context Eng: "right altitude" |
| Anti-patterns | Ausente | Documenta qué no hacer | Frontend-design pattern |
| Examples | Solo Usage commands | Input/Output concretos | Context Eng: "3-5 examples > rules" |
| References dir | Todo inline | Detalles en archivos separados | Remotion/Vercel pattern + Context Eng: "smallest token set" |
| Instructions | Procedural (1,2,3...) | Procedural + razón entre paréntesis | Skill-creator: "explain the why" |

### 4.4 Conditional Loading para syner-load-all

El skill más impactado es `syner-load-all`. Propuesta:

```markdown
## Instructions

1. Locate `apps/notes/content/`
2. Use `Glob` to discover all `.md` files
3. Read `index.md` files first to build a topic map
4. **Selective Loading** based on the orchestrator's request:
   - If the request mentions specific domains → load only those folders
   - If the request is broad ("what should I build?") → load index files + recently modified notes first
   - Only load ALL files if explicitly needed for comprehensive synthesis
5. Extract active focus, themes, and open loops
```

Esto reduce tokens consumidos y aplica directamente:
> "Compaction: summarize conversation history. The art lies in what to keep vs discard."

### 4.5 Priorización de Cambios

No todos los gaps tienen el mismo impacto. Orden recomendado:

| Prioridad | Cambio | Esfuerzo | Impacto |
|-----------|--------|----------|---------|
| 1 | Agregar "Why" sections a skills existentes | Bajo | Alto — mejora calidad de output del agente |
| 2 | Agregar ejemplos concretos (Input → Output) | Bajo | Alto — el agente imita ejemplos |
| 3 | Hacer descriptions más "pushy" | Bajo | Alto — mejora triggering |
| 4 | Agregar anti-patterns a skills clave | Medio | Medio — previene errores comunes |
| 5 | Implementar selective loading en syner-load-all | Medio | Alto cuando el vault crece |
| 6 | Crear `references/` dirs para skills que crezcan | Bajo | Futuro — escala el diseño |

---

## 5. Mapping: Principios de Context Engineering → Syner

| Principio | Cómo aplica a Syner | Estado Actual |
|-----------|---------------------|---------------|
| "Smallest set of high-signal tokens" | Selective loading en syner-load-all, progressive disclosure | Parcial (fork context sí, selective loading no) |
| "Right altitude (Goldilocks zone)" | Instructions ni demasiado rígidas ni demasiado vagas | Parcial (procedural sin "why") |
| "Curated examples > exhaustive rules" | Ejemplos Input/Output en cada skill | No implementado |
| "Minimal tool sets" | Tools field en frontmatter limita herramientas | Implementado |
| "Compaction for long-horizon tasks" | Resumir notas antes de sintetizar | No implementado |
| "Structured notes (external memory)" | note-conventions.md, PHILOSOPHY.md | Implementado |
| "Sub-agent architecture" | syner-worker, fork context, code-reviewer | Implementado |
| "Tool Search Tool (load on-demand)" | Skills se cargan bajo demanda vía orchestrator | Parcial (orchestrator sí, internal loading no) |
| "Context rot awareness" | Limitar cuánto contexto se carga | No implementado |

---

## 6. Conclusión

Syner tiene una base arquitectónica sólida: el patrón orchestrator-workers, fork context, filosofía clara, y deduplicación de boilerplate ya lo posicionan por encima de la mayoría de skills individuales.

Los gaps principales son de **contenido, no de arquitectura**:
- Falta explicar el "por qué" detrás de las instrucciones
- Faltan ejemplos concretos que el agente pueda imitar
- Las descriptions necesitan ser más agresivas para triggering
- La carga de contexto (especialmente notas) necesita ser selectiva

Estos cambios son de bajo esfuerzo y alto impacto. No requieren restructurar el proyecto — son mejoras incrementales a los SKILL.md existentes que alinean Syner con las mejores prácticas del ecosistema y los principios de context engineering.

---

**Sources**:
- [Effective Context Engineering for AI Agents - Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Vercel React Best Practices SKILL.md](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md)
- [Remotion Best Practices SKILL.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion/SKILL.md)
- [Anthropic Frontend Design SKILL.md](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)
- [Anthropic Skill Creator SKILL.md](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Vercel Find Skills SKILL.md](https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md)
