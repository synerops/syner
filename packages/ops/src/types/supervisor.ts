import type { Approval } from '@syner/osprotocol'

export interface Decisions {
  decisions: Approval[]
  patterns: string[]
}

export type Decision = Approval
