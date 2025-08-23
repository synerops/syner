import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { actions } from '@syner/actions';
import { listWorkflows } from '@syner/workflows'

export async function GET() {
  const workflows = await listWorkflows();
  // const workflows = await actions.run({
  //   action: 'workflows:list',
  //   metadata: {
  //     app: 'os',
  //     timestamp: Date.now()
  //   }
  // });
  return NextResponse.json(workflows);
}

