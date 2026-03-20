/**
 * Scan plans and return their status + dependencies as raw data.
 *
 * Usage: bun run skills/syner/scripts/plans/scan.ts [plans-dir]
 *
 * The plans directory can be any directory with epic subdirectories containing plans/.
 * Defaults to .syner/plans/v0.1.0 if not specified.
 *
 * Output: JSON with each plan's status and dependency references.
 * No selection logic — the consumer decides what's actionable.
 */

import { readdirSync, readFileSync, existsSync, statSync, realpathSync } from "fs"
import { join, resolve, normalize } from "path"

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
 */
function resolveEpicOrder(root: string, discovered: string[]): string[] {
  const actionPath = join(root, "ACTION.md")
  if (!existsSync(actionPath)) return discovered.sort()

  try {
    const content = readFileSync(actionPath, "utf-8")
    const linkPattern = /\[.*?\]\(\.\/([^/)]+)\/?\)/g
    const ordered: string[] = []
    let match: RegExpExecArray | null

    while ((match = linkPattern.exec(content)) !== null) {
      const dir = match[1]
      if (discovered.includes(dir) && !ordered.includes(dir)) {
        ordered.push(dir)
      }
    }

    for (const d of discovered) {
      if (!ordered.includes(d)) ordered.push(d)
    }

    return ordered
  } catch {
    return discovered.sort()
  }
}

// --- Plan parsing ---

interface PlanInfo {
  epic: string
  file: string
  status: string
  deps: string[]
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
 * Extract dependency lines as raw strings from the ## Dependencies section.
 */
function parseDependencies(content: string): string[] {
  const depSection = content.match(/## Dependencies\n\n?([\s\S]*?)(?=\n## )/)?.[1] || ""
  return depSection
    .split("\n")
    .filter(l => l.match(/^[-*]\s/))
    .map(l => l.replace(/^[-*]\s*/, "").trim())
    .filter(l => l && !l.toLowerCase().startsWith("none") && !l.toLowerCase().startsWith("existing"))
}

// --- Scanning ---

function scanEpic(plansRoot: string, epicDir: string): PlanInfo[] {
  const plansDir = join(plansRoot, epicDir, "plans")
  if (!existsSync(plansDir)) return []

  const files = readdirSync(plansDir)
    .filter(f => f.endsWith(".md") && !f.endsWith(".verification.md"))
    .sort()

  return files.map(file => {
    const filePath = join(plansDir, file)
    const content = safeReadFile(filePath, plansRoot)
    const frontmatter = parseFrontmatter(content)

    return {
      epic: epicDir,
      file,
      status: frontmatter.status || "draft",
      deps: parseDependencies(content),
    }
  })
}

// --- Main ---

process.on("uncaughtException", err => {
  console.error(JSON.stringify({ error: err.message }))
  process.exit(1)
})

const plansRoot = process.argv[2] || ".syner/plans/v0.1.0"
const validatedRoot = validatePlansRoot(plansRoot)

const discovered = discoverEpics(validatedRoot)
const epicOrder = resolveEpicOrder(validatedRoot, discovered)

const allPlans: PlanInfo[] = []
for (const epic of epicOrder) {
  allPlans.push(...scanEpic(validatedRoot, epic))
}

const byStatus: Record<string, number> = {}
for (const p of allPlans) {
  byStatus[p.status] = (byStatus[p.status] || 0) + 1
}

console.log(JSON.stringify({ total: allPlans.length, byStatus, plans: allPlans }, null, 2))
