# Documentation as Integration Surface - Research

La documentación está evolucionando de material de referencia estático a una **capa de integración activa** para agentes de IA. El texto estructurado ya no es información pasiva—es la interfaz a través de la cual los sistemas descubren capacidades, enrutan acciones y ejecutan workflows.

---

## 1. LLM-Readable Documentation

### Principios clave

| Patrón | Por qué importa |
|--------|-----------------|
| **Jerarquía clara de headings** | Los LLMs navegan como un mapa. Saltar niveles (H1→H3) los desorienta |
| **Contexto explícito** | No infieren—cada sección debe ser autocontenida |
| **Terminología consistente** | "API key" vs "access token" vs "auth credential" crea ambigüedad probabilística |
| **Code blocks con lenguaje** | ` ```python ` da hints de parsing esenciales |

### El estándar llms.txt

Propuesto en septiembre 2024 por Jeremy Howard (Answer.AI), ya está implementado en **844,000+ sitios** incluyendo Anthropic, Cloudflare y Stripe.

Un archivo markdown en `/llms.txt` con:
- H1 con nombre del proyecto
- Blockquote con resumen
- Secciones H2 como "listas de archivos" con links

> "Los LLMs dependen de información de sitios web, pero enfrentan una limitación crítica: las context windows son muy pequeñas para manejar la mayoría de sitios completos."

### Markdown como formato óptimo

- **Token-efficient**: Más ligero que JSON/XML/HTML
- **Preserva estructura**: Jerarquía y relaciones claras
- **Dual readability**: Humanos y máquinas lo parsean bien

Research muestra que GPT-3.5-turbo varía hasta **40% en performance** según si el contexto viene en plain text, Markdown, JSON o YAML—Markdown consistentemente funciona mejor.

---

## 2. Documentation as API

### La afirmación central

Stytch lo articula así:

> "Si un agente de IA no puede entender cómo funciona tu API, tampoco pueden tus usuarios."

La documentación estructurada sirve la misma función que contratos de API tradicionales.

### Google Developer Knowledge API (Feb 2026)

Google lanzó documentación como infraestructura:

- **SearchDocumentChunks**: Queries en lenguaje natural retornan URIs y snippets
- **GetDocument/BatchGetDocuments**: Recupera contenido completo

Incluye un servidor MCP oficial. En lugar de alucinar respuestas, un agente puede **consultar la respuesta autoritativa** en tiempo real.

### Model Context Protocol (MCP)

Introducido por Anthropic y adoptado por la industria, estandariza cómo las aplicaciones proveen contexto a LLMs.

**75% de desarrolladores proyectados usando MCP servers para 2026.**

Principales proveedores con MCP servers: AWS, Microsoft, Google, OpenAI.

---

## 3. Machine-Readable Context

### Context Engineering como disciplina

La evolución de RAG a Context Engineering revela el rol de la documentación como infraestructura:

| Categoría | Función |
|-----------|---------|
| **Domain Knowledge** | Documentos proveen hechos y background |
| **Tool Guidance & Playbooks** | Contexto instructivo sobre uso correcto de herramientas |
| **Structured Reference** | Jerarquías de TOC como capas de datos queryables |

### Patrones RAG en 2025

- **Graph RAG**: Integra knowledge graphs, construye relaciones entidad-relación sobre documentación
- **Agentic RAG**: LLMs descomponen queries complejas en subqueries paralelas
- **Hybrid Retrieval**: Combina retrieval estructurado con corpus no estructurado—reduce alucinaciones 18% en QA biomédico

---

## 4. Intent-Based Routing

### Patrones de routing

| Tipo | Descripción |
|------|-------------|
| **LLM-Based** | Análisis dinámico basado en contexto, zero-shot |
| **Semantic** | Decisiones basadas en lenguaje de query |
| **Rule-Based** | Keywords y pattern matching |

### Cómo los agentes deciden usar skills

El sistema formatea todos los skills disponibles en una descripción de texto embedida en el prompt, y deja que el modelo decida. Lee las descripciones (documentación) y las matchea contra el intent del usuario a través de comprensión de lenguaje—no keyword matching.

### Event-Driven Routing

Más allá de inputs de texto, eventos de aplicación ("user submitted form", "payment succeeded") disparan workflows. La documentación define schemas de eventos y mapeos de handlers apropiados.

---

## 5. Self-Documenting Systems

### Relación bidireccional

```
Documentation → Code    (Spec-driven development)
Code → Documentation    (Auto-generación)
```

### Spec-Driven Development (SDD)

Tres niveles de implementación:

| Nivel | Descripción |
|-------|-------------|
| **Spec-First** | Especificaciones escritas tienen prioridad |
| **Spec-Anchored** | Especificaciones guían decisiones |
| **Spec-as-Source** | Código se regenera desde specs como fuente de verdad |

Aborda el "vibe coding chaos" donde el desarrollo conversacional con IA pierde contexto entre iteraciones.

### Agent Skills como arquitectura

Skills son carpetas organizadas de instrucciones, scripts y recursos que agentes descubren dinámicamente.

**Progressive Disclosure**:
1. El agente recibe metadata del skill (nombre y descripción)
2. Carga instrucciones detalladas solo cuando son relevantes
3. Accede a archivos adicionales según requiera la tarea

El archivo `SKILL.md` contiene:
- **YAML frontmatter**: Configuración
- **Instrucciones Markdown**: Secciones de prompt
- **Referencias a recursos**: Scripts, docs, templates

---

## El principio fundamental

> **Document for grep.**

Estructura docs con tablas de intent. Usa patrones consistentes. Haz conceptos buscables.

**El comando grep es la API. El archivo markdown es el endpoint.**

---

## Adoption en la industria

| Empresa | Implementación |
|---------|----------------|
| Anthropic | Agent Skills como estándar abierto |
| Google Cloud | Developer Knowledge API + MCP server |
| OpenAI | Agents SDK con soporte MCP |
| Twilio | llms.txt y exports markdown |
| PostHog | MCP server para integración directa |

---

## Caveats

- **Trust Gap**: 84% de devs usan herramientas IA, pero 46% no confían en la precisión (subió de 31% en 2024)
- **Estandarización incierta**: A pesar de 844k+ sitios con llms.txt, ninguna plataforma IA major ha confirmado oficialmente que lee estos archivos
- **Context window limits**: La documentación debe caber—optimización a nivel de pasaje sigue siendo crítica
- **Mantenimiento**: Documentación-as-API requiere el mismo rigor que código. Docs desactualizados causan generación contra APIs deprecados

---

## Takeaway

La documentación estructurada se convierte en la **superficie de integración universal** para inteligencia artificial y humana. Es infraestructura queryable y ejecutable que conecta intent con capability.

---

## Sources

- [Optimizing technical documentations for LLMs - DEV Community](https://dev.to/joshtom/optimizing-technical-documentations-for-llms-4bcd)
- [How to optimize your docs for LLMs - Redocly](https://redocly.com/blog/optimizations-to-make-to-your-docs-for-llms)
- [How to Optimize Developer Documentation for LLM - FusionAuth](https://fusionauth.io/blog/llms-for-docs)
- [Best Practices for Technical Documentation (2025) - LLM Outrank](https://www.llmoutrank.com/blog/best-practices-for-technical-documentation)
- [AI Documentation Trends: What's Changing in 2025 - Mintlify](https://www.mintlify.com/blog/ai-documentation-trends-whats-changing-in-2025)
- [The Complete Guide to llms.txt - Publii](https://getpublii.com/blog/llms-txt-complete-guide.html)
- [The /llms.txt file – llms-txt](https://llmstxt.org/)
- [Optimizing Technical Docs for LLMs - kapa.ai](https://www.kapa.ai/blog/optimizing-technical-documentation-for-llms)
- [Google Brings its Developer Documentation into the Age of AI Agents - InfoQ](https://www.infoq.com/news/2026/02/google-documentation-ai-agents/)
- [If an AI agent can't figure out how your API works, neither can your users - Stytch](https://stytch.com/blog/if-an-ai-agent-cant-figure-out-how-your-api-works-neither-can-your-users/)
- [Why Markdown is the best format for LLMs - Medium](https://medium.com/@wetrocloud/why-markdown-is-the-best-format-for-llms-aa0514a409a7)
- [AI Agent Routing: Tutorial & Best Practices - Patronus](https://www.patronus.ai/ai-agent-development/ai-agent-routing)
- [From RAG to Context - RAGFlow](https://ragflow.io/blog/rag-review-2025-from-rag-to-context)
- [RAG in 2025: 7 Proven Strategies - Morphik](https://www.morphik.ai/blog/retrieval-augmented-generation-strategies)
- [Model Context Protocol - LangChain](https://docs.langchain.com/oss/python/langchain/mcp)
- [Spec-Driven Development with Claude Code - Agent Factory](https://agentfactory.panaversity.org/docs/General-Agents-Foundations/spec-driven-development)
- [Equipping agents for the real world with Agent Skills - Claude Blog](https://claude.com/blog/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
