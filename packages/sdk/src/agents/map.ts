import type { AgentCard } from './types'

export class AgentsMap extends Map<string, AgentCard> {
  byChannel(): Map<string, AgentCard> {
    const map = new Map<string, AgentCard>()
    for (const agent of this.values()) {
      const channel = agent.metadata?.channel as string | undefined
      if (channel) map.set(channel, agent)
    }
    return map
  }
}
