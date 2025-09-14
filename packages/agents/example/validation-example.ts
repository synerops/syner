import { createAgent, ValidationError, type AgentInput } from "../src"

/**
 * Example demonstrating Zod validation in the agents package
 */

async function demonstrateValidation() {
  console.log("=== Zod Validation Example ===\n")

  // Example 1: Valid agent input
  console.log("1. Creating agent with valid input...")
  const validInput: AgentInput = {
    id: "devops-engineer-001",
    name: "DevOps Engineer",
    capabilities: [
      {
        name: "infrastructure-deployment",
        description: "Deploy and manage cloud infrastructure",
        tools: [],
        input: { type: "object", properties: {} },
        output: { type: "object", properties: {} }
      }
    ]
  }

  const validAgent = await createAgent(validInput)
  if (validAgent instanceof ValidationError) {
    console.error("❌ Validation failed:", validAgent.getFormattedErrors())
  } else {
    console.log("✅ Agent created successfully:", validAgent.name)
  }

  // Example 2: Invalid agent input (missing name)
  console.log("\n2. Creating agent with invalid input (missing name)...")
  const invalidInput: AgentInput = {
    id: "", // Invalid: empty ID
    name: "", // Invalid: empty name
    capabilities: [] // Invalid: no capabilities
  }

  const invalidAgent = await createAgent(invalidInput)
  if (invalidAgent instanceof ValidationError) {
    console.log("✅ Validation correctly caught errors:")
    invalidAgent.getFormattedErrors().forEach(error => {
      console.log(`   - ${error}`)
    })
  } else {
    console.log("❌ Validation should have failed but didn't")
  }

  // Example 3: Invalid agent input (too long name)
  console.log("\n3. Creating agent with name too long...")
  const longNameInput: AgentInput = {
    id: "valid-id",
    name: "A".repeat(150), // Invalid: name too long
    capabilities: [
      {
        name: "test-capability",
        description: "Test capability",
        tools: [],
        input: { type: "object", properties: {} },
        output: { type: "object", properties: {} }
      }
    ]
  }

  const longNameAgent = await createAgent(longNameInput)
  if (longNameAgent instanceof ValidationError) {
    console.log("✅ Validation correctly caught name length error:")
    longNameAgent.getFormattedErrors().forEach(error => {
      console.log(`   - ${error}`)
    })
  } else {
    console.log("❌ Validation should have failed but didn't")
  }

  // Example 4: Invalid capability description
  console.log("\n4. Creating agent with invalid capability description...")
  const invalidCapabilityInput: AgentInput = {
    id: "valid-id",
    name: "Valid Name",
    capabilities: [
      {
        name: "", // Invalid: empty capability name
        description: "", // Invalid: empty description
        tools: [],
        input: { type: "object", properties: {} },
        output: { type: "object", properties: {} }
      }
    ]
  }

  const invalidCapabilityAgent = await createAgent(invalidCapabilityInput)
  if (invalidCapabilityAgent instanceof ValidationError) {
    console.log("✅ Validation correctly caught capability errors:")
    invalidCapabilityAgent.getFormattedErrors().forEach(error => {
      console.log(`   - ${error}`)
    })
  } else {
    console.log("❌ Validation should have failed but didn't")
  }
}

// Run the demonstration
demonstrateValidation().catch(console.error)
