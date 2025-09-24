# Flujo Completo: Request → Plan de Acción

## Ejemplo: Deploy de App React en Desarrollo con ECS Clusters

### 1. Request del Usuario
```typescript
// Usuario hace request
const userRequest = "Deploy my React app to development environment using ECS clusters"
```

### 2. Orchestrator Recibe el Request
```typescript
const orchestrator = new Orchestrator({
  system: "You are a DevOps orchestrator that manages deployments"
});

// El Orchestrator usa sus capabilities para procesar el request
```

### 3. Planning Capability - Análisis del Request
El Orchestrator usa su `planningCapability` con estos tools:

**a) `analyzeRequest` tool:**
```typescript
// Input al tool
{
  request: "Deploy my React app to development environment using ECS clusters",
  context: { environment: "development", platform: "ECS" },
  userPreferences: { autoScaling: true, monitoring: true }
}

// Output del tool
{
  intent: "Deploy React application to ECS development environment",
  complexity: "moderate",
  estimatedDuration: "15-20 minutes",
  requiredCapabilities: ["infrastructure", "containerization", "deployment"]
}
```

**b) `createActionPlan` tool:**
```typescript
// Input al tool
{
  requirements: {
    intent: "Deploy React application to ECS development environment",
    constraints: ["ECS clusters", "development environment"],
    preferences: { autoScaling: true, monitoring: true }
  },
  availableCapabilities: ["infrastructure", "containerization", "deployment", "monitoring"]
}

// Output del tool - Plan estructurado
{
  id: "plan-deploy-react-dev",
  steps: [
    {
      id: "task-1",
      name: "build-docker-image",
      goal: "Build Docker image for React app",
      capabilities: [{
        name: "containerization",
        description: "Container management capability",
        tools: {},
        input: {},
        output: {}
      }],
      dependencies: [],
      status: "pending",
      input: { dockerfile: "./Dockerfile", tag: "react-app:dev" },
      output: {}
    },
    {
      id: "task-2", 
      name: "create-ecs-service",
      goal: "Create ECS service for React app",
      capabilities: [{
        name: "infrastructure",
        description: "Infrastructure management capability",
        tools: {},
        input: {},
        output: {}
      }],
      dependencies: [],
      status: "pending",
      input: { cluster: "dev-cluster", serviceName: "react-app-service" },
      output: {}
    },
    {
      id: "task-3",
      name: "deploy-to-ecs",
      goal: "Deploy React app to ECS cluster",
      capabilities: [{
        name: "deployment",
        description: "Application deployment capability",
        tools: {},
        input: {},
        output: {}
      }],
      dependencies: [],
      status: "pending",
      input: { image: "react-app:dev", replicas: 2 },
      output: {}
    }
  ],
  dependencies: [
    { from: "task-1", to: "task-3" }, // Deploy depends on build
    { from: "task-2", to: "task-3" }  // Deploy depends on service creation
  ]
}
```

### 4. Orchestration Capability - Delegación de Tasks
El Orchestrator usa su `orchestrationCapability`:

**a) `delegateTask` tool:**
```typescript
// Para cada task, el Orchestrator delega a workers especializados
await orchestrator.delegateTask({
  task: {
    id: "task-1",
    name: "build-docker-image", 
    goal: "Build Docker image for React app",
    capabilities: [{
      name: "containerization",
      description: "Container management capability",
      tools: {},
      input: {},
      output: {}
    }],
    dependencies: [],
    status: "pending",
    input: { dockerfile: "./Dockerfile", tag: "react-app:dev" },
    output: {}
  },
  targetAgent: "container-worker",
  priority: "high"
});

await orchestrator.delegateTask({
  task: {
    id: "task-2",
    name: "create-ecs-service",
    goal: "Create ECS service for React app", 
    capabilities: [{
      name: "infrastructure",
      description: "Infrastructure management capability",
      tools: {},
      input: {},
      output: {}
    }],
    dependencies: [],
    status: "pending",
    input: { cluster: "dev-cluster", serviceName: "react-app-service" },
    output: {}
  },
  targetAgent: "infrastructure-worker",
  priority: "high"
});
```

### 5. Workers Ejecutan Tasks
Los workers especializados reciben y ejecutan las tasks:

**Container Worker:**
```typescript
const containerWorker = new Worker({
  system: "You are a containerization specialist"
});

// Ejecuta task-1: build-docker-image
await containerWorker.executeTask({
  task: buildDockerImageTask,
  executionContext: {
    environment: "development",
    timeout: 300 // 5 minutes
  }
});
```

**Infrastructure Worker:**
```typescript
const infrastructureWorker = new Worker({
  system: "You are an infrastructure specialist"
});

// Ejecuta task-2: create-ecs-service  
await infrastructureWorker.executeTask({
  task: createEcsServiceTask,
  executionContext: {
    environment: "development",
    resourceLimits: { cpu: 512, memory: 1024 }
  }
});
```

### 6. Flujo de Dependencias
```typescript
// El Orchestrator coordina las dependencias
await orchestrator.coordinateWorkflow({
  workflowId: "deploy-react-dev",
  steps: [task1, task2, task3],
  dependencies: [
    { from: "task-1", to: "task-3" }, // Deploy waits for build
    { from: "task-2", to: "task-3" }  // Deploy waits for service
  ]
});
```

### 7. Resultado Final
```typescript
// El Orchestrator recibe resultados y genera reporte
const deploymentResult = {
  success: true,
  deployedServices: ["react-app-service"],
  ecsCluster: "dev-cluster", 
  endpoints: ["https://react-app-dev.example.com"],
  monitoring: "CloudWatch enabled",
  estimatedCost: "$15/month"
};
```

## Resumen del Flujo:

```
User Request 
    ↓
Orchestrator (Planning Capability)
    ↓ 
Analyze Request → Create Action Plan
    ↓
Orchestrator (Orchestration Capability)  
    ↓
Delegate Tasks → Coordinate Dependencies
    ↓
Workers (Task Execution)
    ↓
Container Worker (build-docker-image)
Infrastructure Worker (create-ecs-service)  
Deployment Worker (deploy-to-ecs)
    ↓
Deployment Complete
```
