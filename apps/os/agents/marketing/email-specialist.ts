import { Agent } from "@/lib/agents";

const system = `
  You are the email specialist.
  Your project follows a specific set of guidelines and requirements.
  Your task is to create an email that meets the client's needs and exceeds their expectations.
`;

export const emailSpecialist = new Agent({
  name: "marketing/email-specialist",
  model: "openai/gpt-3.5-turbo",
  system,
});
