import type { OspResult } from '@syner/osprotocol'
import { appendFile, readFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

export interface FrictionEvent {
  skillRef: string
  failureType: string
  context: string
  frequency: number
  firstSeen: string
  lastSeen: string
}

const DEFAULT_PATH = '.syner/ops/friction.jsonl'

export async function logFriction(
  result: OspResult,
  storagePath: string = DEFAULT_PATH
): Promise<FrictionEvent> {
  const now = new Date().toISOString()
  const failureType = result.verification.status === 'failed'
    ? 'verification_failed'
    : result.verification.status === 'partial'
      ? 'partial_verification'
      : 'unknown'

  const failedAssertions = result.verification.assertions
    .filter((a) => !a.result)
    .map((a) => a.effect)
    .join('; ')

  // Read existing events to update frequency
  const existing = await readFrictionLog(storagePath)
  const match = existing.find(
    (e) => e.skillRef === result.context.skillRef && e.failureType === failureType
  )

  const event: FrictionEvent = {
    skillRef: result.context.skillRef,
    failureType,
    context: failedAssertions || result.action.description,
    frequency: match ? match.frequency + 1 : 1,
    firstSeen: match ? match.firstSeen : now,
    lastSeen: now,
  }

  await mkdir(dirname(storagePath), { recursive: true })
  await appendFile(storagePath, JSON.stringify(event) + '\n')

  return event
}

export async function readFrictionLog(
  storagePath: string = DEFAULT_PATH
): Promise<FrictionEvent[]> {
  try {
    const content = await readFile(storagePath, 'utf-8')
    return content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as FrictionEvent)
  } catch {
    return []
  }
}
