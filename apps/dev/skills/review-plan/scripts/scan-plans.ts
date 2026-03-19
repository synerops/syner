/**
 * Scan v0.1.0 plans and return their status + dependency state.
 *
 * Usage: bun run skills/review-plan/scripts/scan-plans.ts [plans-dir]
 *
 * Output: JSON with each plan's status, dependencies, and whether it's reviewable.
 * A plan is "reviewable" when it's draft and all its dependencies are approved or done.
 */

import { readdirSync, readFileSync, existsSync } from "fs"
import { join } from "path"

const plansRoot = process.argv[2] || ".syner/plans/v0.1.0"

// Execution order from ACTION.md — Phase 1 first, then Phase 2, then Phase 3
const epicOrder = [
  "03-orchestrator-prompts",
  "04-skill-cli",
  "01-agents-spawn",
  "05-apps-as-tools",
  "02-linear-integration",
]

// Epic number shortcuts (E03, E04, etc.) map to epic dirs
const epicNumbers: Record<string, string> = {
  "01": "01-agents-spawn",
  "02": "02-linear-integration",
  "03": "03-orchestrator-prompts",
  "04": "04-skill-cli",
  "05": "05-apps-as-tools",
}

interface PlanInfo {
  epic: string
  file: string
  path: string
  status: string
  depRefs: DepRef[]
  reviewable: boolean
}

interface DepRef {
  raw: string
  type: "plan" | "epic" | "unknown"
  epicDir?: string
  planFile?: string
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  try {
    return Bun.YAML.parse(match[1]) as Record<string, string>
  } catch {
    return {}
  }
}

/**
 * Parse dependency lines and resolve them to plan/epic references.
 *
 * Patterns found in v0.1.0 plans:
 *   - "**01 (provisioning-vocabulary):**" → same-epic plan by number prefix
 *   - "**00-spawn-types.md**" → same-epic plan by filename
 *   - "**Epic 03 (...):**" or "**E03+E04**" → cross-epic dependency
 *   - "**04-vercel-spawn-adapter.md**" → same-epic plan by full filename
 *   - "01/00", "03/01" → epic/plan shorthand
 */
function parseDependencies(content: string, currentEpic: string): DepRef[] {
  const deps: DepRef[] = []
  const depSection = content.match(/## Dependencies\n\n?([\s\S]*?)(?=\n## )/)?.[1] || ""

  const lines = depSection.split("\n").filter(l => l.match(/^[-*]\s/))

  for (const line of lines) {
    const raw = line.replace(/^[-*]\s*/, "").trim()
    if (!raw || raw.toLowerCase().startsWith("none") || raw.toLowerCase().startsWith("existing")) continue

    // Cross-epic: "Epic 03", "E03", "E03+E04"
    const epicMatch = raw.match(/Epic\s*0?(\d)|E0?(\d)/i)
    if (epicMatch) {
      const num = epicMatch[1] || epicMatch[2]
      const epicDir = epicNumbers[num.padStart(2, "0")]
      if (epicDir) {
        deps.push({ raw, type: "epic", epicDir })
        continue
      }
    }

    // Same-epic plan by filename: "**00-spawn-types.md**" or "**00-spawn-types**"
    const fileMatch = raw.match(/\*\*((\d{2}-[\w-]+)(\.md)?)\*\*/)
    if (fileMatch) {
      const fname = fileMatch[2].endsWith(".md") ? fileMatch[2] : `${fileMatch[2]}.md`
      deps.push({ raw, type: "plan", epicDir: currentEpic, planFile: fname })
      continue
    }

    // Same-epic plan by number + name: "**01 (provisioning-vocabulary):**" or "**Plan 01** (command-types):"
    const numNameMatch = raw.match(/\*\*(?:Plan\s+)?0?(\d+)\*?\*?\s*\(?([^):*]+)/)
    if (numNameMatch) {
      const num = numNameMatch[1].padStart(2, "0")
      const name = numNameMatch[2].trim().replace(/[()]/g, "").replace(/\s+/g, "-")
      deps.push({ raw, type: "plan", epicDir: currentEpic, planFile: `${num}-${name}.md` })
      continue
    }

    // Bare bold filename without number: "**app-manifest-type:**" or "**linear-package**"
    const bareMatch = raw.match(/\*\*([\w-]+)\*\*/)
    if (bareMatch) {
      deps.push({ raw, type: "plan", epicDir: currentEpic, planFile: bareMatch[1] + ".md" })
      continue
    }

    // Shorthand: "01/00" (epic/plan)
    const shortMatch = raw.match(/0?(\d+)\/0?(\d+)/)
    if (shortMatch) {
      const epicDir = epicNumbers[shortMatch[1].padStart(2, "0")]
      if (epicDir) {
        deps.push({ raw, type: "plan", epicDir })
        continue
      }
    }

    deps.push({ raw, type: "unknown" })
  }

  return deps
}

function scanEpic(epicDir: string): PlanInfo[] {
  const plansDir = join(plansRoot, epicDir, "plans")
  if (!existsSync(plansDir)) return []

  const files = readdirSync(plansDir)
    .filter(f => f.endsWith(".md"))
    .sort()

  return files.map(file => {
    const filePath = join(plansDir, file)
    const content = readFileSync(filePath, "utf-8")
    const frontmatter = parseFrontmatter(content)
    const st = frontmatter.status || "draft"
    const depRefs = parseDependencies(content, epicDir)

    return {
      epic: epicDir,
      file,
      path: filePath,
      status: st,
      depRefs,
      reviewable: false,
    }
  })
}

// Scan all epics in execution order
const allPlans: PlanInfo[] = []
for (const epic of epicOrder) {
  allPlans.push(...scanEpic(epic))
}

// Build lookup: epicDir -> plan statuses
const plansByEpic = new Map<string, PlanInfo[]>()
for (const p of allPlans) {
  if (!plansByEpic.has(p.epic)) plansByEpic.set(p.epic, [])
  plansByEpic.get(p.epic)!.push(p)
}

// Check if an epic is fully approved/done
function isEpicMet(epicDir: string): boolean {
  const plans = plansByEpic.get(epicDir) || []
  return plans.every(p => p.status === "approved" || p.status === "done")
}

// Check if a specific plan dep is met
function isPlanMet(epicDir: string, planFile?: string): boolean {
  if (!planFile) return isEpicMet(epicDir)
  const plans = plansByEpic.get(epicDir) || []
  // Fuzzy match: planFile might not exactly match (e.g., missing number prefix)
  const match = plans.find(p =>
    p.file === planFile ||
    p.file.includes(planFile.replace(".md", "")) ||
    planFile.includes(p.file.replace(".md", ""))
  )
  if (!match) return false // Can't resolve dep — assume NOT met (conservative)
  return match.status === "approved" || match.status === "done"
}

// Compute reviewable
for (const plan of allPlans) {
  if (plan.status !== "draft") continue

  if (plan.depRefs.length === 0) {
    plan.reviewable = true
    continue
  }

  plan.reviewable = plan.depRefs.every(dep => {
    if (dep.type === "epic" && dep.epicDir) return isEpicMet(dep.epicDir)
    if (dep.type === "plan" && dep.epicDir) return isPlanMet(dep.epicDir, dep.planFile)
    return true // unknown deps don't block
  })
}

// Output
const reviewable = allPlans.filter(p => p.reviewable)
const nextPlan = reviewable[0] || null

const summary = {
  total: allPlans.length,
  byStatus: {
    draft: allPlans.filter(p => p.status === "draft").length,
    approved: allPlans.filter(p => p.status === "approved").length,
    "in-progress": allPlans.filter(p => p.status === "in-progress").length,
    review: allPlans.filter(p => p.status === "review").length,
    done: allPlans.filter(p => p.status === "done").length,
  },
  next: nextPlan ? { epic: nextPlan.epic, file: nextPlan.file, path: nextPlan.path } : null,
  reviewable: reviewable.map(p => ({
    epic: p.epic,
    file: p.file,
    path: p.path,
  })),
  plans: allPlans.map(p => ({
    epic: p.epic,
    file: p.file,
    status: p.status,
    reviewable: p.reviewable,
    deps: p.depRefs.map(d => d.type === "unknown" ? d.raw.slice(0, 50) : `${d.type}:${d.epicDir || ""}/${d.planFile || "*"}`),
  })),
}

console.log(JSON.stringify(summary, null, 2))
