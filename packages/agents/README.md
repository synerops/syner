# @syner/agents

A toolkit to create and manage agents in the Syner OS ecosystem.

## Foundation

### Core Philosophy
This framework is built from the ground up with **native TypeScript support** and **ai-sdk integration** as first-class citizens. Unlike existing frameworks that add TypeScript as an afterthought, this framework is designed specifically for the modern TypeScript ecosystem.

### Why Built from Scratch?
- **Native TypeScript Support**: Built with TypeScript-first design, not adapted from Python/JavaScript
- **ai-sdk Integration**: Deep integration with Vercel's ai-sdk for structured outputs and tool calling
- **Modern Architecture**: Designed for the current ecosystem, not legacy patterns
- **Performance**: Optimized for TypeScript and Node.js environments

### Architecture Principles
- **Orchestrator/Worker Pattern**: Clear separation of concerns between planning and execution
- **Capability-Based Design**: Agents are defined by their capabilities, not rigid roles
- **Structured Data Flow**: All inputs/outputs use structured schemas for type safety
- **Reference-Based Dependencies**: Eliminates circular dependencies through ID-based references
- **MVP-First Approach**: Start simple, grow incrementally

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **AI Integration**: Vercel ai-sdk with OpenAI GPT-4
- **Validation**: Zod for runtime type safety
- **Architecture**: Orchestrator/Worker with capability discovery

## Framework Architecture

### 1. Architecture Layers

```
┌─────────────────────────────────────────┐
│           USER REQUEST                  │
│    "Deploy React app to ECS"           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           ORCHESTRATOR                  │
│    (Agent<OrchestratorTools>)          │
│  • Planning Capability                 │
│  • Orchestration Capability            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│              PLAN                       │
│    (Schema + Types)                    │
│  • Task IDs + Dependencies             │
│  • Metadata + Status                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│              TASKS                      │
│    (Schema + Types)                    │
│  • Goal + Required Capabilities        │
│  • Input/Output + Status               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│             WORKERS                     │
│    (Agent<WorkerTools>)                │
│  • Task Execution Capability           │
│  • Domain-specific expertise           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           CAPABILITIES                  │
│    (Schema + Types)                    │
│  • Tools + Input/Output                │
│  • Domain knowledge                    │
└─────────────────────────────────────────┘
```

### 2. Data Flow

**Request → Plan → Tasks → Execution → Results**

1. **User Request** → Orchestrator
2. **Orchestrator** uses `planningCapability` → creates **Plan**
3. **Plan** contains **Task IDs** + dependencies
4. **Orchestrator** uses `orchestrationCapability` → delegates **Tasks**
5. **Workers** receive **Tasks** → execute using **Capabilities**
6. **Results** flow back to Orchestrator

### 3. Separation of Responsibilities

**Data Primitives (Schemas):**
- **Capability**: Defines what an agent can do
- **Plan**: Work structure with dependencies
- **Task**: Specific work unit

**Agent Primitives (ai-sdk):**
- **Orchestrator**: Plans and coordinates
- **Worker**: Executes specific tasks

### 4. Communication Pattern

```
Orchestrator ──(Task Schema)──> Worker
     ↑                              │
     └──(Results)───────────────────┘
```

- **Orchestrator → Worker**: Sends `Task` (schema)
- **Worker → Orchestrator**: Sends structured results
- **Communication**: Schema-based, not complex objects

### 5. ai-sdk Integration

- **Orchestrator**: `extends Agent<OrchestratorTools>`
- **Worker**: `extends Agent<WorkerTools>`
- **Tools**: Defined in capabilities, automatically integrated
- **Type Safety**: TypeScript infers everything from schemas

## Example Flow: Deploy React App to ECS

### 1. User Request
```typescript
const userRequest = "Deploy my React app to development environment using ECS clusters"
```

### 2. Orchestrator Processing
```typescript
const orchestrator = new Orchestrator({
  system: "You are a DevOps orchestrator that manages deployments"
});

// Orchestrator uses planning capability
const plan = await orchestrator.plan(userRequest);
```

### 3. Plan Creation
```typescript
// Plan contains task IDs and dependencies
const plan = {
  id: "plan-deploy-react-dev",
  taskIds: ["task-1", "task-2", "task-3"],
  dependencies: [
    { taskId: "task-3", dependsOn: "task-1", type: "sequential" },
    { taskId: "task-3", dependsOn: "task-2", type: "sequential" }
  ],
  status: "draft"
};
```

### 4. Task Delegation
```typescript
// Orchestrator delegates tasks to workers
await orchestrator.delegateTask({
  task: buildDockerImageTask,
  targetAgent: "container-worker",
  priority: "high"
});
```

### 5. Worker Execution
```typescript
const containerWorker = new Worker({
  system: "You are a containerization specialist"
});

// Worker executes task using capabilities
await containerWorker.executeTask({
  task: buildDockerImageTask,
  executionContext: {
    environment: "development",
    timeout: 300
  }
});
```

### 6. Results Flow
```typescript
// Results flow back to orchestrator
const deploymentResult = {
  success: true,
  deployedServices: ["react-app-service"],
  ecsCluster: "dev-cluster",
  endpoints: ["https://react-app-dev.example.com"]
};
```

## Technical Foundation

### Schema Design Decisions
- **`z.record(z.unknown())` for Inputs/Outputs**: Provides structured data flow while maintaining flexibility for any domain
- **ID-Based References**: Eliminates circular dependencies by using string IDs instead of nested objects
- **Lazy Loading**: Uses `z.lazy()` for self-referencing schemas to prevent circular imports
- **UUID Validation**: Ensures unique identifiers for plans and executions

### Architecture Facts
- **Orchestrator Tools**: `analyzeRequest`, `createActionPlan`, `delegateTask`, `coordinateWorkflow`, `monitorProgress`
- **Worker Tools**: `executeTask`, `validateInput`, `handleExecutionError`, `optimizeExecution`
- **Communication Pattern**: Schema-based communication for type safety
- **State Management**: In-memory for MVP, designed for future persistence
- **Error Handling**: Basic error propagation, designed for future retry mechanisms

### Integration Points
- **ai-sdk**: Uses `Experimental_Agent` for AI-powered decision making
- **Zod**: Runtime validation and type safety for all schemas
- **TypeScript**: Full type inference from Zod schemas
- **Tool Calling**: Structured tool definitions with input/output schemas

### Performance Characteristics
- **Schema Validation**: O(1) for simple schemas, O(n) for complex nested structures
- **Memory Usage**: Minimal overhead with ID-based references
- **Execution Flow**: Linear progression with dependency coordination
- **Scalability**: Designed for horizontal scaling through worker distribution