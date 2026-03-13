import type { Proposal } from '@syner/ops'
import type { Approval } from '@syner/osprotocol'
import { writeFile, mkdir } from 'fs/promises'
import { dirname, join } from 'path'

export interface DeployResult {
  deployed: boolean
  proposal: Proposal
  reason: string
  timestamp: string
  artifactPath?: string
}

/**
 * Deploy an approved change proposal.
 * Only proceeds if decision.decision === 'approved'.
 */
export async function deploy(
  proposal: Proposal,
  decision: Approval
): Promise<DeployResult> {
  const timestamp = new Date().toISOString()

  if (decision.decision !== 'approved') {
    return {
      deployed: false,
      proposal,
      reason: `Rejected by ${decision.reviewer ?? 'unknown'}: ${decision.reason ?? 'no reason'}`,
      timestamp,
    }
  }

  if (!proposal.diff) {
    return {
      deployed: false,
      proposal,
      reason: 'No diff to apply',
      timestamp,
    }
  }

  // Write the approved diff as an artifact for manual or automated application
  const artifactDir = '.syner/ops/deploys'
  const artifactName = `${proposal.skillRef}-${Date.now()}.patch`
  const artifactPath = join(artifactDir, artifactName)

  await mkdir(artifactDir, { recursive: true })
  await writeFile(artifactPath, proposal.diff)

  return {
    deployed: true,
    proposal,
    reason: `Approved by ${decision.reviewer ?? 'unknown'}: ${decision.reason ?? 'no reason'}`,
    timestamp,
    artifactPath,
  }
}
