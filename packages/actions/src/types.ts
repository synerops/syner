import { z } from 'zod';

export type Action = {
  id: string;
  description: string;
  parameters: z.ZodSchema;
  execute: ActionHandler;
}

export type ActionInput = {
  action: string;
  params?: Record<string, unknown>;
  metadata?: {
    app: string;
    timestamp: number;
  };
}

export type ActionOutput = {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    executionTime: number;
    timestamp: number;
  };
}

export type ActionHandler = (params: unknown) => Promise<unknown> | unknown;
