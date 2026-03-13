# Vercel as Agent Runtime

Date: 2026-03-12

## Verdict

**Sufficient for v1.** Not sufficient for production-grade, globally-distributed, per-user isolated, multi-day autonomous agent OS.

This validates the decision that **syner.dev is replaceable** — Vercel has real hard limits.

## Primitives

### Functions
- Max duration: 300s (Hobby) / 800s (Pro/Enterprise)
- Memory: 2-4 GB, 1-2 vCPU
- Payload: 4.5 MB cap
- No WebSocket support
- Fluid Compute: I/O wait not charged (ideal for LLM calls, ~90% cost reduction)
- Concurrency: 30K (Pro) / 100K+ (Enterprise)

### Workflows (WDK)
- `'use workflow'` + `'use step'` directives
- `sleep('7 days')` at zero compute cost
- `defineHook` for human-in-the-loop
- `DurableAgent` wraps AI SDK Agent into retryable Workflow steps
- **Still in beta** as of March 2026
- Pricing: $2.50 per 100K steps

### Queues (public beta Feb 2026)
- At-least-once delivery, 3 AZ replication
- **24-hour max retention** — messages silently dropped after
- No built-in dead-letter queue
- No FIFO guarantee (approximate write-order only)
- Max 32 delivery attempts before forced exponential backoff

### Blob
- Up to 5 TB per file, 512 MB cache per blob
- Rate limits team-scoped (all users share the cap)
- Cost: reasonable (~$37/month for 1000 users at 10 MB/user/day)

### KV (Redis-compatible)
- 30K free requests/month (Hobby), 150K (Pro)
- Good for: rate limiting, session state, distributed locks, pub/sub signaling
- Not suitable for: large state, conversation histories, embeddings

### Postgres
- Vercel no longer manages directly — migrated to Neon (Q4 2024)
- Neon: serverless, scale-to-zero, database branching
- Per-user isolation: $19+/user/month (breaks at scale)
- No native vector store — need external (Upstash Vector, Pinecone, pgvector)

### Sandbox (Firecracker microVMs)
- Full Linux (Amazon Linux 2023), Node.js or Python
- 8 vCPUs, 2 GB/vCPU RAM
- Max duration: 45 min (Hobby) / 5 hours (Pro)
- Dedicated kernel per sandbox, SOC 2 Type II
- **Single region only (iad1 / US East)**
- No inter-sandbox networking

### AI SDK v6
- `Agent` class, `ToolLoopAgent`, `DurableAgent`
- Tool approval (`needsApproval: true`)
- Full MCP support (OAuth/PKCE, HTTP transport, remote servers)
- **BYOK is team-scoped, not user-scoped**

## Known Bugs (as of March 2026)

| Bug | Impact |
|---|---|
| Phantom retries on CPU-bound steps >30s (#925) | Same step executes twice concurrently, silently |
| Scaling wall at ~1000 concurrent workflow events (#1012) | Workflows hang, no error, no logs |
| Stuck pending state with no dead-letter queue (#451) | Work silently lost |
| Deterministic replay requirement | Non-deterministic code outside steps causes divergence on resume |

## 3 Unresolvable Gaps Without Leaving Vercel

1. **No WebSockets** — need PartyKit, Ably, or Pusher for real-time bidirectional
2. **No vector/semantic memory** — need Upstash Vector, Pinecone, or pgvector on Neon
3. **BYOK is team-scoped** — per-user BYOK means per-user Vercel team (expensive, operationally complex)

## Cost Estimates

| Scale | Shared DB model | Per-user DB model |
|---|---|---|
| 100 users/month | ~$50 | ~$2,000 |
| 1,000 users/month | ~$285 | ~$20,000+ |

Shared schema with row-level security is the viable path. Per-user isolation breaks cost at any meaningful scale.

## Sources

- Vercel Functions Limits — vercel.com/docs/functions/limitations
- Fluid Compute — vercel.com/docs/fluid-compute
- Vercel Workflow — vercel.com/docs/workflow
- Queues Concepts — vercel.com/docs/queues/concepts
- AI SDK 6 — vercel.com/blog/ai-sdk-6
- Vercel BYOK — vercel.com/docs/ai-gateway/authentication-and-byok/byok
- GitHub workflow issues #925, #1012, #451
