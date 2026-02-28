# GitHub App: No webhook needed

**Date**: 2026-02-26

## Decision

For synerbot's GitHub App, we don't need a webhook endpoint to capture `installation_id` when users install the app.

## Reasoning

Our use case is **syner → GitHub** (agent initiates actions), not **GitHub → syner** (reacting to events).

- Skills like `backlog-triager` and `syner-worker` CREATE issues and PRs
- They don't need to REACT to mentions or comments
- Each user configures `GITHUB_APP_INSTALLATION_ID` in their environment

## The alternative (rejected)

Webhook would be needed if:
- Users mention `@synerbot` in PRs/issues and expect a response
- We wanted automatic `installation_id` capture on install

## Result

Simple setup:
1. User installs GitHub App
2. User copies `installation_id` from URL (`github.com/settings/installations/XXXXX`)
3. User sets `GITHUB_APP_INSTALLATION_ID` env var
4. Done

No server, no database, no webhook. Each user manages their own config.
