# dev

Ecosystem builder knowledge — how to create skills, agents, and apps.

## organization

| folder | contains |
|--------|----------|
| `guides/` | how-to documentation for building with syner |

## intent → location

| if you need to... | action |
|-------------------|--------|
| learn how to create an agent | read `guides/how-to-create-agents.md` |
| find a specific topic | grep `guides/` for keyword |

## what dev owns

Dev is the meta-agent — it builds the ecosystem:

- **Creates**: skills, agents, apps via `/create-syner-*`
- **Maintains**: symlinks, stack updates, migrations
- **Reviews**: skill quality, workflow safety, backlog health
- **Documents**: how to build with and on syner

## navigation

| intent | tool | pattern |
|--------|------|---------|
| discover what exists | Glob | `**/*.md` |
| find a topic | Grep | keyword |
| read something specific | Read | full path |
