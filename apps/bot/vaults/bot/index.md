---
host:
  local: localhost:3001
  public: https://syner.bot
path: apps/bot
---

# syner.bot

is like an agentic integration hub

imagine syner integrated in different apps, how many apps you can imagine syner can be integrated? tell me

so my idea is that webhooks, and other types of integrations should live here, for example:

1. syner for github: `syner.bot/api/webhooks/github`
2. syner for slack: `syner.bot/api/webhooks/slack`

## packages provide the logic... and the handler

packages are divided by companies:

- packages/github: provide whatever is necessary related to github, for example: an agent, a tool, and/or libs to enable syner, and as mentioned a router which can be used in the next app api route (it should use fetch standard, for compatibility)
