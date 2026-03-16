export interface InputField {
  name: string
  type: string
  required?: boolean
  description?: string
}

export interface OutputField {
  name: string
  type: string
  description?: string
}

export interface Skill {
  name?: string
  description?: string
  category?: string
  metadata?: {
    version?: string
    author?: string
  }
  preconditions?: string[]
  effects?: string[]
  verification?: string[]
  inputs?: InputField[]
  outputs?: OutputField[]
  visibility?: 'public' | 'private' | 'instance'
  notFor?: string[]
}
