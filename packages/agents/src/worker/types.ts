import type { WorkerTools } from "../../tools";

export type WorkerConfig = {
  system?: string;
};

export type WorkerConstructor = new (config: WorkerConfig) => any; // Will be properly typed when Worker class is imported

// Re-export the WorkerTools type for convenience
export type { WorkerTools };
