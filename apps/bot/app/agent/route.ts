import { getInstanceCard, getRequestScope } from '../../lib/instance'

export async function GET(request: Request) {
  const scope = getRequestScope(request)
  const card = await getInstanceCard(scope)
  return Response.json(card)
}
