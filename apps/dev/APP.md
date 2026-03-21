---
name: syner-dev
description: Developer portal and SDK for the Syner ecosystem. Hosts skill registry, documentation, and agent scaffolding tools.
visibility: public
metadata:
  version: "0.1.0"
  author: syner
---

# syner.dev

I am the developer portal for the Syner ecosystem.

## I am for
Developers building agents, skills, and integrations with the Syner platform.

## I am NOT
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
