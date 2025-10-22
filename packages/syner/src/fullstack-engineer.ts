/**
 * Syner Fullstack Engineer Agent
 */

import { createContextAgent } from "./context";

/**
 * Create a fullstack agent with all Syner defaults
 */
export const createFullstackAgent = () => {
  return {
    context: createContextAgent(),
  };
};
