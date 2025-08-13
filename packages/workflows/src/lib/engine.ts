import type { ExecutionParams, ExecutionResult, StopParams, ListParams, Workflow } from '../types';
import { ExecutionStatus } from '../types';

// In-memory storage for demo purposes
// In a real implementation, this would be a database
const executions = new Map<string, ExecutionResult>();
const workflows = new Map<string, Workflow>();

// Generate unique execution ID
const generateExecutionId = (): string => {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Start workflow execution
export const startExecution = async (params: ExecutionParams): Promise<ExecutionResult> => {
  const executionId = generateExecutionId();
  
  // Check if workflow exists (in real implementation, fetch from database)
  const workflow = workflows.get(params.id);
  if (!workflow) {
    throw new Error(`Workflow '${params.id}' not found`);
  }
  
  const execution: ExecutionResult = {
    executionId,
    status: ExecutionStatus.RUNNING,
    startedAt: new Date(),
    output: params.variables || {},
  };
  
  // Store execution
  executions.set(executionId, execution);
  
  // Simulate async execution
  setTimeout(() => {
    const currentExecution = executions.get(executionId);
    if (currentExecution) {
      currentExecution.status = ExecutionStatus.COMPLETED;
      currentExecution.completedAt = new Date();
      currentExecution.output = {
        ...currentExecution.output,
        result: 'Workflow completed successfully',
        timestamp: new Date().toISOString(),
      };
    }
  }, 1000);
  
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

// Create a sample workflow for testing
export const createSampleWorkflow = (): void => {
  const sampleWorkflow: Workflow = {
    id: 'backup-files',
    name: 'Backup Files',
    description: 'Backup files from source to destination',
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  workflows.set(sampleWorkflow.id, sampleWorkflow);
};

// Initialize with sample data
createSampleWorkflow();
