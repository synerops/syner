<p align="center">
  <picture>
    <source srcset="https://github.com/user-attachments/assets/cbf55457-a101-4547-9155-2fcc6ac08eaa" media="(prefers-color-scheme: dark)">
    <img src="https://github.com/user-attachments/assets/656eb187-0313-435b-bb44-e80f23924924" alt="Syner" height="96"/>
  </picture>
</p>

# Syner

Your notes are your external brain. Syner makes them actionable.

Write markdown in `apps/notes/content/`. No schemas, no config. Then:

```
/syner what should I work on next?
```

## Principles

- **Notes are personal** — free-form, no enforced structure ([PHILOSOPHY.md](PHILOSOPHY.md))
- **Suggest, don't enforce** — skills recommend, you decide
- **Action, Verify, Repeat** — agents execute with verification loops

## Skills

| Skill | What it does |
|-------|-------------|
| `/syner` | Orchestrator — routes to specialists or executes directly |
| `/syner-load-all` | Load your full notes state |
| `/syner-find-ideas` | Generate ideas from your knowledge |
| `/syner-find-links` | Find bridges between two domains |
| `/syner-grow-note` | Promote a thought into a document |
| `/syner-track-idea` | Track how an idea evolved over time |
| `/create-syner-app` | Scaffold new app with standard stack |
| `/update-syner-app` | Update app to current standards |
| `/backlog-triager` | Triage backlog against codebase |
| `/backlog-reviewer` | Audit backlog health |
| `/syner-enhance-skills` | Improve an existing skill |
| `/syner-researcher` | Research a topic from any source |

## Agents

- **syner-worker** — Executes tasks with workflow patterns (chaining, parallelization, routing)
- **code-reviewer** — Reviews code for quality, security, and best practices

## References

- [PHILOSOPHY.md](PHILOSOPHY.md) — Design principles
- [note-conventions.md](skills/syner/note-conventions.md) — How skills read your notes
