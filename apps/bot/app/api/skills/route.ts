import { skills } from '@/lib/registry'

export const dynamic = 'force-static'

export async function GET() {
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
