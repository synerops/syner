---
name: vercel-setup
description: Configure Vercel environment variables for syner.bot. Use when deploying the bot, setting up env vars, or troubleshooting deployment issues.
agent: bot
tools: [Read, Bash, AskUserQuestion]
metadata:
  author: syner
  version: "0.2.0"
---

# Vercel Setup

> Part of **Bot** — the Integration Bridge mutation of Syner.

Configure environment variables for `syner.bot` deployment on Vercel. Bot needs to be running to connect systems — this skill ensures it's properly configured.

## Purpose

Bot delivers outputs to external channels. Those channels require credentials:

- **Slack** needs webhook URLs
- **GitHub** needs App credentials
- **Scheduled tasks** need secrets

This skill configures all of that. Without it, Bot can't deliver.

## Task

**Input:** $ARGUMENTS

If empty, run the full setup flow. If provided (e.g., "check", "add SLACK_WEBHOOK_URL"), handle that specific action.

## Prerequisites

1. Vercel CLI installed: `bun add -g vercel`
2. Logged in: `vercel login`
3. Project linked: `cd apps/bot && vercel link`

## Required Variables

| Variable | Source | How to Get |
|----------|--------|------------|
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/settings/keys) | Create Key → copy (starts with `sk-ant-`) |
| `GITHUB_APP_ID` | GitHub App settings | Top of your app's settings page |
| `GITHUB_APP_INSTALLATION_ID` | Installation URL | `https://github.com/settings/installations/XXXXXXXX` ← this number |
| `GITHUB_APP_PRIVATE_KEY` | GitHub App settings | Private keys → Generate → download PEM (see Handling the Private Key below) |
| `GITHUB_WEBHOOK_SECRET` | Generate + add to GitHub App | `openssl rand -hex 32` → add to App's Webhook settings |

## Optional Variables

| Variable | Source | How to Get |
|----------|--------|------------|
| `SLACK_WEBHOOK_URL` | [Slack Apps](https://api.slack.com/apps) | Your App → Incoming Webhooks → Add New |
| `CRON_SECRET` | Generate | `openssl rand -hex 32` |

## Step 1: Check Current State

Navigate to the bot app directory (find project root containing `apps/`, then `cd apps/bot`):

```bash
cd apps/bot
vercel env ls --scope synerops
```

Parse output to determine which variables are missing.

## Step 2: Generate Secrets (if needed)

For `GITHUB_WEBHOOK_SECRET` and `CRON_SECRET`:

```bash
openssl rand -hex 32
```

**Important:** After generating `GITHUB_WEBHOOK_SECRET`, add it to GitHub App settings:
1. Go to https://github.com/settings/apps/synerbot
2. Webhook → Secret → paste the value
3. Save changes

## Step 3: Add Variables to Vercel

For each missing variable, run from `apps/bot`:

```bash
cd apps/bot

# Required
vercel env add ANTHROPIC_API_KEY production --scope synerops
vercel env add GITHUB_APP_ID production --scope synerops
vercel env add GITHUB_APP_INSTALLATION_ID production --scope synerops
vercel env add GITHUB_APP_PRIVATE_KEY production --scope synerops
vercel env add GITHUB_WEBHOOK_SECRET production --scope synerops

# Optional
vercel env add SLACK_WEBHOOK_URL production --scope synerops
vercel env add CRON_SECRET production --scope synerops
```

### Handling the Private Key

The `GITHUB_APP_PRIVATE_KEY` is multiline. Options:

**Option A: Interactive (recommended for Vercel)**
```bash
vercel env add GITHUB_APP_PRIVATE_KEY production --scope synerops
# Paste the entire PEM contents when prompted
# Press Ctrl+D to finish
```

**Option B: From file**
```bash
cat /path/to/private-key.pem | vercel env add GITHUB_APP_PRIVATE_KEY production --scope synerops
```

**Option C: Use file path (local development only)**

For local development, you can use `GITHUB_APP_PEM_PATH` instead:
```bash
# In .env.local
GITHUB_APP_PEM_PATH=/path/to/private-key.pem
```
Note: This option is NOT available in Vercel - use Option A or B for production.

## Step 4: Verify

```bash
# List all configured vars
vercel env ls --scope synerops

# Trigger a deployment to apply changes
vercel --prod --scope synerops
```

## Step 5: Test Deployment

After deployment, verify:

1. **Webhook:** Send a test event from GitHub App settings
2. **Cron:** Check Vercel Functions logs after cron interval

```bash
# View recent function logs
vercel logs --scope synerops
```

## Troubleshooting

### "Environment variable not found"

The variable exists in Vercel but wasn't pulled to the deployment. Force redeploy:

```bash
vercel --prod --force --scope synerops
```

### Private key issues

If you see `invalid private key format`:
- Ensure the key includes `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
- No extra whitespace at the end
- Newlines preserved correctly

### Webhook signature mismatch

The `GITHUB_WEBHOOK_SECRET` in Vercel doesn't match GitHub App settings. Regenerate and update both:

```bash
NEW_SECRET=$(openssl rand -hex 32)
echo "New secret: $NEW_SECRET"
echo "1. Add to GitHub App: https://github.com/settings/apps/synerbot"
echo "2. Add to Vercel:"
vercel env rm GITHUB_WEBHOOK_SECRET production --scope synerops --yes
vercel env add GITHUB_WEBHOOK_SECRET production --scope synerops
```

## Boundaries

This skill operates within `/syner-boundaries`. Key constraints:

| Boundary | How it applies |
|----------|----------------|
| 8. Self-Verification | Verify env vars are set before reporting success |
| 9. Graceful Failure | Report what failed and why (missing vars, auth issues) |
| 10. Observable Work | Log what was configured, show current state |

**Self-check before completing:**

1. Did I verify the variables exist in Vercel? (not just add them)
2. Did I confirm the deployment succeeded?
3. If something failed, did I explain why and suggest a fix?

## Related

- [.env.example](../../.env.example) - Local environment setup
- [agents/bot.md](/agents/bot.md) - Bot agent identity
