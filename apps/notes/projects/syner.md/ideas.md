# Ideas

## 1. Personal Knowledge Management System

Totally a different approach, what if we build a Personal Knowledge Management System (PKMS) using markdown files as the database, frontmatter as schema, content negotiation, and agent-friendly APIs baked in.

### (Skills as Actions) or (Tags as Commands)

People use actions like `/ideas`, `/state`, `/enhance`, `/graduate`, `/trace`

### Features

the ones mentioned in its [README](apps/notes/README.md)
1. no-database, we connect with github using synerbot github app and we use github as file repository
2. not git knowledge required, simple actions that doesn't require depth knowledge in git, syner.md does everything for you:
  2.1 private/public with a keyboard-friendly toggle
  2.2 repo name `kb` by default, otherwise choose your repo
  2.3 ignore folders (automatically edits the `.gitignore` file)
  2.4 draft/publish, draft is a branch, publish is main

## 2. Markdown-as-Backend Framework

Extract what `syner.md` does into a reusable package: markdown files as the database, frontmatter as schema, content negotiation, and agent-friendly APIs baked in.

### Origin

- [syner.md](./index.md) content negotiation pattern (same URL, different format for humans vs agents)
- [common-stack](../common-stack.md) (Next.js + TypeScript)
- [create-syner-app](../create-syner-app.md) (already scaffolds apps dynamically from markdown config)

### Why me

Already built and running this pattern in production. The content negotiation approach is elegant and not widely available as a packaged solution.

### First step

Extract the content negotiation middleware + path resolver from `apps/notes` into a `@syner/md` package. Ship it as a Next.js plugin. Dogfood it by refactoring `apps/notes` to use the package.

### Risk

Market size — is there enough demand for markdown-backed apps? Test by writing a blog post showing the human/agent duality and seeing if it resonates.
