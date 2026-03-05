## Status: fixed

## Changes

- Added missing symlink: `skills/vercel-setup` -> `../apps/bot/skills/vercel-setup`

## Verification

All 20 skills (19 symlinks + 1 real dir `syner`) resolve correctly.

| Skill | Source | Status |
|-------|--------|--------|
| create-syner | apps/dev/skills/create-syner | ok |
| create-syner-agent | apps/dev/skills/create-syner-agent | ok |
| create-syner-app | apps/dev/skills/create-syner-app | ok |
| create-syner-skill | apps/dev/skills/create-syner-skill | ok |
| syner | skills/syner (real dir) | ok |
| syner-backlog-reviewer | apps/dev/skills/syner-backlog-reviewer | ok |
| syner-backlog-triager | apps/dev/skills/syner-backlog-triager | ok |
| syner-daily-standup | apps/dev/skills/syner-daily-standup | ok |
| syner-enhance-skills | apps/dev/skills/syner-enhance-skills | ok |
| syner-find-ideas | apps/notes/skills/syner-find-ideas | ok |
| syner-find-links | apps/notes/skills/syner-find-links | ok |
| syner-fix-symlinks | apps/dev/skills/syner-fix-symlinks | ok |
| syner-gh-auth | packages/github/skills/syner-gh-auth | ok |
| syner-grow-note | apps/notes/skills/syner-grow-note | ok |
| syner-load-all | apps/notes/skills/syner-load-all | ok |
| syner-researcher | apps/dev/skills/syner-researcher | ok |
| syner-skill-reviewer | apps/dev/skills/syner-skill-reviewer | ok |
| syner-track-idea | apps/notes/skills/syner-track-idea | ok |
| test-syner-agent | apps/dev/skills/test-syner-agent | ok |
| update-syner-app | apps/dev/skills/update-syner-app | ok |
| vercel-setup | apps/bot/skills/vercel-setup | fixed |
