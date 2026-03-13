# Bot Friction Observations

Raw observations of when the lead bot failed or underperformed.
These will be reviewed for patterns → proposals → specialists.

---

## 2026-03-10 - integration

**Friction:** Bot doesn't have the same context as local Claude — missing vault/notes, conversation history, user preferences, and external data

**Context:** During lead conversation. The deployed bot operates without access to the personal context that makes local Claude effective: markdown vaults, accumulated conversation patterns, known user preferences, and external integrations.

**Would have helped:** A context bridge that syncs relevant vault excerpts, user preferences, and conversation summaries to the bot's runtime — or a way for the bot to query local context on-demand.

---
