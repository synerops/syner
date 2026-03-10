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

## Vault Index Guidelines

Every vault should have an `index.md` at its root. This file helps syner understand what the vault contains and how to navigate it.

### Validation Criteria

Before committing a vault index, verify:

| Criteria | Question |
|----------|----------|
| **Commiteable** | Does it avoid revealing private structure? Only reference public folders (no `_*` prefixes). |
| **Useful for syner** | Does it map intents to locations? Syner should know what to search and where. |
| **Privacy-preserving** | Does it avoid exposing folder names or file paths that are gitignored? |

### Structure

**For vaults with public content:**

```markdown
# {vault-name}

{One-line description of what this vault contains.}

## organization

| folder | contains |
|--------|----------|
| `public-folder/` | description |

## navigation

| intent | where | pattern |
|--------|-------|---------|
| understand X | path/to/file.md | Read |
| find Y | folder/ | Grep "keyword" |
| discover all | entire vault | Glob `**/*.md` |
```

**For vaults with only private content:**

```markdown
# {vault-name}

{One-line description of what this vault contains.}

## intent → search pattern

| intent | strategy |
|--------|----------|
| {specific need} | Grep "keyword", "related-term" |
| {another need} | Grep "topic", "config" |

## navigation

| tool | when to use |
|------|-------------|
| Glob `**/*.md` | Discover all available context |
| Grep | Find specific topic or capability |
| Read | Direct access once you know the path |

## principles

- **No folder structure exposed** — this file is public, vault contents are private
- **Intent-first routing** — describe what you need, grep finds where it lives
```

### Privacy Convention

Folders prefixed with `_` are gitignored and private:
- `_dev/` — local, never committed
- `guides/` — public, committed

**The index.md only documents public structure.** Syner can still read private folders locally, but the index doesn't reveal them.

**If the entire vault is private** (all folders start with `_`), the index uses intent → grep strategies instead of explicit paths.

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
