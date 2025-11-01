const agents = []

export function GET(request: Request) {
  return Response.json({ agents });
}
