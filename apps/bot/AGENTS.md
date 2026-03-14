# syner.bot

syner.bot speaks osprotocol. Every response from `POST /api/agent` and `POST /api/chat` is a `Result<GenerateResult>`.

### Invoke an agent

```
POST /api/agent
Headers:
  Content-Type: application/json
  x-vercel-protection-bypass: <VERCEL_AUTOMATION_BYPASS_SECRET>

Body:
  { "agentName": "dev", "task": "what's blocking #494?" }
```

### Discover available agents

```
GET /api/agents
Headers:
  x-vercel-protection-bypass: <VERCEL_AUTOMATION_BYPASS_SECRET>
```

Returns an array of `AgentCard` objects. Each card includes `name`, `description`, `instructions`, `model`, `tools`, `skills`, and optionally `channel`.

### Delegate from within a session

Messages starting with `@agentname` are automatically classified as `delegate` intent and routed via `POST /api/agent`:

```
@dev summarize all open vision-2026 issues
```

No extra setup needed — the router handles it.

---

## Environment variables

**Required:**

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | LLM calls via `@ai-sdk/anthropic` |
| `GITHUB_APP_ID` | GitHub App identity |
| `GITHUB_APP_INSTALLATION_ID` | Installation to act as |
| `GITHUB_APP_PRIVATE_KEY` | Sign GitHub App JWTs |
| `GITHUB_WEBHOOK_SECRET` | Verify incoming GitHub events |

**Optional:**

| Variable | Purpose |
|----------|---------|
| `SLACK_BOT_TOKEN` | Post messages as @synerbot |
| `SLACK_SIGNING_SECRET` | Verify incoming Slack events |
| `CRON_SECRET` | Protect scheduled endpoints |
| `SYNER_INSTANCE_SECRET` | Grant internal scope on `/api/agents` |

Run `/vercel-setup` to configure all variables in Vercel production.

---

## Status

| Feature | Status |
|---------|--------|
| POST /api/chat | Production |
| POST /api/agent | Production |
| GET /api/agents | Production |
| GitHub webhook (@synerbot) | Production |
| Slack webhook (mentions) | Production |
| Slack slash commands (/syner) | Production |
| Lazy sandbox initialization | Production |
| Message routing (direct/delegate) | Production |
| Chain orchestration | Planned |
| Supervisor durable storage | Planned |

