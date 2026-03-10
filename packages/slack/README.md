# @syner/slack

Slack integration for Syner.

## Quick Setup

### 1. Create Slack App

Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App → From scratch

### 2. Add Bot Scopes

**OAuth & Permissions** → **Bot Token Scopes**:

```
app_mentions:read    # Receive @mentions
channels:history     # Read channel messages
chat:write           # Send messages
commands             # Slash commands
users:read           # Get user info (required by Chat SDK)
```

### 3. Enable Events

**Event Subscriptions** → Enable → Set Request URL:
```
https://your-domain/api/chat-poc
```

**Subscribe to bot events**:
- `app_mention`

### 4. Add Slash Command

**Slash Commands** → Create:

| Field | Value |
|-------|-------|
| Command | `/syner` |
| Request URL | `https://your-domain/api/slack/commands` |
| Description | Invoke Syner skills |
| Usage Hint | `[command] [args]` |

### 5. Install App

**Install App** → Install to Workspace → Copy **Bot User OAuth Token**

### 6. Environment Variables

```bash
SLACK_BOT_TOKEN=xoxb-...        # Bot User OAuth Token
SLACK_SIGNING_SECRET=...        # Basic Information → Signing Secret
```

### 7. Configure Agent

Add the channel ID to an agent in `agents/*.md`:

```yaml
---
name: syner
channel: C1234567890   # Get this from @mentioning the bot
---
```

If you @mention the bot in an unconfigured channel, it will tell you the channel ID.

## Expose Skills as Commands

Add `command:` to a skill's frontmatter:

```yaml
---
name: create-syner-skill
command: create-skill
description: Create a new skill
---
```

Now `/syner create-skill [args]` invokes that skill.

`/syner help` lists all available commands.
