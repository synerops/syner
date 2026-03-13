export type Category = 'skill-tweak' | 'new-skill' | 'structural'

/** @deprecated Use Category instead */
export type ChangeCategory = Category

export interface Threshold {
  metric: string
  before: number
  required: number
}

/** @deprecated Use Threshold instead */
export type MetricThreshold = Threshold

export interface Proposal {
  category: Category
  description: string
  diff: string
  metrics: Threshold[]
  skillRef: string
}

/** @deprecated Use Proposal instead */
export type ChangeProposal = Proposal
