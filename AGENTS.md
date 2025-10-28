# Syner OS

## What is Syner OS?

Syner OS is an **Agentic Operating System** - a platform where AI agents operate following systematic patterns to gather context, execute actions, and verify results in a continuous loop.

## Architecture

- **OS Protocol** (separate spec) - Defines the agent loop contract
- **@syner/sdk** - TypeScript implementation of the protocol
- **syner** - The fullstack agent built with the SDK

## Documentation Hierarchy

Syner uses hierarchical AGENTS.md files to avoid redundancy:

- `/AGENTS.md` (this file) - Project overview, what is Syner OS
- `/apps/*/AGENTS.md` - App-specific architecture and rules
- `/packages/*/AGENTS.md` - Package-specific architecture and rules

**Rules:**

- Root AGENTS.md = context ("what is this?")
- Package AGENTS.md = architecture ("how does it work?")
- NEVER duplicate information across levels
- Read root first, then navigate to package for details

## OS Protocol Specification

**IMPORTANT**: Before implementing agents, modifying the SDK, or working with the agent loop (context/actions/checks), you MUST fetch and understand the OS Protocol specification.

**When to fetch the protocol**:

- Before building new agents
- Before modifying SDK core functionality
- When implementing context/actions/checks APIs
- When working on the agent loop or orchestration
- When you need to understand the contract that all agents must follow

**How to fetch**:
Run this command to get the latest protocol specification (only fetch when needed to save tokens):

```bash
curl -s --location 'https://raw.githubusercontent.com/synerops/protocol/refs/heads/main/AGENTS.md' \
--header 'Accept: text/markdown'
```

The protocol defines:

- The agent loop contract (context → actions → checks → repeat)
- MUST/NEVER rules that all implementations must follow
- Interface contracts for Agent, Context, Action, and Check primitives
- Communication patterns between agents

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

- `/packages/sdk/` - TypeScript implementation of the OS Protocol
- `/apps/syner/` - The fullstack agent (CLI + Express + API)
- `/apps/docs/` - Documentation site
- `/packages/ui/` - Shared UI components and design system
- `/tooling/` - Development tooling (eslint, prettier, typescript)
