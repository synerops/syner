import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { actions } from '@syner/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Execute the action
    const result = await actions.run(body);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        metadata: {
          executionTime: 0,
          timestamp: Date.now(),
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // List all available actions
    const availableActions = actions.list();
    
    return NextResponse.json({
      success: true,
      data: {
        actions: availableActions,
        total: availableActions.length,
      },
      metadata: {
        executionTime: 0,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        metadata: {
          executionTime: 0,
          timestamp: Date.now(),
        },
      },
      { status: 500 }
    );
  }
}
