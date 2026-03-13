# Syner Apps — Role Definitions

Date: 2026-03-12

---

## syner.md — Context Engineer

El agente que controla todo el conocimiento del ecosistema. Es quien sabe qué saben los demás. Sin syner.md, los otros agentes trabajan a ciegas.

**Vaults** — organiza conocimiento en colecciones estructuradas. Un vault por proyecto, por equipo, por tema. Cada vault es un conjunto de archivos markdown.

**Markdown como formato base** — todo el conocimiento pasa por markdown. Legible por humanos, parseable por máquinas, versionable en git, universal.

**Convierte skills** — recibe cualquier fuente (un MCP server, un workflow, una API, documentación) y genera un SKILL.md estandarizado que cualquier agente del ecosistema puede consumir.

**Distribuye contexto** — cuando otro agente necesita información para hacer su trabajo, syner.md se la entrega. syner.design necesita el brief del proyecto, syner.md se lo da. syner.bot necesita saber qué agentes existen, syner.md se lo da.

**Genera** — conocimiento estructurado. Notas, docs, SKILL.md, contexto enriquecido.

**En la práctica es RAG con opinión** — tiene estructura (vaults, relaciones, frescura) en vez de solo embeddings planos, pero el patrón es retrieval-augmented generation.

### Stack
- Storage: Vercel Blob (archivos md) + KV/Postgres (índice, búsqueda)
- Sigue osprotocol (context → action → verification)
- Cliente de syner.dev
- Tiene su propio SKILL.md
- Reemplazable por Obsidian, Notion, o cualquier implementación que siga osprotocol

---

## syner.bot — Conversational Interface

La cara del ecosistema. Donde el humano habla y donde syner escucha. No piensa por los demás agentes — rutea, presenta, y recoge input.

**Chat-sdk** — construido sobre Vercel AI SDK. Streaming, tool calling, multi-provider. La base conversacional.

**Routing** — recibe un mensaje del usuario y decide a qué agent skill va. Un channel de Slack apunta a un agente. syner.bot sabe cuál es cuál y manda el mensaje donde corresponde.

**Adaptador de plataformas** — Slack, Discord, Telegram, web. syner.bot abstrae la plataforma. Los agent skills no saben si el usuario habló desde Slack o desde syner.app. Solo reciben el mensaje.

**Recoge input** — cuando un agente necesita aprobación, clarificación, o decisión del humano, syner.bot es quien pregunta y devuelve la respuesta al agente que la pidió. Interfaz bidireccional — membrana, no solo inbox.

**Presenta resultados** — cuando un agente termina su trabajo, syner.bot formatea y entrega el output al usuario en la plataforma donde está. Formatear para Slack es distinto que para web — esa traducción es trabajo real.

**Genera** — conversaciones, briefs, respuestas. Su output es comunicación.

### Stack
- Vercel AI SDK / chat-sdk
- Slack API, Discord API, webhooks por plataforma
- Sigue osprotocol (context → action → verification)
- Cliente de syner.dev
- Tiene su propio SKILL.md
- Reemplazable por cualquier interfaz conversacional que siga osprotocol

---

## syner.dev — SDK/Framework

La infraestructura que le da vida a todos los agentes. No es un agente — es lo que hace posible que los agentes existan, corran, se comuniquen y se mejoren. Todos son sus clientes.

**Runtime** — Vercel Functions. Cada agente corre acá. syner.dev provee el entorno de ejecución para que los agent skills procesen requests y generen outputs.

**Workflows durables** — Vercel Workflows. Tareas largas que sobreviven crashes, deploys, timeouts. Cuando un agente necesita un proceso de múltiples pasos que toma minutos u horas, Workflows lo sostiene.

**Message bus** — Vercel Queues. Cómo los agentes se pasan trabajo entre sí. Asíncrono, con retries, at-least-once delivery.

**Discovery** — expone `/agent/xxx` por instancia. Cada agente registrado es accesible via su endpoint. Sin registry centralizado — la instancia misma es el registry.

**Sandbox** — entorno seguro para ejecutar código de agentes, especialmente de terceros.

**BYOK** — Bring Your Own Keys (API keys de LLMs) y Bring Your Own Vercel Account. Cada persona deploya su propia instancia. Su data, su compute, su billing.

**Scaffolding** — `npx create-syner-agent` genera un agent skill con SKILL.md template listo para deployar.

**Self-development** — cuando un agente quiere mejorarse, le pide a syner.dev. syner.dev recibe la petición, genera los cambios, deploya la nueva versión.

**AI SDK** — Vercel AI SDK integrado. Multi-provider, streaming, tool calling disponible para cualquier agente que corra sobre syner.dev.

**Genera** — agentes, scaffolding, deploys, mejoras. syner.dev genera la infraestructura que los demás necesitan para existir.

### Escalera para terceros
1. **Skill agent** → SKILL.md + una función. Un archivo y un comando. Barrera mínima.
2. **Tool agent** → compone skills, tiene estado via Workflows/Durables.
3. **App agent** → ciudadano completo del ecosistema. syner.algo.

### Stack
- Vercel Functions + Workflows + Queues + Blob + KV + Postgres
- Vercel AI SDK
- Sigue osprotocol (context → action → verification)
- Tiene su propio SKILL.md
- Reemplazable por otra implementación (Cloudflare, AWS, etc) que siga osprotocol
- Vendor lock-in contenido aquí — osprotocol es agnóstico

### v1 constraints (Vercel)
- Tasks under 13 minutes (800s function limit)
- ~hundreds of concurrent agents (Workflow scaling wall at ~1000)
- US-only sandbox (iad1)
- BYOK team-scoped (workaround needed for per-user)

---

## syner.design — Visual Coherence Guardian

El agente que asegura que todo se vea como parte del mismo sistema. No es "el que diseña" — los skills generan, syner.design valida y ajusta.

**Design system as a service** — tokens, colores, tipografía, spacing. Mantiene la consistencia visual del ecosistema. Lo que hace que todo se vea como parte de lo mismo.

**UI validation** — cuando un skill genera una interfaz, syner.design verifica que siga el sistema. Ajusta lo que no encaja.

**Assets** — genera imágenes, íconos, ilustraciones. Lo visual que no es código.

**Prototyping** — antes de que syner.dev ejecute, syner.design puede mostrar cómo se va a ver. Previews rápidos que el usuario aprueba desde syner.bot.

**Slides y material** — presentations, decks, material educativo visual. El equipo construye slides desde Slack a través de syner.bot → syner.design.

**Genera** — UI validada, assets, design tokens, prototipos, presentaciones. Su output es todo lo que tiene forma visual y es coherente con el sistema.

### Stack
- Por definir — podría apoyarse en v0 (Vercel), generación de imágenes via AI SDK, frameworks de design tokens
- Sigue osprotocol (context → action → verification)
- Cliente de syner.dev
- Tiene su propio SKILL.md
- Reemplazable por cualquier agente visual que siga osprotocol

---

## syner.app — Syner OS

La capa de presentación de syner. Lo que el usuario final toca. La experiencia unificada donde todo el trabajo de los demás agentes se hace visible e interactivo. Si syner.bot es la boca, syner.app es el escenario completo.

**Dashboard** — vista unificada de lo que está pasando en tu instancia de syner. Qué agentes tienes, qué están haciendo, qué han producido.

**Renderiza outputs** — lo que syner.design diseñó, lo que syner.md documentó, lo que cualquier agent skill generó. syner.app lo presenta al usuario de forma consumible.

**Chat embebido** — syner.bot puede vivir dentro de syner.app. No necesitas ir a Slack si no quieres — syner.app tiene la interfaz conversacional integrada.

**Configuración** — donde el usuario configura su instancia. Qué agentes tiene activos, sus API keys (BYOK), qué channels de Slack apuntan a qué agentes, preferencias.

**Onboarding** — el botón de "Deploy tu propio syner". La puerta de entrada para usuarios no-técnicos. Un click, conecta tu Vercel account, listo.

**Marketplace visual** — no es un registry centralizado, pero syner.app puede mostrar agent skills conocidos que el usuario puede agregar a su instancia apuntando a sus URLs. Discovery por exposición, no por protocolo.

**Genera** — experiencias, vistas. La capa donde todo se une para el humano.

### Stack
- Next.js sobre Vercel
- Consume a todos los demás agentes via `/agent/xxx`
- Sigue osprotocol (context → action → verification)
- Cliente de syner.dev
- Tiene su propio SKILL.md
- Reemplazable por cualquier frontend que siga osprotocol

---

## osprotocol — The Contract

The non-replaceable protocol layer. Defines how agents execute, not what they execute.

**Core loop:** `context → action → verification`

**Defines:**
- System interfaces (agent-agnostic, no Vercel verbs, no framework coupling)
- How SKILL.md files are written
- How agents communicate
- Pre-conditions, expected effects, verification assertions, rollback/escalation

**Key property:** Not modifiable by any app in the stack. The judge that cannot be bribed.

**Positioning:** Sits in the execution/runtime layer that MCP, A2A, ANP, and AGNTCY do not cover. Composes with all of them — does not compete.

**Domain:** osprotocol.dev

### Resolved: Self-development gate

**Respuesta: Agente supervisor.**

En etapas tempranas, el supervisor es el humano (Ronny). Cada decisión de aprobación/rechazo se documenta — el patrón de decisiones se convierte en el training data del agente supervisor futuro.

El path es:
1. **Hoy** — humano revisa y documenta sus decisiones (por qué aprobó, por qué rechazó, qué priorizó)
2. **Mañana** — las decisiones documentadas forman un corpus de juicio. Patrones emergen.
3. **Después** — un agente supervisor se entrena/configura con ese corpus. El humano pasa de ejecutor a auditor.

Esto resuelve la tensión: no es el agente evaluándose a sí mismo (reward hacking), no es el humano como bottleneck permanente (no escala), y no es un evaluador automático sin criterio (diverge). Es un supervisor que aprende del humano y eventualmente lo reemplaza en las decisiones rutinarias.

osprotocol define: las categorías de cambio (skill tweak vs. nuevo skill vs. cambio estructural), qué métricas debe superar cada categoría, y que el supervisor es una entidad separada del agente evaluado.

### Resolved: Discovery

**Respuesta: El agente decide cómo quiere ser descubierto.** Discovery es auto-presentación, no catálogo.

**Dos capas:**

1. **El agente individual** decide cómo presentarse (SKILL.md público, Agent Card, o privado).
2. **La instancia** (cada persona instala su propio syner) se presenta como una sola entidad hacia afuera. Decide qué skills expone y cuáles son privados. Desde afuera, una instancia de syner es un agente más — un equipo con un solo punto de contacto.

osprotocol define: el formato de auto-descripción (SKILL.md), cómo una red de agentes se presenta como entidad única (instancia como agente). Cómo y dónde publica es decisión del agente.

Ver [decisions.md](decisions.md) DEC-002 para contexto completo.

---

## syner — The Emergent Property

Not a process. Not a daemon. Not a router.

Syner is what emerges when autonomous apps collaborate under osprotocol. There is no "syner service" running. There are apps following a shared contract, and the user experiences the collaboration as a unified system.

**Today:** `/syner` is an explicit router (skill). This is a stepping stone, not the destination.

**Future:** The router dissolves. Each app knows how to find and collaborate with others via osprotocol. The orchestration is distributed, not centralized.
