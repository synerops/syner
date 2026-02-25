---
name: create-syner-app
description: Scaffold new applications following the syner common stack. Use when creating new apps, projects, or when the user says "nueva app", "create app", "new project", or "scaffold".
metadata:
  author: syner
  version: "0.0.2"
---

# Create Syner App

## Purpose

Create new applications with the syner standard stack consistently. This ensures all apps in the ecosystem share the same foundation and tooling.

## When to Use

- User asks to create a new app or project
- User mentions "scaffold", "nueva app", "create app", "new project"
- Starting a project from scratch within the syner ecosystem

## Instructions

### 1. Find Project Root

Navigate upward from the current working directory until you find a directory containing `apps/`. Use `ls` to verify. If no `apps/` directory exists, ask the user where to create the project.

### 2. Read Current Stack

Use the `Read` tool to load `apps/notes/content/projects/common-stack.md`.

This step is mandatory - the skill ALWAYS reads common-stack.md before acting. This allows the stack to evolve without modifying the skill.

### 3. Get Project Name

If project name not provided as argument, ask the user:
```
What should the app be called?
```

### 4. Determine Location

If location not provided, use `apps/[name]` as default within the project root.

### 5. Check if App Exists

Before creating, verify `apps/[name]` doesn't already exist. If it does, ask the user:
- Overwrite the existing app
- Choose a different name
- Cancel the operation

### 6. Create the Project

Use `Bash` tool to run:
```bash
bunx create-next-app@latest apps/[name] --typescript --tailwind --eslint --app --import-alias "@/*" --yes
```

The `--yes` flag accepts all defaults automatically.

### 7. Initialize shadcn

Use `Bash` tool to run:
```bash
cd apps/[name] && bunx shadcn@latest init --defaults
```

### 8. Report Result

Output using the format below.

### 9. Suggest Next Steps

Suggest the user run:
```bash
cd apps/[name] && bun dev
```

## Output Format

ALWAYS use this structure:

- **Project Created**: `apps/[name]`
- **Stack Applied**: Next.js + TypeScript + Tailwind CSS + shadcn/ui
- **Next Steps**:
  - `cd apps/[name] && bun dev` to start development server
  - Use `/vercel-react-best-practices` when reviewing code
  - Use `/web-design-guidelines` for UI/design reviews

## Usage

```
/create-syner-app [app-name]
```

Examples:
- `/create-syner-app my-dashboard` - Create app named "my-dashboard"
- `/create-syner-app` - Will prompt for app name

## Testing

After testing this skill, clean up:
```bash
rm -rf apps/[test-app-name]
```

## Notes

- The stack is defined in `common-stack.md` and read dynamically
- All syner apps use TypeScript + Bun as the runtime
- shadcn is the design system for consistency across apps
- Use `vercel` CLI for production deployments
- Use `gh` CLI for git operations
