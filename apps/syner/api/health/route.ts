import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (
  req: VercelRequest,
  res: VercelResponse
) {
  res.status(200)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Accept, Content-Type'
  )
  res.json({
    status: 'ok',
    name: 'Syner OS',
    uptime: Date.now(),
  })
};
