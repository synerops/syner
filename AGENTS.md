# Syner OS

## What is Syner OS?

Syner OS is an **Agentic Operating System** - a platform where AI agents operate following systematic patterns to gather context, execute actions, and verify results in a continuous loop.

## Documentation Hierarchy

Syner uses hierarchical AGENTS.md files to avoid redundancy:

- `/AGENTS.md` (this file) - Project overview, what is Syner OS
- `/packages/*/AGENTS.md` - Package-specific architecture and rules

**Rules:**

- Root AGENTS.md = context ("what is this?")
- Package AGENTS.md = architecture ("how does it work?")
- NEVER duplicate information across levels
- Read root first, then navigate to package for details

## Web Interface Guidelines

**IMPORTANT**: Before building, modifying, or reviewing ANY user interface component, form, interaction, or visual element, you MUST fetch and follow Vercel's Web Interface Guidelines.

**When to fetch the guidelines**:

- Before creating new UI components
- Before modifying existing interfaces
- When reviewing UI/UX code
- When implementing forms, animations, or interactions
- When working on accessibility features

**How to fetch**:
Run this command to get the latest guidelines (only fetch when needed to save tokens):

```bash
curl -s --location 'https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/refs/heads/main/AGENTS.md' \
--header 'Accept: text/markdown'
```

These guidelines use MUST/SHOULD/NEVER terminology and cover:

- Interactions (keyboard, forms, navigation, feedback)
- Animation (accessibility, performance)
- Layout (responsive, alignment)
- Content & Accessibility (a11y, semantics)
- Performance (rendering, optimization)
- Design (contrast, shadows, colors)

## Project Structure

This monorepo contains:

- `/packages/syner/` - The kernel of the OS (see its AGENTS.md for architecture details)
- `/packages/ui/` - Shared UI components and design system
- `/tooling/` - Development tooling (eslint, prettier, typescript) for local consistency
