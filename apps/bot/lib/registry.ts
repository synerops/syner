import {
  getAgentsList,
  getAgentByName,
  type AgentCard,
} from '@syner/sdk/agents'
import {
  getSkillsList,
  getSkillBySlug,
  type SkillContent,
} from '@syner/sdk/skills'
import type { Skill } from '@syner/osprotocol'
import path from 'path'

const projectRoot = path.resolve(process.cwd(), '../..')

export const agents = {
  list: (): Promise<AgentCard[]> => getAgentsList(projectRoot),
  get: (name: string): Promise<AgentCard | undefined> => getAgentByName(projectRoot, name),
}

export const skills = {
  list: (): Promise<Skill[]> => getSkillsList(projectRoot),
  get: (slug: string): Promise<SkillContent | null> => getSkillBySlug(projectRoot, slug),
}
