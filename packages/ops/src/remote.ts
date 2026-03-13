import {
  createContext,
  createAction,
  verify,
  createResult,
  type OspResult,
} from '@syner/osprotocol'

export interface RemoteInstanceCard {
  name: string
  description: string
  url: string
  version: string
  skills: Array<{
    id: string
    name: string
    description: string
  }>
}

export interface RemoteInvokeInput {
  skill: string
  input: Record<string, unknown>
}

/**
 * Fetch the agent.json from a remote syner instance.
 * Returns the InstanceCard describing the remote agent and its public skills.
 */
export async function fetchRemoteAgent(url: string): Promise<RemoteInstanceCard> {
  const agentUrl = url.endsWith('/') ? `${url}agent` : `${url}/agent`
  const response = await fetch(agentUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch remote agent at ${agentUrl}: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<RemoteInstanceCard>
}

/**
 * Invoke a skill on a remote syner instance.
 *
 * 1. Fetches remote agent.json to verify the skill exists
 * 2. Checks preconditions (skill is public and available)
 * 3. Sends task to the remote instance
 * 4. Validates response and returns OspResult
 */
export async function invokeRemote(url: string, input: RemoteInvokeInput): Promise<OspResult> {
  const startTime = Date.now()

  // 1. Build context
  const context = createContext({
    agentId: 'local',
    skillRef: `remote:${url}/${input.skill}`,
    loaded: [{ type: 'api' as const, ref: url, summary: 'Remote syner instance' }],
    missing: [],
  })

  // 2. Fetch remote agent card and check skill exists
  const remoteCard = await fetchRemoteAgent(url)
  const skillExists = remoteCard.skills.some((s) => s.id === input.skill)

  const action = createAction({
    description: `Invoke ${input.skill} on remote instance ${remoteCard.name}`,
    preconditions: [
      { check: 'Remote instance is reachable', met: true },
      { check: `Skill "${input.skill}" is public on remote instance`, met: skillExists },
    ],
    expectedEffects: [
      { description: 'Remote skill executed successfully', verifiable: true },
      { description: 'Valid response received', verifiable: true },
    ],
  })

  // 3. Check preconditions
  if (!skillExists) {
    const verification = verify(action.expectedEffects, {
      'Remote skill executed successfully': false,
      'Valid response received': false,
    })
    return {
      ...createResult(context, action, verification),
      duration: Date.now() - startTime,
    }
  }

  // 4. Send task to remote instance
  try {
    const taskUrl = url.endsWith('/') ? `${url}agent` : `${url}/agent`
    const response = await fetch(taskUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      const verification = verify(action.expectedEffects, {
        'Remote skill executed successfully': false,
        'Valid response received': false,
      })
      return {
        ...createResult(context, action, verification),
        duration: Date.now() - startTime,
      }
    }

    const output = await response.json()

    const verification = verify(action.expectedEffects, {
      'Remote skill executed successfully': true,
      'Valid response received': true,
    })

    return {
      ...createResult(context, action, verification, output),
      duration: Date.now() - startTime,
    }
  } catch (error) {
    const verification = verify(action.expectedEffects, {
      'Remote skill executed successfully': false,
      'Valid response received': false,
    })

    return {
      ...createResult(context, action, verification, {
        error: error instanceof Error ? error.message : String(error),
      }),
      duration: Date.now() - startTime,
    }
  }
}
