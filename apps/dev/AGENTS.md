# syner.dev

Developer portal — skills catalog, documentation, and tooling for the syner ecosystem.

## Structure

<!-- auto:structure -->
```
apps/dev/
├── app/
│   ├── api/
│   │   └── skills/
│   │       ├── route.ts            # List all skills
│   │       └── [slug]/route.ts     # Get skill by slug
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── agents/
│   └── dev.md                      # Lead agent definition
├── components/
│   ├── ui/                         # shadcn components
│   ├── hero.tsx                    # Landing hero
│   ├── skills-catalog.tsx          # Skills grid
│   ├── skill-modal.tsx             # Skill detail modal
│   └── install-instructions.tsx    # Installation guide
├── lib/
│   ├── skills.ts                   # Skill loading utilities
│   ├── types.ts                    # TypeScript types
│   └── utils.ts                    # General utilities
├── skills/                         # 16 skills (see README)
│   ├── create-syner/
│   ├── create-syner-app/
│   ├── create-syner-skill/
│   ├── create-syner-agent/
│   ├── update-docs/
│   └── ...
└── vaults/
    └── dev/index.md                # Dev-specific context
```
<!-- /auto:structure -->

## Conventions

- **Skills** in `skills/{name}/SKILL.md` with YAML frontmatter
- **UI components** in `components/ui/` (shadcn)
- **Feature components** in `components/`
- **API routes** in `app/api/`

## Adding a new skill

1. Create skill directory:
   ```bash
   mkdir -p skills/{name}
   ```

2. Create SKILL.md with frontmatter:
   ```yaml
   ---
   name: {name}
   description: One line description
   agent: dev
   tools: [Read, Bash]
   ---
   ```

3. Create symlink:
   ```bash
   ln -sf ../../../apps/dev/skills/{name} .claude/skills/{name}
   ```

4. Run `/update-docs` to refresh README

## Adding a new page

1. Create in `app/{route}/page.tsx`
2. Use existing components from `components/ui/`
3. Follow existing patterns in `app/page.tsx`

## API patterns

- Skills API returns parsed SKILL.md content
- Use `lib/skills.ts` for skill discovery
- Return JSON with consistent shape

## What NOT to do

- Don't create skills without YAML frontmatter
- Don't forget symlinks — skills won't be discovered
- Don't put business logic in components — use lib/
- Don't manually maintain skill lists — use `/update-docs`
