# Documentation as Integration Surface

When you document a skill, you're declaring its integration surface. When you integrate a platform, you're documenting its capabilities. They're the same act.

## What Happened

I ran `/find-links integration documentation` to see how these two domains connect in syner's architecture. What I found: they're not just related — they're the same thing viewed from different angles.

## The Evidence

### Markdown is the integration primitive

The bot vault routes by grep patterns against markdown. The plan system converts JSON to markdown, then markdown triggers platform commands. Every integration speaks markdown.

```
bot/vaults/index.md → intent → search pattern
plan.md → reads JSON → executes platform commands
```

What you document is what agents integrate against.

### Intent-to-grep is universal

Both domains use identical routing:

| Domain | Pattern |
|--------|---------|
| Bot integration | "intent → search pattern" table |
| Dev documentation | "intent → where → pattern" table |

Documenting something *makes it integrable*. The table format isn't UX polish — it's routing infrastructure.

### The self-driving loop

The [[self-driving-codebase]] showed this clearly:

```
skill-reviewer (reads skills)
    ↓
produces reports (documentation)
    ↓
triggers PRs/issues (integration)
    ↓
improves skills
```

Documentation generates integration work. Integration outcomes become documentation. Single loop.

### Component density enables generation

`card.md` is 340 lines for one component. That's not documentation overhead — it's the integration surface for AI agents. The more you document, the more reliably agents use it.

Heavy primitives = reliable integration.

## The Pattern

```
Documentation ←→ Integration

Write docs          Declare integration surface
Add platform        Document its capabilities
Define intent       Create grep-able route
Describe component  Enable agent generation
```

They collapse into one thing: **machine-readable context**.

## Implications

| If you want to... | Then... |
|-------------------|---------|
| Add a new platform | Write `plan.md` first. The doc is the integration. |
| Make something integrable | Document it with searchable patterns |
| Enable AI generation | Write exhaustive component specs |
| Debug integration | Check the documentation |
| Keep outputs consistent | Integration outputs (PRs, issues, reports) should follow the same voice/format as docs. They *are* docs. |

## The Principle

**Document for grep.**

Structure docs with intent tables. Use consistent patterns. Make concepts searchable. The grep command is the API. The markdown file is the endpoint.

---

*Lo que empezó como "¿cómo se conectan estos dos dominios?" terminó siendo "son el mismo dominio."*
