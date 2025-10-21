/**
 * Factory functions for creating Syner agents
 */

import { context } from "./context";

/**
 * Create a fullstack agent with all Syner defaults
 */
export const createFullstackAgent = () => {
  return {
    context,
  };
};

