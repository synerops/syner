# syner.bot

Integration platform — receives webhooks from GitHub and Slack, routes through the Syner agent mesh, delivers results back.

---

## Quick Start

```bash
# Install and run locally
bun install
bun run dev --filter=bot
# Runs on http://localhost:3001
```

Test without a Slack or GitHub connection:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "list available skills"}'

# Target a specific agent
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "what issues are open?", "agent": "syner"}'
```

---

## For Developers

### How it works

```
Slack mention / GitHub @synerbot / POST /api/chat
           ↓
     Message Router (lib/router.ts)
           ↓ classifyIntent()
    direct │ chain │ delegate
           ↓
     Session (lib/session.ts)
           ↓ createSession()
     ToolLoopAgent (ai SDK)
           ↓ lazy sandbox via @syner/vercel
     Response delivered to source
```

### Project layout

```
apps/bot/
  app/
    api/
      agent/route.ts          POST /api/agent        — execute a named agent on a task
      agents/route.ts         GET  /api/agents        — list all registered agents (ISR, 1h)
      agents/[name]/route.ts  GET  /api/agents/:name  — get a single agent card (static)
      chat/route.ts           POST /api/chat          — unified chat endpoint (local testing)
      commands/slack/route.ts POST /api/commands/slack — Slack slash commands (/syner <skill>)
      supervisor/route.ts     GET|POST /api/supervisor — human-in-the-loop approval gate
      webhooks/
        github/route.ts       POST /api/webhooks/github — GitHub webhook handler
        slack/route.ts        POST /api/webhooks/slack  — Slack event webhook handler
  lib/
    session.ts     — createSession(): agent + lazy sandbox + ToolLoopAgent
    router.ts      — classifyIntent() + classifyAndRoute()
    instance.ts    — getInstanceCard(): SKILL.md → InstanceCard
    tools/
      registry.ts  — createLazyToolSession(), createToolSession(), listTools()
  SKILL.md         — osprotocol skill manifest
```

### Creating a session

```typescript
import { createSession } from '@/lib/session'

const session = await createSession({
  agentName: 'syner',           // looks up agents/syner.md
  onStatus: (s) => console.log(s),
  onToolStart: (t) => console.log('tool:', t),
})

const result = await session.generate('list open issues')
console.log(result.output?.text)

await session.cleanup()
```

`createSession` uses lazy sandbox initialization: tools are registered immediately (the LLM sees them), but the Vercel Sandbox is only created if the LLM actually calls one. Conversational messages return without sandbox overhead.

### Message routing

```typescript
import { classifyAndRoute } from '@/lib/router'

const response = await classifyAndRoute(
  '@dev summarize recent PRs',   // → intent: 'delegate'
  { channel: 'C123', agent },
)
```

Intent classes:

| Intent | Pattern | Behavior |
|--------|---------|----------|
| `direct` | Default | createSession → generate → return |
| `delegate` | `@agent` or "ask X to..." | POST /api/agent with agentName + task |
| `chain` | "then", "followed by", "pipeline" | Falls back to direct (not yet implemented) |

### Executing a named agent

```bash
# POST /api/agent — requires x-vercel-protection-bypass in production
curl -X POST https://syner.bot/api/agent \
  -H "Content-Type: application/json" \
  -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" \
  -d '{"agentName": "dev", "task": "summarize open vision-2026 issues"}'
```

Response shape (osprotocol `Result<GenerateResult>`):

```json
{
  "context": { "agentId": "dev", "skillRef": "session:dev" },
  "action": { "description": "..." },
  "verification": { "status": "passed", "assertions": [...] },
  "output": {
    "text": "...",
    "steps": 3,
    "toolCalls": ["Bash", "Fetch"]
  },
  "duration": 4821
}
```

### Available tools in sandbox

Agents declare tools in their frontmatter (`allowed-tools:`). The tool registry maps names to sandbox-bound implementations:

| Tool | Description |
|------|-------------|
| `Bash` | Execute shell commands in isolated sandbox |
| `Fetch` | Fetch URL as markdown (50k char limit) |
| `Read` | Read a file from the sandbox filesystem |
| `Write` | Write a file (creates parent directories) |
| `Glob` | Find files by glob pattern |
| `Grep` | Search file contents with regex |

`Skill` and `Task` are parsed from agent frontmatter but skipped in the tool registry (handled at the SDK level).

### Webhook: GitHub

Endpoint: `POST /api/webhooks/github`

Triggers on: `issue_comment` (created), `issues` (opened), `pull_request` (opened)

Required: body must contain `@synerbot`. Sender must have at minimum `triage` access to the repository.

Flow:
1. Verify `x-hub-signature-256` against `GITHUB_WEBHOOK_SECRET`
2. Check sender repo permissions (admin/maintain/write/triage)
3. Add 👀 reaction to show processing
4. Load context: CLAUDE.md or README.md, changed files (PRs), last 20 comments
5. `generateText` with `claude-sonnet-4-20250514`, up to 15 tool steps
6. Post response as a new comment

### Webhook: Slack

Endpoint: `POST /api/webhooks/slack`

Triggers on: `@synerbot` mentions in any channel.

Channels map to agents via the `channel:` field in agent frontmatter:

```yaml
# agents/myagent.md
---
name: my-agent
channel: C08XXXXXXXX   # Slack channel ID
---
```

The webhook handler fetches the agent list from `/api/agents` (ISR-cached), matches channel → agent, then routes through `classifyAndRoute`.

### Slash commands

Endpoint: `POST /api/commands/slack`

Usage in Slack: `/syner <command> [args]`

Skills expose themselves as commands via frontmatter:

```yaml
# skills/my-skill.md
---
name: My Skill
command: my-skill
---
```

The handler discovers command-enabled skills at runtime (cached 60s), creates a session for the skill's agent, and runs `/<skillName> <args>` as the prompt.

### Supervisor gate (human-in-the-loop)

Endpoint: `GET /api/supervisor` — list pending approvals  
Endpoint: `POST /api/supervisor` — submit a decision

```bash
# List pending
curl https://syner.bot/api/supervisor

# Approve
curl -X POST https://syner.bot/api/supervisor \
  -H "Content-Type: application/json" \
  -d '{"runId": "run_123", "decision": "approved"}'
```

Note: current implementation uses in-memory storage. Pending approvals do not survive restarts. Durable storage is planned.

### Instance card

`GET /` returns the instance card (parsed from `SKILL.md`):

```typescript
import { getInstanceCard } from '@/lib/instance'

const card = await getInstanceCard('external')
// { name, description, url, version, capabilities, skills[] }
```

Internal scope (`x-syner-internal: <secret>`) returns private skills in addition to public ones.
