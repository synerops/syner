# Dev Ecosystem Friction Observations

Raw observations of when ecosystem building failed.
These will be reviewed for patterns → proposals → specialists.

---

## 2025-03-10 | workflow | vercel-deploy-cost-turbo-ignore

**Friction:** Vercel deploys ALL apps on every PR, becoming costly. `turbo-ignore` is configured but behavior is inconsistent — sometimes excludes builds, sometimes includes them randomly.

**Context:**
- 4 apps: `notes`, `bot`, `dev`, `design`
- All use `"ignoreCommand": "npx turbo-ignore"` in vercel.json
- `turbo.json` defines build outputs as `.next/**`
- Skills are `.md` files symlinked to `.claude/skills/`

**Root cause hypotheses:**
1. `turbo-ignore` may see `.md` edits as dependency changes (skills symlinked into apps)
2. Turbo's dependency graph might not correctly isolate apps
3. Missing `dependsOn` configuration for cross-app boundaries

**Impact:**
- Unnecessary Vercel builds on every PR
- Cost accumulation
- Slow PR feedback cycles

**Potential directions:**
- Custom ignore script that understands syner's structure
- Better turbo.json configuration with explicit inputs/outputs
- `ops-deploy-optimizer` specialist that understands monorepo deploy patterns

**Tags:** #workflow #vercel #turbo #cost #monorepo

---

