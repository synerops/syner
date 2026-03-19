export type Category = 'skill-tweak' | 'new-skill' | 'structural'

export interface Threshold {
  metric: string
  before: number
  required: number
}

export interface Proposal {
  category: Category
  description: string
  diff: string
  metrics: Threshold[]
  skillRef: string
}
