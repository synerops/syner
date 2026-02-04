import { Hero } from "./components/hero";
import { WhatIsSyner } from "./components/what-is-syner";
import { Architecture } from "./components/architecture";
import { AgentLoop } from "./components/agent-loop";
import { WorkflowPatterns } from "./components/workflow-patterns";
import { Integrations } from "./components/integrations";
import { OpenSource } from "./components/open-source";

const Home = () => (
  <main>
    <Hero />
    <WhatIsSyner />
    <Architecture />
    <AgentLoop />
    <WorkflowPatterns />
    <Integrations />
    <OpenSource />
  </main>
);

export default Home;
