import { 
  Experimental_Agent as Agent 
} from "ai"
import type { 
  ToolSet, 
  Experimental_AgentSettings as AgentSettings,
} from "ai"

class Orchestrator extends Agent<ToolSet, unknown> {
  constructor(options: AgentSettings<ToolSet, unknown>) {
    super(options)
  }
}

export default Orchestrator