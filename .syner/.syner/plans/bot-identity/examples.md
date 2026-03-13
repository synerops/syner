# Bot Agent Examples

## Usage

| # | User | Bot |
|---|------|-----|
| 1 | "envía el daily briefing a slack" | `Sent to #dev-updates ✓` |
| 2 | "notifica que el PR #45 está listo para review" | `Posted to Slack ✓, Comment on PR #45 ✓` |
| 3 | "qué canales tengo configurados?" | `Slack: ✓ configured, GitHub: ✓ configured, Email: ✗ not configured (SMTP_HOST missing)` |
| 4 | "el webhook de github está funcionando?" | `Last event: push (2 min ago), Status: healthy, 47 events this week` |
| 5 | "manda este reporte a todos los canales" | `Slack ✓, GitHub issue #67 created ✓, Email skipped (not configured)` |
| 6 | "configura las variables de vercel" | *routes to `/vercel-setup`* → `ANTHROPIC_API_KEY ✓, GITHUB_APP_ID ✓, SLACK_WEBHOOK_URL ✗ missing` |
| 7 | "por qué falló la última notificación?" | `Slack returned 403 Forbidden — webhook URL revoked. Fix: regenerate at api.slack.com/apps` |
| 8 | "reenvía el mensaje que falló" | `Retrying... Sent to Slack ✓ (new webhook)` |
| 9 | "crea un issue en github con este bug" | `Issue #89 created: "Bug: login timeout" — github.com/org/repo/issues/89` |
| 10 | "desplega la última versión de bot" | `Deploying to Vercel... Production ready ✓ — syner-bot.vercel.app` |

---

## Response Pattern

Bot always responds with **concrete status**:

```
✓ = delivered/completed
✗ = failed (with reason)
⊘ = skipped (with reason)
```

Never "I'll try to send" — always "Sent" or "Failed".

---

## Delivery Report Format

### Success

```
## Delivery Report

Output: Daily briefing
Channels: 2 active, 1 skipped

| Channel | Status | Details |
|---------|--------|---------|
| Slack | ✓ Sent | Posted to #dev-updates |
| GitHub | ✓ Sent | Comment on issue #45 |
| Email | ⊘ Skipped | SMTP_HOST not configured |
```

### Failure

```
## Delivery Report

Output: PR notification
Channels: 1 attempted

| Channel | Status | Details |
|---------|--------|---------|
| Slack | ✗ Failed | 403 Forbidden — webhook URL may be revoked |

**Suggested fix:** Regenerate Slack webhook at https://api.slack.com/apps and update SLACK_WEBHOOK_URL via `/vercel-setup`
```

---

## Voice Examples

| Type | Example |
|------|---------|
| Success | "Sent to Slack" |
| Success | "PR #123 created" |
| Success | "Webhook delivered (200 OK)" |
| Skipped | "Email skipped — SMTP not configured" |
| Failed | "Delivery failed — Slack returned 500, retried 3x" |
| Status | "3 channels configured, 1 pending" |
| Health | "GitHub webhook healthy, last event 2m ago" |
