import type { Workflow, Step, ActionStep, WaitStep, ParallelStep, ChoiceStep } from '../types';
import { z } from 'zod';

// Global workflow registry
const workflowsRegistry = new Map<string, Workflow>();

// Helper function to create workflow definitions
export const workflow = (definition: Workflow): Workflow => {
  // Validate workflow definition
  validateWorkflowDefinition(definition);
  
  // Register workflow
  workflowsRegistry.set(definition.id, definition);
  
  return definition;
};

// Helper functions for type-safe references
export const inputs = (key: string) => {
  return `{{inputs.${key}}}`;
};

export const steps = (stepId: string) => {
  return {
    outputs: {
      data: `{{steps.${stepId}.outputs.data}}`,
      // Add more output properties as needed
    }
  };
};

// Validation function
const validateWorkflowDefinition = (definition: Workflow) => {
  // Validate required fields
  if (!definition.id) {
    throw new Error('Workflow must have an id');
  }
  
  if (!definition.description) {
    throw new Error('Workflow must have a description');
  }
  
  if (!definition.steps || definition.steps.length === 0) {
    throw new Error('Workflow must have at least one step');
  }
  
  // Validate steps
  definition.steps.forEach((step, index) => {
    validateStep(step, index);
  });
  
  // Check for duplicate step IDs
  const stepIds = definition.steps.map(step => step.id);
  const uniqueIds = new Set(stepIds);
  if (stepIds.length !== uniqueIds.size) {
    throw new Error('Workflow steps must have unique IDs');
  }
};

// Validate individual step
const validateStep = (step: Step, index: number) => {
  if (!step.id) {
    throw new Error(`Step at index ${index} must have an id`);
  }
  
  // Validate based on step type
  if ('action' in step) {
    validateActionStep(step as ActionStep, index);
  } else if ('wait' in step) {
    validateWaitStep(step as WaitStep, index);
  } else if ('parallel' in step) {
    validateParallelStep(step as ParallelStep, index);
  } else if ('choice' in step) {
    validateChoiceStep(step as ChoiceStep, index);
  } else {
    throw new Error(`Unknown step type at index ${index}`);
  }
};

const validateActionStep = (step: ActionStep, index: number) => {
  if (!step.action) {
    throw new Error(`Action step at index ${index} must have an action`);
  }
};

const validateWaitStep = (step: WaitStep, index: number) => {
  if (typeof step.wait !== 'number' || step.wait <= 0) {
    throw new Error(`Wait step at index ${index} must have a positive number for wait`);
  }
};

const validateParallelStep = (step: ParallelStep, index: number) => {
  if (!step.parallel || step.parallel.length === 0) {
    throw new Error(`Parallel step at index ${index} must have at least one parallel step`);
  }
  
  step.parallel.forEach((parallelStep, parallelIndex) => {
    validateStep(parallelStep, parallelIndex);
  });
};

const validateChoiceStep = (step: ChoiceStep, index: number) => {
  if (typeof step.choice.condition !== 'boolean') {
    throw new Error(`Choice step at index ${index} must have a boolean condition`);
  }
  
  if (!step.choice.ifTrue) {
    throw new Error(`Choice step at index ${index} must have an ifTrue step`);
  }
  
  if (!step.choice.ifFalse) {
    throw new Error(`Choice step at index ${index} must have an ifFalse step`);
  }
  
  validateStep(step.choice.ifTrue, 0);
  validateStep(step.choice.ifFalse, 1);
};

// Registry functions
export const getWorkflow = (id: string): Workflow | undefined => {
  return workflowsRegistry.get(id);
};

export const listWorkflows = (): Workflow[] => {
  return Array.from(workflowsRegistry.values());
};

export const hasWorkflow = (id: string): boolean => {
  return workflowsRegistry.has(id);
};

// Sample workflow for testing
export const registerSampleWorkflow = () => {
  const sampleWorkflow = workflow({
    id: 'sample-translate',
    description: 'Sample workflow that demonstrates all primitives',
    inputs: z.object({
      url: z.string().url(),
      targetLanguage: z.string().default('es')
    }),
    steps: [
      {
        id: 'fetch',
        action: 'web:scrape',
        inputs: {
          url: inputs('url')
        }
      },
      {
        id: 'translate',
        action: 'ai:translate',
        inputs: {
          text: steps('fetch').outputs.data,
          targetLanguage: inputs('targetLanguage')
        }
      },
      {
        id: 'generate-pdf',
        action: 'pdf:generate',
        inputs: {
          content: steps('translate').outputs.data
        }
      },
      {
        id: 'save',
        action: 'storage:save',
        inputs: {
          file: steps('generate-pdf').outputs.data,
          path: 'translated-docs.pdf'
        }
      }
    ]
  });
  
  return sampleWorkflow;
};

// Register sample workflow on module load
registerSampleWorkflow();
