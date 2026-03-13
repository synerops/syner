# Agent Protocol Landscape

Date: 2026-03-12

## Protocols Mapped

### MCP — Model Context Protocol
- **Origin:** Anthropic, Nov 2024. Donated to Linux Foundation (AAIF) Dec 2025.
- **Status:** Industry standard. 97M+ monthly SDK downloads.
- **Defines:** Tools, Resources, Prompts, Sampling, Tasks (async work tracking added Nov 2025)
- **Layer:** LLM augmentation. Between a model and its environment.
- **Does NOT cover:** Agent-to-agent communication, runtime verification, execution environment, cross-agent memory, authorization models, feedback loops

### A2A — Agent2Agent Protocol
- **Origin:** Google Cloud, April 2025. Linux Foundation. ACP merged in Sept 2025.
- **Status:** Active v0.3+. gRPC support. 50+ partners.
- **Defines:** Agent Cards (`/.well-known/agent.json`), task lifecycle (submitted/working/input-required/completed/failed/canceled), streaming (SSE), artifact exchange, push notifications, skill negotiation
- **Layer:** Enterprise coordination. Delegation between agents in trusted boundaries.
- **Does NOT cover:** Internet-scale trustless discovery, internal execution/verification, workflow auditing, action-level authorization, memory persistence

### ACP — Agent Communication Protocol (Archived)
- **Origin:** IBM BeeAI. Merged into A2A Sept 2025.
- **Contributed:** Multimodal messages via MIME, human-in-the-loop, long-running task model, brokered routing

### ANP — Agent Network Protocol
- **Origin:** Open-source. W3C AI Agent Protocol Community Group (June 2025).
- **Status:** Active. "The HTTP of the Agentic Web."
- **Defines:** W3C DID identity, meta-protocol negotiation, Semantic Web capability description
- **Layer:** Open-internet / decentralized. Cross-org trustless discovery and auth.
- **Does NOT cover:** LLM tool invocation, enterprise task lifecycle, runtime verification, sandboxing

### AGNTCY
- **Origin:** Cisco. Open-sourced March 2025. Linux Foundation July 2025. 65+ companies.
- **Defines:** Agent Discovery (OASF), Agent Identity (crypto-verifiable), Agent Messaging (quantum-safe SLIM), Agent Observability (end-to-end tracing)
- **Layer:** Infrastructure/platform. Operational infrastructure around agents.
- **Does NOT cover:** Runtime action verification, execution sandboxing, per-agent execution lifecycle

### OpenProtocol.dev
- Focused on autonomous agent economic participation: payment rails (x402, Lightning, Stripe, USDC). Economic layer, not execution.

## Gap Analysis

| Concern | Covered? | By What |
|---|---|---|
| Tool schema definition | Yes | MCP |
| Context injection into LLM | Yes | MCP |
| Agent discovery (enterprise) | Yes | A2A Agent Cards |
| Task delegation between agents | Yes | A2A |
| Agent identity (decentralized) | Partial | ANP, AGNTCY |
| Inter-agent messaging transport | Yes | A2A |
| Action verification before execution | **No** | Nothing |
| Action verification after execution | **No** | Nothing |
| Execution environment / sandboxing | **No** | Nothing |
| Workflow state audit trail | **No** | Nothing |
| Authorization enforcement per-action | **No** | Nothing |
| Cross-agent persistent memory | **No** | Nothing |
| Failure recovery / graceful degradation | **No** | Nothing |

## Sources

- MCP Specification 2025-11-25 — modelcontextprotocol.io
- A2A Protocol — a2a-protocol.org
- Agent Communication Protocol — agentcommunicationprotocol.dev
- Survey of Agent Interoperability Protocols — arxiv.org/html/2505.02279v1
- ANP Technical White Paper — agent-network-protocol.com
- AGNTCY Docs — docs.agntcy.org
- Linux Foundation AGNTCY Announcement
- MCP vs A2A — auth0.com/blog
- A2A Protocol Getting an Upgrade — Google Cloud Blog
