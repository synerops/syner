import { getInstanceCard } from '../../lib/instance'

export async function GET() {
  const card = await getInstanceCard()
  return Response.json(card)
}
