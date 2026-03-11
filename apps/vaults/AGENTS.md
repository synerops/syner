# syner.md

Personal knowledge management — your markdown notes become context for AI agents.

## Structure

<!-- auto:structure -->
```
apps/vaults/
├── app/
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── agents/
│   └── notes.md                    # Lead agent definition
├── lib/
│   └── utils.ts                    # Utilities
├── skills/                         # 5 skills
│   ├── find-ideas/
│   ├── find-links/
│   ├── grow-note/
│   ├── track-idea/
│   └── load-all/
└── .syner/vaults/wiki/             # User's notes (gitignored)
    ├── syner/                      # Project notes
    ├── blog/                       # Blog drafts
    ├── ideas/                      # Ideas
    └── ronny/                      # Personal
```
<!-- /auto:structure -->

## Conventions

- **Vaults** in `vaults/{category}/` — any structure, no schemas
- **Skills** in `skills/{name}/SKILL.md`
- **Notes** are plain markdown — no frontmatter required

## Vault philosophy

Vaults are personal. They're gitignored by default. Skills read them for context, not for data extraction.

```
.syner/vaults/wiki/          # Your notes
.syner/vaults/*/             # Other apps can have vaults too
```

Discovery pattern: `.syner/vaults/**/*.md`

## Adding a new skill

1. Create skill directory:
   ```bash
   mkdir -p skills/{name}
   ```

2. Create SKILL.md:
   ```yaml
   ---
   name: {name}
   description: What it does
   tools: [Glob, Read]
   ---
   ```

3. Symlink:
   ```bash
   ln -sf ../../../apps/vaults/skills/{name} .claude/skills/{name}
   ```

## How skills read vaults

1. Use Glob to find notes: `.syner/vaults/**/*.md`
2. Read relevant files based on user intent
3. Synthesize understanding (not extract fields)
4. Respond with insights, not data

## What NOT to do

- Don't enforce structure on vaults — users organize their way
- Don't require frontmatter — notes are freeform
- Don't extract data — understand context
- Don't commit vault content — it's personal
