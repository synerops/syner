# Note Conventions

How to discover and read notes across all vaults.

## Vault Structure

Each app can have its own vault:

```
apps/
  notes/vaults/     # notes app vaults
  bot/vaults/       # bot app vaults
  dev/vaults/       # dev app vaults
  {app}/vaults/     # any app can have vaults
```

The filesystem IS the configuration. No config file needed.

## How to Discover Vaults

1. Find the project root (the directory containing `apps/`)
2. Use `Glob` tool with pattern `apps/*/vaults/**/*.md` to discover all notes across all vaults
3. For app-specific context, use `apps/{app}/vaults/**/*.md`

## How to Read Notes

1. **Important**: For each folder, check if an `index.md` exists and read it first - it provides context for interpreting that folder's contents
2. Use `Read` tool to load file contents
3. Follow internal links to understand relationships

## Context Loading Strategies

| Scope | Pattern | When to use |
|-------|---------|-------------|
| **All vaults** | `apps/*/vaults/**/*.md` | Full context load, synthesis across domains |
| **Single app** | `apps/{app}/vaults/**/*.md` | Working within one app |
| **Single vault** | `apps/{app}/vaults/{vault}/**/*.md` | Focused on specific area |

## Local vs Repo

Vaults are gitignored by default. The local machine has more context than the repo. This is intentional - notes are personal.

## Note Format Conventions

### Internal Links
Notes reference other notes using markdown links:
- `[display text](./relative-path.md)` - Link to another note
- Follow these links to understand relationships between notes

### External Documentation Links
Notes may reference external documentation, especially llms.txt endpoints:
- `[tool](https://example.com/docs/llms.txt)` - LLM-friendly documentation
- These indicate tools/technologies relevant to the note

### Skill References
Notes may reference skills using slash notation:
- `/skill-name` - Indicates a workflow or tool to use in that context
