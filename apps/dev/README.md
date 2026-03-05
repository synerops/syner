# syner.dev

self-driving development - agents that ship code while you sleep. **coming soon.**

## what it will be

- developer portal for the syner ecosystem
- documentation, guides, and tooling
- CI/CD dashboard and agent logs

## what works today

the **skills** work locally via Claude Code:

### create

- `/create-syner` - orchestrate creation of skills, agents, apps
- `/create-syner-app` - scaffold new apps
- `/create-syner-skill` - create new skills
- `/create-syner-agent` - create new agents

### maintain

- `/update-syner-app` - update apps to current stack
- `/syner-enhance-skills` - improve existing skills
- `/syner-fix-symlinks` - fix skill symlinks

### analyze

- `/syner-researcher` - research any topic
- `/syner-backlog-triager` - triage backlog against codebase
- `/syner-backlog-reviewer` - audit backlog health
- `/syner-skill-reviewer` - audit skill quality
- `/syner-readme-enhancer` - generate honest READMEs

### operate

- `/syner-daily-standup` - generate standup reports
- `/test-syner-agent` - test agents

## try it

```bash
bun run dev --filter=dev
```

you'll see the landing page. the real value today is the skills.
