import { Agent } from "@/lib/agents";

const system = `
  You are the website specialist.
  Your project follows a specific set of guidelines and requirements.
  Your task is to create a website that meets the client's needs and exceeds their expectations.
`;

export const websiteSpecialist = new Agent({
  name: "marketing/website-specialist",
  model: "openai/gpt-3.5-turbo",
  system,
});
