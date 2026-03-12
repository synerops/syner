export type ChangeCategory = 'skill-tweak' | 'new-skill' | 'structural'

export interface MetricThreshold {
  metric: string
  before: number
  required: number
}

export interface ChangeProposal {
  category: ChangeCategory
  description: string
  diff: string
  metrics: MetricThreshold[]
  skillRef: string
}
