import type { SupervisorDecision, DecisionCorpus } from '@syner/ops'
import { appendFile, readFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

const DEFAULT_PATH = '.syner/ops/decisions.jsonl'

export async function logDecision(
  decision: SupervisorDecision,
  storagePath: string = DEFAULT_PATH
): Promise<void> {
  await mkdir(dirname(storagePath), { recursive: true })
  await appendFile(storagePath, JSON.stringify(decision) + '\n')
}

export async function getCorpus(
  storagePath: string = DEFAULT_PATH
): Promise<DecisionCorpus> {
  const decisions = await readDecisions(storagePath)
  const patterns = extractPatterns(decisions)
  return { decisions, patterns }
}

export async function findSimilar(
  skillRef: string,
  storagePath: string = DEFAULT_PATH
): Promise<SupervisorDecision[]> {
  const decisions = await readDecisions(storagePath)
  return decisions.filter((d) => d.proposal.skillRef === skillRef)
}

async function readDecisions(storagePath: string): Promise<SupervisorDecision[]> {
  try {
    const content = await readFile(storagePath, 'utf-8')
    return content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SupervisorDecision)
  } catch {
    return []
  }
}

function extractPatterns(decisions: SupervisorDecision[]): string[] {
  const seen = new Set<string>()
  for (const d of decisions) {
    seen.add(`${d.proposal.category}:${d.approved ? 'approved' : 'rejected'}`)
  }
  return Array.from(seen)
}
