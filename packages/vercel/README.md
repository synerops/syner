# @syner/vercel

Vercel integration for syner agents. Provides context and actions for deployments, previews, and sandbox environments.

## Skills

### Context (`skills/context/SKILL.md`)

Provides deployment status, logs, and project configuration to syner-context.

### Actions (`skills/actions/SKILL.md`)

Enables deployment operations via syner-worker.

## Setup

1. Install Vercel CLI: `npm i -g vercel`
2. Authenticate: `vercel login`

## Usage

The skills are automatically discovered by syner-context and syner-worker based on task relevance.
