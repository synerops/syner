# Syner OS

## What is Syner OS?

Syner OS is an **Agentic Operating System**.

## Architecture
Syner OS architecture follows exclusively Anthropic's "Building Effective Agents" as the technical foundation. When making architectural decisions, reference Anthropic's patterns first and only add custom solutions when specific needs aren't covered by their patterns.

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
