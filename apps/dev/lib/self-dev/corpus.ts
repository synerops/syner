import type { Proposal } from '@syner/ops'
import type { Approval } from '@syner/osprotocol'
import { appendFile, readFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

export interface SelfDevDecision {
  proposal: Proposal
  approval: Approval
}

interface SelfDevCorpus {
  decisions: SelfDevDecision[]
  patterns: string[]
}

const DEFAULT_PATH = '.syner/ops/decisions.jsonl'

export async function logDecision(
  decision: SelfDevDecision,
  storagePath: string = DEFAULT_PATH
): Promise<void> {
  await mkdir(dirname(storagePath), { recursive: true })
  await appendFile(storagePath, JSON.stringify(decision) + '\n')
}

export async function getCorpus(
  storagePath: string = DEFAULT_PATH
): Promise<SelfDevCorpus> {
  const decisions = await readDecisions(storagePath)
  const patterns = extractPatterns(decisions)
  return { decisions, patterns }
}

export async function findSimilar(
  skillRef: string,
  storagePath: string = DEFAULT_PATH
): Promise<SelfDevDecision[]> {
  const decisions = await readDecisions(storagePath)
  return decisions.filter((d) => d.proposal.skillRef === skillRef)
}

async function readDecisions(storagePath: string): Promise<SelfDevDecision[]> {
  try {
    const content = await readFile(storagePath, 'utf-8')
    return content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as SelfDevDecision)
  } catch {
    return []
  }
}

function extractPatterns(decisions: SelfDevDecision[]): string[] {
  const seen = new Set<string>()
  for (const d of decisions) {
    const status = d.approval.approved ? 'approved' : 'rejected'
    seen.add(`${d.proposal.category}:${status}`)
  }
  return Array.from(seen)
}
