import { skills, agents } from '../registry'

// ---------------------------------------------------------------------------
// Skills handlers
// ---------------------------------------------------------------------------

/** GET /api/skills — list all skills */
export async function listSkills(): Promise<Response> {
  try {
    const list = await skills.list()
    return Response.json(list)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return Response.json(
      { error: 'Failed to fetch skills' },
      { status: 500 },
    )
  }
}

/** GET /api/skills/[slug] — get skill with content */
export async function getSkill(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params

  const skill = await skills.read(slug)
  if (!skill) {
    return Response.json({ error: 'Skill not found' }, { status: 404 })
  }
  return Response.json(skill)
}

/** For generateStaticParams on /api/skills/[slug] */
export async function generateSkillParams() {
  const list = await skills.list()
  return list.map(s => ({ slug: (s.metadata?.slug as string) || s.name }))
}

// ---------------------------------------------------------------------------
// Agents handlers
// ---------------------------------------------------------------------------

/** GET /api/agents — list all agents */
export async function listAgents(): Promise<Response> {
  try {
    const list = await agents.list()
    return Response.json(list)
  } catch (error) {
    console.error('Error fetching agents:', error)
    return Response.json(
      { error: 'Failed to fetch agents' },
      { status: 500 },
    )
  }
}

/** GET /api/agents/[name] — get agent by name */
export async function getAgent(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
): Promise<Response> {
  const { name } = await params

  const agent = await agents.get(name)
  if (!agent) {
    return Response.json({ error: 'Agent not found' }, { status: 404 })
  }
  return Response.json(agent)
}

/** For generateStaticParams on /api/agents/[name] */
export async function generateAgentParams() {
  const list = await agents.list()
  return list.map(a => ({ name: a.name }))
}

// ---------------------------------------------------------------------------
// AppManifest handler
// ---------------------------------------------------------------------------

/** GET /.well-known/app.json — app manifest for discovery */
export async function getAppManifest(): Promise<Response> {
  try {
    const agentList = await agents.list()
    const skillList = await skills.list()

    // Build manifest from discovered agents and skills
    const manifest = {
      name: agentList[0]?.name || 'syner',
      version: '0.1.1',
      agents: agentList.map(a => a.name),
      skills: skillList.map(s => (s.metadata?.slug as string) || s.name),
      tools: [...new Set(agentList.flatMap(a => a.tools || []))],
      endpoints: {
        agents: '/api/agents',
        skills: '/api/skills',
        chat: '/api/chat',
      },
    }

    return Response.json(manifest)
  } catch (error) {
    console.error('Error building manifest:', error)
    return Response.json({ error: 'Failed to build manifest' }, { status: 500 })
  }
}
