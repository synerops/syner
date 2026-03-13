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

export interface SkillManifest {
  // v1 fields (existing SKILL.md frontmatter)
  name?: string
  description?: string
  category?: string
  metadata?: {
    version?: string
    author?: string
  }

  // v2 fields (all optional for backwards compatibility)
  preconditions?: string[]
  effects?: string[]
  verification?: string[]
  inputs?: InputField[]
  outputs?: OutputField[]
  visibility?: 'public' | 'private' | 'instance'
  notFor?: string[]
}

/** @deprecated Use SkillManifest instead */
export type SkillManifestV2 = SkillManifest
