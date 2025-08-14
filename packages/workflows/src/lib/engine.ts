import type { ExecutionParams, ExecutionResult, StopParams, ListParams, Workflow, Step, ActionStep, WaitStep, ParallelStep, ChoiceStep } from '../types';
import { ExecutionStatus } from '../types';
import { getWorkflow } from './registry';
import { actions } from '@syner/actions';

// In-memory storage for executions
const executions = new Map<string, ExecutionResult>();

// Generate unique execution ID
const generateExecutionId = (): string => {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Execution context for workflow steps
type ExecutionContext = {
  executionId: string;
  inputs: Record<string, unknown>;
  stepResults: Map<string, unknown>;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
};

// Resolve input references ({{inputs.key}}, {{steps.stepId.outputs.data}})
const resolveInputs = (inputs: Record<string, unknown> | undefined, context: ExecutionContext): Record<string, unknown> => {
  if (!inputs) return {};
  
  const resolved: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value === 'string') {
      // Handle {{inputs.key}} references
      if (value.startsWith('{{inputs.') && value.endsWith('}}')) {
        const inputKey = value.slice(9, -2);
        resolved[key] = context.inputs[inputKey];
      }
      // Handle {{steps.stepId.outputs.data}} references
      else if (value.startsWith('{{steps.') && value.includes('.outputs.data}}')) {
        const match = value.match(/{{steps\.(.+)\.outputs\.data}}/);
        if (match && match[1]) {
          const stepId = match[1];
          const stepResult = context.stepResults.get(stepId);
          resolved[key] = stepResult;
        }
      }
      else {
        resolved[key] = value;
      }
    } else {
      resolved[key] = value;
    }
  }
  
  return resolved;
};

// Execute a single step
const executeStep = async (step: Step, context: ExecutionContext): Promise<unknown> => {
  try {
    // Action step
    if ('action' in step) {
      const actionStep = step as ActionStep;
      const resolvedInputs = resolveInputs(actionStep.inputs, context);
      
      const result = await actions.run({
        action: actionStep.action,
        params: resolvedInputs,
        metadata: { 
          app: 'workflows',
          timestamp: Date.now()
        }
      });
      
      return result;
    }
    
    // Wait step
    if ('wait' in step) {
      const waitStep = step as WaitStep;
      await new Promise(resolve => setTimeout(resolve, waitStep.wait));
      return { status: 'waited', duration: waitStep.wait };
    }
    
    // Parallel step
    if ('parallel' in step) {
      const parallelStep = step as ParallelStep;
      const parallelPromises = parallelStep.parallel.map(async (parallelStepItem) => {
        return await executeStep(parallelStepItem, context);
      });
      
      const results = await Promise.all(parallelPromises);
      return results;
    }
    
    // Choice step
    if ('choice' in step) {
      const choiceStep = step as ChoiceStep;
      
      // Evaluate condition (simplified - in real implementation this would be more sophisticated)
      const condition = choiceStep.choice.condition;
      const selectedStep = condition ? choiceStep.choice.ifTrue : choiceStep.choice.ifFalse;
      
      const result = await executeStep(selectedStep, context);
      return { condition, selectedBranch: condition ? 'ifTrue' : 'ifFalse', result };
    }
    
    throw new Error(`Unknown step type: ${JSON.stringify(step)}`);
  } catch (error) {
    console.error(`Error executing step ${step.id}:`, error);
    throw error;
  }
};

// Start workflow execution
export const startExecution = async (params: ExecutionParams): Promise<ExecutionResult> => {
  const executionId = generateExecutionId();
  
  // Check if workflow exists in the workflow registry
  const workflow = getWorkflow(params.id);
  if (!workflow) {
    throw new Error(`Workflow '${params.id}' not found`);
  }
  
  // Validate inputs if schema is provided
  let validatedInputs: Record<string, unknown> = params.inputs || {};
  if (workflow.inputs) {
    validatedInputs = workflow.inputs.parse(params.inputs) as Record<string, unknown>;
  }
  
  const execution: ExecutionResult = {
    executionId,
    status: ExecutionStatus.RUNNING,
    startedAt: new Date(),
    output: validatedInputs,
  };
  
  // Store execution
  executions.set(executionId, execution);
  
  // Create execution context
  const context: ExecutionContext = {
    executionId,
    inputs: validatedInputs,
    stepResults: new Map(),
    status: ExecutionStatus.RUNNING,
    startedAt: new Date(),
  };
  
  try {
    // Execute workflow steps sequentially
    for (const step of workflow.steps) {
      const result = await executeStep(step, context);
      context.stepResults.set(step.id, result);
    }
    
    // Update execution with success
    execution.status = ExecutionStatus.COMPLETED;
    execution.completedAt = new Date();
    execution.output = {
      ...execution.output,
      result: 'Workflow completed successfully',
      timestamp: new Date().toISOString(),
      workflowId: params.id,
      steps: workflow.steps.length,
      stepResults: Object.fromEntries(context.stepResults)
    };
    
  } catch (error) {
    // Update execution with error
    execution.status = ExecutionStatus.FAILED;
    execution.completedAt = new Date();
    execution.error = error instanceof Error ? error.message : String(error);
    execution.output = {
      ...execution.output,
      error: execution.error,
      timestamp: new Date().toISOString(),
      workflowId: params.id
    };
  }
  
  return execution;
};

// Stop workflow execution
export const stopExecution = async (params: StopParams): Promise<ExecutionResult> => {
  const execution = executions.get(params.executionId);
  if (!execution) {
    throw new Error(`Execution '${params.executionId}' not found`);
  }
  
  if (execution.status === ExecutionStatus.COMPLETED || execution.status === ExecutionStatus.FAILED) {
    throw new Error(`Cannot stop execution in status '${execution.status}'`);
  }
  
  execution.status = ExecutionStatus.CANCELLED;
  execution.completedAt = new Date();
  
  return execution;
};

// List workflow executions
export const listExecutions = async (params: ListParams = {}): Promise<{
  executions: ExecutionResult[];
  total: number;
  limit: number;
  offset: number;
}> => {
  let filteredExecutions = Array.from(executions.values());
  
  // Filter by status if provided
  if (params.status) {
    filteredExecutions = filteredExecutions.filter(exec => exec.status === params.status);
  }
  
  // Sort by startedAt (newest first)
  filteredExecutions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  
  const total = filteredExecutions.length;
  const limit = params.limit || 20;
  const offset = params.offset || 0;
  
  const paginatedExecutions = filteredExecutions.slice(offset, offset + limit);
  
  return {
    executions: paginatedExecutions,
    total,
    limit,
    offset,
  };
};

// Get workflow execution by ID
export const getExecution = async (executionId: string): Promise<ExecutionResult | null> => {
  return executions.get(executionId) || null;
};
