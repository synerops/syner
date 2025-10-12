export class Reasoning {
  private _requiresPlanning: boolean

  constructor(config?: {
    requiresPlanning?: boolean
  }) {
    this._requiresPlanning = config?.requiresPlanning ?? false
  }

  static createReasoning(overrides?: {
    requiresPlanning?: boolean
    requiresApproval?: boolean
    requiresVerification?: boolean
  }): Reasoning {
    return new Reasoning(overrides)
  }

  get requiresPlanning(): boolean {
    return this._requiresPlanning
  }

  setRequiresPlanning(value: boolean): void {
    this._requiresPlanning = value
  }

  // TODO: Add configure() method that accepts Zod schema
  // TODO: Add OpenAPI schema for CLI configuration
  // This will allow overriding defaults from CLI or config files
}