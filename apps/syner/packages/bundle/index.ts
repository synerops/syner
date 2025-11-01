// import fs from 'fs';

interface BundleProps {
  output: string;
}

export function bundle({ output = 'dist' }: BundleProps) {
  console.log({ output })

  // // Determine if we should create Vercel Build Output v3 format
  // const isVercelOutput = output === '.vercel/output' || process.env.VERCEL === '1'

  // if (isVercelOutput) {
  //   // .vercel/output
  //   fs.mkdirSync('.vercel/output', { recursive: true })

  //   // .vercel/output/config.json
  //   fs.writeFileSync('.vercel/output/config.json', JSON.stringify({
  //     version: 3,
  //     routes: [
  //       {
  //         src: "/api/(.*)",
  //         dest: "/api/$1"
  //       }
  //     ]
  //   }, null, 2))

  //   // .vercel/output/functions
  //   fs.mkdirSync('.vercel/output/functions', { recursive: true })

  //   // .vercel/output/functions/api/health.func
  //   fs.mkdirSync('.vercel/output/functions/api/health.func', { recursive: true })
  //   fs.writeFileSync(
  //     '.vercel/output/functions/api/health.func/index.js',
  //     "export default (req) => new Response('OK')",
  //   )
  // } else {
  //   // // Fallback to dist/api for local development
  //   // console.log(`mkdir ${output}/api`)
  //   // fs.mkdirSync(`${output}/api`, { recursive: true })
  //   // fs.writeFileSync(
  //   //   `${output}/api/health.js`,
  //   //   "export const GET = () => new Response('OK')",
  //   // )
  // }
}
