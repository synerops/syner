---
name: create-syner-package
description: Create a new syner package with context and/or action skills. Use when adding integrations (GitHub, Vercel, Notion, etc.) to the syner ecosystem. Triggers on "create package", "add integration", "new syner package", or when discussing connecting external services to syner.
---

# Create Syner Package

Create packages that extend syner's capabilities by providing context and/or actions from external services.

## Architecture Overview

syner uses a subagent architecture for gathering context and executing actions:

```
syner (orchestrator)
├── syner-context (gathers context)
│   ├── vault (native, always loaded)
│   └── packages/**/skills/context/SKILL.md (discovered)
└── syner-worker (executes actions)
    └── packages/**/skills/actions/SKILL.md (discovered)
```

### How Discovery Works

1. **syner-context** runs `Glob` on `packages/**/skills/context/SKILL.md`
2. Reads each skill's description
3. LLM decides which are relevant to the current task
4. Invokes relevant skills, condenses output

Same pattern for **syner-worker** with `packages/**/skills/actions/SKILL.md`.

### Subagents Are Decoupled

- syner-context knows nothing about syner-worker
- syner-worker knows nothing about syner-context
- syner orchestrates between them
- Each skill is self-contained with its own instructions

## Package Structure

```
packages/<package-name>/
├── README.md              # Package documentation
├── package.json           # If needed for dependencies
├── src/                   # Implementation code (if any)
└── skills/
    ├── context/
    │   └── SKILL.md       # Provides context to syner-context
    └── actions/
        └── SKILL.md       # Provides actions to syner-worker
```

A package can have:
- Only context (read-only integration)
- Only actions (write-only integration)
- Both context and actions (full integration)

## Skill Format

Each skill follows the standard Claude Code skill format:

```yaml
---
name: syner-<package>-context  # or syner-<package>-actions
description: <What it provides>. Use when <specific triggers>.
---

<Instructions for the skill>
```

### Description Pattern

Follow the same pattern as vercel or find-skills. The description must clearly state:
1. What the skill provides
2. When to use it (specific triggers)

Example:
```yaml
description: Context from GitHub issues, PRs, and repository info. Use when the task involves code review, issue tracking, pull requests, or repository data.
```

### Skill Content

The skill body contains instructions for how to gather context or execute actions. Keep it:
- Self-contained (no knowledge of other skills)
- Clear about what commands/tools to use
- Focused on condensing output (for context skills)

## Process

### Step 1: Identify the Integration

Ask:
1. What external service is this package for?
2. Does it provide context, actions, or both?
3. How does it authenticate? (API key, OAuth, CLI tool)
4. What specific capabilities does it offer?

### Step 2: Create Package Structure

```bash
mkdir -p packages/<name>/skills/context
mkdir -p packages/<name>/skills/actions
```

### Step 3: Write Context Skill (if applicable)

The context skill should:
- Explain what context it provides
- Describe how to fetch the context (commands, APIs)
- Instruct to condense output for the orchestrator

Template:
```markdown
---
name: syner-<package>-context
description: Context from <service>. Use when <triggers>.
---

Gather context from <service> relevant to the current task.

## What This Provides

- <capability 1>
- <capability 2>

## How to Gather

<specific instructions, commands, or API calls>

## Output

Condense findings into a brief summary focusing on what's relevant to the task.
```

### Step 4: Write Actions Skill (if applicable)

The actions skill should:
- Explain what actions it can perform
- Describe how to execute actions
- Include verification steps

Template:
```markdown
---
name: syner-<package>-actions
description: Actions for <service>. Use when <triggers>.
---

Execute actions on <service>.

## Available Actions

- <action 1>
- <action 2>

## How to Execute

<specific instructions, commands, or API calls>

## Verification

After each action, verify success by <method>.
```

### Step 5: Document the Package

Create `README.md` explaining:
- What the package does
- Setup/authentication requirements
- Available skills and their triggers

## Examples

### Example: GitHub Package

```
packages/github/
├── README.md
├── package.json
├── src/
│   └── index.ts           # GitHub App auth wrapper
└── skills/
    ├── context/
    │   └── SKILL.md       # Read issues, PRs, repo info
    └── actions/
        └── SKILL.md       # Create PRs, comment, manage issues
```

**Context skill** (`skills/context/SKILL.md`):
```markdown
---
name: syner-github-context
description: Context from GitHub issues, PRs, and repository info. Use when the task involves code review, issue tracking, pull requests, or repository data.
---

Gather context from GitHub relevant to the current task.

## What This Provides

- Open issues and their status
- Pull request details and review status
- Repository information and recent activity

## How to Gather

Use the `gh` CLI. If authentication fails:

\`\`\`bash
bunx @syner/github create-app-token | gh auth login --with-token
\`\`\`

Then:

\`\`\`bash
gh issue list --state open
gh pr list --state open
gh repo view
\`\`\`

## Output

Condense findings into a brief summary:
- Relevant issues (title, number, status)
- Relevant PRs (title, number, review status)
- Any blocking items or dependencies
```

**Actions skill** (`skills/actions/SKILL.md`):
```markdown
---
name: syner-github-actions
description: GitHub operations like creating PRs, commenting on issues, and managing repository state. Use when the task requires making changes to GitHub.
---

Execute actions on GitHub.

## Available Actions

- Create pull requests
- Comment on issues and PRs
- Assign reviewers
- Manage labels and milestones

## How to Execute

Use the `gh` CLI. If authentication fails:

\`\`\`bash
bunx @syner/github create-app-token | gh auth login --with-token
\`\`\`

Then:

\`\`\`bash
gh pr create --title "..." --body "..."
gh issue comment <number> --body "..."
\`\`\`

## Verification

After each action, verify success:
- For PRs: `gh pr view <number>` to confirm creation
- For comments: `gh issue view <number>` to see the comment
```

### Example: Vercel Package

```
packages/vercel/
├── README.md
└── skills/
    ├── context/
    │   └── SKILL.md       # Deploy status, logs, project info
    └── actions/
        └── SKILL.md       # Create sandbox, trigger deploy
```

**Context skill**:
```markdown
---
name: syner-vercel-context
description: Context from Vercel deployments, project status, and logs. Use when the task involves deployment status, preview environments, or production monitoring.
---

Gather context from Vercel relevant to the current task.

## What This Provides

- Current deployment status
- Recent deploy logs
- Preview environment URLs
- Project configuration

## How to Gather

\`\`\`bash
vercel list
vercel logs <deployment-url>
vercel inspect <deployment-url>
\`\`\`

## Output

Condense into deployment status summary.
```

**Actions skill**:
```markdown
---
name: syner-vercel-actions
description: Vercel operations like creating sandboxes, triggering deploys, and managing environments. Use when the task requires deployment operations.
---

Execute actions on Vercel.

## Available Actions

- Create sandbox environment
- Trigger deployment
- Promote preview to production
- Rollback deployment

## How to Execute

\`\`\`bash
vercel deploy
vercel promote <deployment-url>
vercel rollback
\`\`\`

## Verification

After each action, verify with `vercel list` to confirm status.
```

## Flow Summary

1. User asks syner to do something
2. syner invokes syner-context
3. syner-context discovers `packages/**/skills/context/SKILL.md`
4. Reads descriptions, decides which are relevant (LLM decides)
5. Invokes relevant skills, each returns condensed context
6. syner receives context, decides next step
7. If actions needed → syner-worker
8. syner-worker discovers `packages/**/skills/actions/SKILL.md`
9. Invokes relevant action skills
10. Action → Verify → Repeat until done
11. Returns to syner → returns to user

## Key Principles

1. **Self-contained skills**: Each skill works independently
2. **Clear descriptions**: The LLM decides relevance based on description alone
3. **Condensed output**: Context skills return summaries, not raw data
4. **Verification**: Action skills verify success after each operation
5. **No cross-references**: Skills don't know about each other
