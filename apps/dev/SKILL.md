---
name: syner-dev
description: Developer portal and SDK for the Syner ecosystem. Hosts skill registry, documentation, and agent scaffolding tools.
visibility: public
metadata:
  version: "0.1.0"
  author: syner
---

# syner.dev

Developer portal for the Syner ecosystem.

## Audience
Developers building agents, skills, and integrations with the Syner platform.

## Out of Scope
- A runtime execution environment. Use syner.bot for that.
- A design system. Use syner.design for that.

## Preconditions
- Valid API request

## Effects
- Skill information retrieved
- Documentation served

## Inputs
- slug (optional) — Skill slug for specific skill lookup

## Outputs
- Skill manifest or list of available skills
