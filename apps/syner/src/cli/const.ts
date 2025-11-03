/**
 * CLI constants for syner agent discovery and configuration.
 */

/**
 * Name of the configuration file that must be present in the current directory.
 * This file defines the agents directory and other project-level settings.
 * 
 * Expected schema:
 * {
 *   "$schema": "https://syner.dev/schema.json",
 *   "directory": "./agents"
 * }
 * 
 * If not found, users should run 'syner init' to create a new project.
 */
export const AGENTS_CONFIG_FILE = 'agents.json';

