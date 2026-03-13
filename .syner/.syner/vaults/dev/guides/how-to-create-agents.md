# How to create an agent

An agent in syner is a markdown file with frontmatter metadata and instructions.
You can create one in under a minute and start using it immediately.

## Create the agent file

Create a new file in the `agents/` directory with the `.md` extension:

```markdown
---
name: my-agent
description: Summarizes code files when asked for a quick overview
tools: [Read, Glob]
model: sonnet
---

# My Agent

You summarize code files concisely.

## Input

You receive a file path or directory to analyze.

## Process

1. Use Glob to find relevant files
2. Read the files in parallel
3. Extract key information

## Output

Return a brief summary with:
- Purpose of the code
- Main functions or components
- Dependencies
```

Save this file as `agents/my-agent.md`.

## Invoke the agent

Use the Task tool to delegate work to your agent:

```
Task(subagent_type: "my-agent", prompt: "summarize src/utils/")
```

The Task tool reads your agent's description to determine when to invoke it.

## Frontmatter reference

The frontmatter defines your agent's capabilities and behavior.

| Field | Description | Example |
|-------|-------------|---------|
| `name` | Unique identifier in kebab-case | `code-summarizer` |
| `description` | When to use this agent (used for routing) | `Summarizes code when asked for overview` |
| `tools` | Tools the agent can access | `[Read, Write, Glob, Grep, Edit, Bash, Task]` |
| `model` | LLM model to use | `haiku`, `sonnet`, or `opus` |

### Model selection

Choose the model based on task complexity:

| Model | Best for |
|-------|----------|
| `haiku` | Fast, simple tasks with structured output |
| `sonnet` | Complex reasoning and multi-step processes |
| `opus` | Orchestration and high-judgment decisions |

### Tool selection

Grant only the tools your agent needs:

| Need | Tools to include |
|------|------------------|
| Read files | `Read`, `Glob`, `Grep` |
| Create files | Add `Write` |
| Modify files | Add `Edit` |
| Run commands | Add `Bash` |
| Delegate to other agents | Add `Task` |

## Best practices

Follow these guidelines when creating agents:

1. **Write a routing-friendly description.** The Task tool uses the description
   to decide whether to invoke your agent. Be specific about when it applies.

2. **Minimize tools.** Only include tools the agent actually needs. Fewer tools
   means faster execution and reduced risk.

3. **Define explicit output.** Specify exactly what format the agent returns.
   Vague output instructions lead to inconsistent results.

4. **Design for parallel reads.** If your agent reads multiple files, instruct
   it to read them in parallel within a single response.

5. **Test immediately.** After creating an agent, invoke it with a simple prompt
   to verify it works as expected.

## Next steps

- Review existing agents in `agents/` for patterns and examples
- Learn about [skills](/guides/how-to-create-skills) for user-invocable commands
- Explore [workflow patterns](/guides/workflow-patterns) for complex orchestration
