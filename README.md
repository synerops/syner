<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/cbf55457-a101-4547-9155-2fcc6ac08eaa" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/656eb187-0313-435b-bb44-e80f23924924" alt="Syner" height="96"/>
  </picture>
</p>

# Syner

Your notes are your external brain. Syner is the interface that makes them actionable.

## Why

You accumulate knowledge across notes, ideas, and projects — but it stays scattered. Syner reads your notes as context, understands your situation, and helps you act on what you already know. No schemas, no config files, no enforced structure. Just markdown.

## Quick Start

```bash
# 1. Write notes in markdown
apps/notes/content/

# 2. Ask syner anything
/syner what should I work on next?

# 3. Or use a skill directly
/syner-find-ideas developer-tools
```

That's it. The more you write, the more Syner understands.

## Principles

- **Notes are personal** — no enforced schema, no structured metadata. Syner reads for context, not data extraction
- **Suggest, don't enforce** — skills recommend, you decide
- **Execute with verification** — Action, Verify, Repeat

See [PHILOSOPHY.md](PHILOSOPHY.md) for the full rationale.

## Notes

Markdown is the language of agents. Create notes in `apps/notes/content/` with any structure you like.

To give Syner context about a folder, add an `index.md`. See [note-conventions.md](skills/syner/note-conventions.md) for the full reading conventions.

## Skills

| Skill | What it does | Category |
|-------|-------------|----------|
| `/syner` | Orchestrator — understands context, routes to specialists or executes directly | Core |
| `/syner-load-all` | Load your full notes state | Knowledge |
| `/syner-track-idea` | Track idea evolution (proactive + manual) | Knowledge |
| `/syner-find-ideas` | Generate ideas from your knowledge | Synthesis |
| `/syner-find-links` | Find bridges between two different domains | Synthesis |
| `/syner-grow-note` | Promote a thought into a proper document | Synthesis |
| `/create-syner-app` | Scaffold new app with standard stack | Apps |
| `/update-syner-app` | Update existing app to current standards | Apps |
| `/backlog-triager` | Triage backlog items against codebase | Backlog |
| `/backlog-reviewer` | Audit backlog health (stale, duplicates, hidden TODOs) | Backlog |
| `/syner-enhance-skills` | Improve existing skills with best practices | Meta |
| `/syner-researcher` | Research a topic from any source | Meta |

## Agents

Agents handle complex execution with verification loops.

- **syner-worker** — Executes tasks using workflow patterns (chaining, parallelization, routing). Action, Verify, Repeat
- **code-reviewer** — Reviews code for quality, security, and best practices
