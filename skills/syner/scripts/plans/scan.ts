/**
 * Scan plans and return their status + dependency state.
 *
 * Usage: bun run skills/review-plan/scripts/scan-plans.ts [--mode review|execute] [plans-dir]
 *
 * Modes:
 *   review  (default) — find draft plans whose deps are approved or done
 *   execute — find approved plans whose deps are strictly done
 *
 * The plans directory can be any directory with epic subdirectories containing plans/.
 * Defaults to .syner/plans/v0.1.0 if not specified.
 *
 * Output: JSON with each plan's status, dependencies, and selection state.
 */

import { readdirSync, readFileSync, existsSync, statSync, realpathSync } from "fs"
import { join, resolve, normalize } from "path"

// --- Argument parsing ---

const VALID_MODES = ["review", "execute"] as const
type Mode = (typeof VALID_MODES)[number]

function parseArgs(argv: string[]): { mode: Mode; plansRoot: string } {
  const args = argv.slice(2)
  let mode: Mode = "review"
  let plansRoot = ".syner/plans/v0.1.0"

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--mode") {
      const value = args[i + 1]
      if (!value || !VALID_MODES.includes(value as Mode)) {
        fail(`Invalid mode: ${value}. Must be one of: ${VALID_MODES.join(", ")}`)
      }
      mode = value as Mode
      i++ // skip value
    } else if (!args[i].startsWith("--")) {
      plansRoot = args[i]
    }
  }

  return { mode, plansRoot }
}

// --- Safety ---

const MAX_PLAN_SIZE = 256 * 1024 // 256 KB

function fail(message: string): never {
  console.error(JSON.stringify({ error: message }))
  process.exit(1)
}

function validatePlansRoot(root: string): string {
  const resolved = resolve(root)
  const normalized = normalize(resolved)
  const allowedBase = resolve(".syner/plans")

  if (!normalized.startsWith(allowedBase)) {
    fail(`Plans directory must be under .syner/plans/. Got: ${root}`)
  }

  if (!existsSync(normalized)) {
    fail(`Plans directory does not exist: ${root}`)
  }

  return normalized
}

function safeReadFile(filePath: string, allowedPrefix: string): string {
  const real = realpathSync(filePath)
  if (!real.startsWith(allowedPrefix)) {
    fail(`Path escapes allowed directory: ${filePath} -> ${real}`)
  }
  const stat = statSync(filePath)
  if (stat.size > MAX_PLAN_SIZE) {
    fail(`File too large: ${filePath} (${stat.size} bytes, max ${MAX_PLAN_SIZE})`)
  }
  return readFileSync(filePath, "utf-8")
}

// --- Epic discovery ---

/**
 * Discover epic directories from the filesystem.
 * Any subdirectory that contains a plans/ folder is an epic.
 */
function discoverEpics(root: string): string[] {
  return readdirSync(root, { withFileTypes: true })
    .filter(entry => {
      if (!entry.isDirectory()) return false
      const plansDir = join(root, entry.name, "plans")
      return existsSync(plansDir)
    })
    .map(entry => entry.name)
}

/**
 * Try to parse execution order from ACTION.md's Epics table.
 * Falls back to natural sort of discovered directories.
 *
 * The table format is:
 *   | # | Epic | Package(s) | Status | Depends On |
 *   | [03](./03-orchestrator-prompts/) | ... |
 */
function resolveEpicOrder(root: string, discovered: string[]): string[] {
  const actionPath = join(root, "ACTION.md")
  if (!existsSync(actionPath)) return discovered.sort()

  try {
    const content = readFileSync(actionPath, "utf-8")

    // Find table rows that link to epic directories: [03](./03-orchestrator-prompts/)
    const linkPattern = /\[.*?\]\(\.\/([^/)]+)\/?\)/g
    const ordered: string[] = []
    let match: RegExpExecArray | null

    while ((match = linkPattern.exec(content)) !== null) {
      const dir = match[1]
      if (discovered.includes(dir) && !ordered.includes(dir)) {
        ordered.push(dir)
      }
    }

    // Append any discovered epics not in ACTION.md (safety net)
    for (const d of discovered) {
      if (!ordered.includes(d)) ordered.push(d)
    }

    return ordered
  } catch {
    return discovered.sort()
  }
}

/**
 * Build a map from number shortcuts to epic directory names.
 * "01-agents-spawn" → epicNumbers["01"] = "01-agents-spawn"
 * Also maps by full name for non-numbered directories.
 */
function buildEpicLookup(epics: string[]): Record<string, string> {
  const lookup: Record<string, string> = {}
  for (const epic of epics) {
    // Extract leading number if present: "03-orchestrator-prompts" → "03"
    const numMatch = epic.match(/^(\d+)/)
    if (numMatch) {
      lookup[numMatch[1]] = epic
    }
    // Always map full name to itself for direct references
    lookup[epic] = epic
  }
  return lookup
}

// --- Plan parsing ---

interface PlanInfo {
  epic: string
  file: string
  path: string
  status: string
  depRefs: DepRef[]
  selected: boolean // "reviewable" in review mode, "executable" in execute mode
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
    const parsed = Bun.YAML.parse(match[1])
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {}
    const result: Record<string, string> = {}
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === "string") result[key] = val
    }
    return result
  } catch {
    return {}
  }
}

/**
 * Parse dependency lines and resolve them to plan/epic references.
 *
 * Supported patterns:
 *   - "**01 (provisioning-vocabulary):**" → same-epic plan by number prefix
 *   - "**00-spawn-types.md**" → same-epic plan by filename
 *   - "**Epic 03 (...):**" or "**E03+E04**" → cross-epic dependency
 *   - "**04-vercel-spawn-adapter.md**" → same-epic plan by full filename
 *   - "01/00", "03/01" → epic/plan shorthand
 */
function parseDependencies(
  content: string,
  currentEpic: string,
  epicLookup: Record<string, string>,
): DepRef[] {
  const deps: DepRef[] = []
  const depSection = content.match(/## Dependencies\n\n?([\s\S]*?)(?=\n## )/)?.[1] || ""

  const lines = depSection.split("\n").filter(l => l.match(/^[-*]\s/))

  for (const line of lines) {
    const raw = line.replace(/^[-*]\s*/, "").trim()
    if (!raw || raw.toLowerCase().startsWith("none") || raw.toLowerCase().startsWith("existing"))
      continue

    // Cross-epic: "Epic 03", "E03", "E03+E04"
    const epicMatch = raw.match(/Epic\s*0?(\d)|E0?(\d)/i)
    if (epicMatch) {
      const num = (epicMatch[1] || epicMatch[2]).padStart(2, "0")
      const epicDir = epicLookup[num]
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

    // Same-epic plan by number + name: "**01 (provisioning-vocabulary):**"
    const numNameMatch = raw.match(/\*\*(?:Plan\s+)?0?(\d+)\*?\*?\s*\(?([^):*]+)/)
    if (numNameMatch) {
      const num = numNameMatch[1].padStart(2, "0")
      const name = numNameMatch[2]
        .trim()
        .replace(/[()]/g, "")
        .replace(/\s+/g, "-")
      deps.push({ raw, type: "plan", epicDir: currentEpic, planFile: `${num}-${name}.md` })
      continue
    }

    // Bare bold filename without number: "**app-manifest-type:**"
    const bareMatch = raw.match(/\*\*([\w-]+)\*\*/)
    if (bareMatch) {
      deps.push({ raw, type: "plan", epicDir: currentEpic, planFile: bareMatch[1] + ".md" })
      continue
    }

    // Shorthand: "01/00" (epic/plan)
    const shortMatch = raw.match(/0?(\d+)\/0?(\d+)/)
    if (shortMatch) {
      const epicDir = epicLookup[shortMatch[1].padStart(2, "0")]
      if (epicDir) {
        deps.push({ raw, type: "plan", epicDir })
        continue
      }
    }

    deps.push({ raw, type: "unknown" })
  }

  return deps
}

// --- Scanning ---

function scanEpic(
  plansRoot: string,
  epicDir: string,
  epicLookup: Record<string, string>,
): PlanInfo[] {
  const plansDir = join(plansRoot, epicDir, "plans")
  if (!existsSync(plansDir)) return []

  const files = readdirSync(plansDir)
    .filter(f => f.endsWith(".md"))
    .sort()

  return files.map(file => {
    const filePath = join(plansDir, file)
    const content = safeReadFile(filePath, plansRoot)
    const frontmatter = parseFrontmatter(content)
    const st = frontmatter.status || "draft"
    const depRefs = parseDependencies(content, epicDir, epicLookup)

    return {
      epic: epicDir,
      file,
      path: filePath,
      status: st,
      depRefs,
      selected: false,
    }
  })
}

// --- Dependency resolution ---

function isDepMet(status: string, mode: Mode): boolean {
  return mode === "execute" ? status === "done" : status === "approved" || status === "done"
}

function isEpicMet(
  epicDir: string,
  plansByEpic: Map<string, PlanInfo[]>,
  mode: Mode,
): boolean {
  const plans = plansByEpic.get(epicDir) || []
  return plans.every(p => isDepMet(p.status, mode))
}

function isPlanMet(
  epicDir: string,
  planFile: string | undefined,
  plansByEpic: Map<string, PlanInfo[]>,
  mode: Mode,
): boolean {
  if (!planFile) return isEpicMet(epicDir, plansByEpic, mode)
  const plans = plansByEpic.get(epicDir) || []
  const match = plans.find(
    p =>
      p.file === planFile ||
      p.file.includes(planFile.replace(".md", "")) ||
      planFile.includes(p.file.replace(".md", "")),
  )
  if (!match) return false // Can't resolve dep — assume NOT met (conservative)
  return isDepMet(match.status, mode)
}

// --- Main ---

process.on("uncaughtException", err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})

const { mode, plansRoot } = parseArgs(process.argv)
const validatedRoot = validatePlansRoot(plansRoot)

// Discover and order epics
const discovered = discoverEpics(validatedRoot)
const epicOrder = resolveEpicOrder(validatedRoot, discovered)
const epicLookup = buildEpicLookup(epicOrder)

// Scan all epics in execution order
const allPlans: PlanInfo[] = []
for (const epic of epicOrder) {
  allPlans.push(...scanEpic(validatedRoot, epic, epicLookup))
}

// Build lookup: epicDir -> plan statuses
const plansByEpic = new Map<string, PlanInfo[]>()
for (const p of allPlans) {
  if (!plansByEpic.has(p.epic)) plansByEpic.set(p.epic, [])
  plansByEpic.get(p.epic)!.push(p)
}

// Compute selection based on mode
const targetStatus = mode === "execute" ? "approved" : "draft"

for (const plan of allPlans) {
  if (plan.status !== targetStatus) continue

  if (plan.depRefs.length === 0) {
    plan.selected = true
    continue
  }

  plan.selected = plan.depRefs.every(dep => {
    if (dep.type === "epic" && dep.epicDir)
      return isEpicMet(dep.epicDir, plansByEpic, mode)
    if (dep.type === "plan" && dep.epicDir)
      return isPlanMet(dep.epicDir, dep.planFile, plansByEpic, mode)
    return true // unknown deps don't block
  })
}

// Output
const selected = allPlans.filter(p => p.selected)
const nextPlan = selected[0] || null

const selectionKey = mode === "execute" ? "executable" : "reviewable"

const summary = {
  mode,
  total: allPlans.length,
  byStatus: {
    draft: allPlans.filter(p => p.status === "draft").length,
    refining: allPlans.filter(p => p.status === "refining").length,
    approved: allPlans.filter(p => p.status === "approved").length,
    "in-progress": allPlans.filter(p => p.status === "in-progress").length,
    review: allPlans.filter(p => p.status === "review").length,
    done: allPlans.filter(p => p.status === "done").length,
  },
  next: nextPlan ? { epic: nextPlan.epic, file: nextPlan.file, path: nextPlan.path } : null,
  [selectionKey]: selected.map(p => ({
    epic: p.epic,
    file: p.file,
    path: p.path,
  })),
  plans: allPlans.map(p => ({
    epic: p.epic,
    file: p.file,
    status: p.status,
    selected: p.selected,
    deps: p.depRefs.map(d =>
      d.type === "unknown"
        ? d.raw.slice(0, 50)
        : `${d.type}:${d.epicDir || ""}/${d.planFile || "*"}`,
    ),
  })),
}

console.log(JSON.stringify(summary, null, 2))
