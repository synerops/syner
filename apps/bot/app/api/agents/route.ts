import { agents } from '@/lib/registry'

export const dynamic = 'force-static'

export async function GET() {
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
