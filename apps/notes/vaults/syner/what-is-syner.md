# what is syner

Is an orchestrator agent that understands your context and guides execution. Syner orchestrates my notes, my thinking.

> The word `syner` is derived from `synergy`, which means working together to achieve a common goal. Syner is a powerful tool that can help you achieve your goals by working together with you and its workers.

## how

The user create notes, is free to use their own convenient approach to organize their notes, notes are personal, they are ignored by default (unless user wants to include some in the repo).

Syner read these notes and understand them organically, not parsing fields unless user want the opposite.

## worker

Syner has their own worker to perform actions. It is called `syner-worker` and it's a [custom sub agent](https://code.claude.com/docs/en/sub-agents) for Claude.

The worker also has its internal architecture based on [predefined workflows](https://www.anthropic.com/engineering/building-effective-agents)

## ecosystem

everything starts with a markdown file

[syner.md](https://syner.md): the markdown editor/preview
[syner.bot](https://syner.bot): the integration platform
[syner.dev](https://syner.dev): the developer agentic portal
[syner.app](https://syner.app): the operating system

### `syner.md`

### `syner.bot`
any integration syner uses a bot to provide a one-place to connect with everything

- [syner for github](https://github.com/apps/synerbot)
- [syner for slack](https://synerops.slack.com/apps/A0AGAF7FTNZ)
- [syner for x](https://x.com/syner_bot)
