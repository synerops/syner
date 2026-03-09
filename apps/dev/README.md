# syner.dev

self-driving development - agents that ship code while you sleep. **coming soon.**

## what it will be

- developer portal for the syner ecosystem
- documentation, guides, and tooling
- CI/CD dashboard and agent logs

## what works today

the **skills** work locally via Claude Code:

<!-- auto:skills -->
| Skill | Description |
|-------|-------------|
| `/create-syner` | Orchestrate creation of skills, agents, and apps |
| `/create-syner-app` | Scaffold new applications following the syner stack |
| `/create-syner-skill` | Create new skills |
| `/create-syner-agent` | Create new agents |
| `/update-syner-app` | Update apps to current standards |
| `/update-docs` | Update documentation to reflect codebase state |
| `/syner-enhance-skills` | Improve existing skills |
| `/syner-fix-symlinks` | Fix skill and agent symlinks |
| `/syner-backlog-triager` | Triage backlog against codebase |
| `/syner-backlog-reviewer` | Audit backlog health |
| `/syner-skill-reviewer` | Review skills for quality and safety |
| `/syner-readme-enhancer` | Generate honest READMEs from code |
| `/syner-daily-briefing` | Generate daily briefing from GitHub data |
| `/syner-boundaries` | Validate proposals respect operational boundaries |
| `/workflow-reviewer` | Review GitHub Actions workflows |
| `/test-syner-agent` | Test agents using output-first methodology |
<!-- /auto:skills -->

## try it

```bash
bun run dev --filter=dev
```

you'll see the landing page. the real value today is the skills.
