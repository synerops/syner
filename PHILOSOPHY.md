# Syner Philosophy

## The shift

Software is built on layers of abstraction. Each generation loses understanding of the layer below but gains power from the layer above.

The next layer is **intent**. You describe what you want, not how to do it. The system figures out the rest.

This isn't new. It's the same pattern: assembly to C, C to Python, CLI to GUI. Each transition felt like losing control. Each transition expanded who could build.

Syner is infrastructure for this transition.

---

## Background agents

The model that's emerging: agents that work while you do other things.

You give them a task. They run in the background. They figure out context, execute steps, verify their work, and deliver a result. You review when it's ready.

This changes the relationship. You're not operating the tool. You're directing it.

**What makes this work:**

- **Trigger and forget** — You describe the task and move on. The agent doesn't need you present.
- **Observable** — You can check progress anytime, but you don't have to.
- **Self-verifying** — The agent tests its own work. It doesn't deliver broken results.
- **Concrete output** — A PR, a report, a document. Something real, not a chat response.

Ramp ships 30% of their PRs this way. Stripe merges 1,000+ agent-written PRs per week. This isn't experimental. It's happening.

---

## Skills, not monoliths

A skill is a focused capability. It does one thing well.

An agent that "does everything" is an agent that does nothing reliably. The model that works: groups of skills that collaborate. Each skill is small, testable, replaceable.

When you ask Syner to do something, it doesn't try to solve it alone. It routes to the right skill, or orchestrates multiple skills working together.

**The pattern:**

```
Intent → Orchestrator → Skills → Output
```

Skills are not plugins. They're not extensions. They're the primary unit of capability. The orchestrator exists to coordinate them.

---

## Markdown as primitive

Markdown won. Not because it's technically superior. Because it's readable, writable, parseable, and everywhere.

- Humans read it without processing
- Machines parse it trivially
- LLMs understand it natively
- It survives every tool transition

When everything is markdown, agents and humans share the same surface. Instructions, outputs, notes, configs — all the same format. No translation layer.

Syner uses markdown as the filesystem for agents. Your notes become context. Skills read them for understanding. Agents publish results as markdown. The format is the interface.

---

## Notes as context

Your notes are yours. No enforced schema, no required structure, no metadata formats.

Skills don't extract data from notes. They read them for understanding — the same way a colleague would read your docs before helping you.

This means:
- **Personal, free-form** — Organize however makes sense to you
- **Context, not parsing** — Skills understand intent, not fields
- **Discovery over configuration** — Preferences emerge from what you write, not from config files

---

## How skills work

- **Suggest, don't enforce** — Skills recommend. You decide.
- **Minimal assumptions** — When unclear, ask.
- **Composable** — Skills can invoke other skills.
- **Verifiable** — Every skill can explain what it did and why.

---

## How agents work

- **Execute with verification** — Action → Verify → Repeat
- **Fork context when needed** — Isolate complex operations
- **Report back** — Always summarize what was done
- **Fail gracefully** — When stuck, surface the problem instead of guessing

---

## The stack

```
You
 ↓
Syner (orchestrator)
 ↓
Skills (focused capabilities)
 ↓
Markdown (shared context)
 ↓
Your notes, your repos, your systems
```

Everything flows through markdown. Everything is observable. Everything is yours.

---

## What we're building toward

A system where:

- You describe intent, not procedure
- Work happens in the background while you do other things
- Skills collaborate to complete complex tasks
- Results are concrete and verifiable
- The human stays in the loop — reviewing, directing, deciding

Not replacing developers. Moving them up the stack.

---

## References

- [Ramp: Why we built our background agent](https://builders.ramp.com/post/why-we-built-our-background-agent)
- [Stripe: Minions — one-shot end-to-end coding agents](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [The Self-Driving Codebase](https://background-agents.com/)
