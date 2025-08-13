import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { registry } from '@syner/actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { app, actions } = body;
    
    if (!app || !actions || !Array.isArray(actions)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: app and actions array required',
          metadata: {
            executionTime: 0,
            timestamp: Date.now(),
          },
        },
        { status: 400 }
      );
    }
    
    // Register the actions
    registry.register(app, actions);
    
    return NextResponse.json({
      success: true,
      data: {
        app,
        registeredActions: actions.length,
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

export async function GET() {
  try {
    // List all registered apps
    const apps = registry.getApps();
    
    return NextResponse.json({
      success: true,
      data: {
        apps,
        total: apps.length,
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
