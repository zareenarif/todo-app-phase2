---
description: Design and architect new AI agent capabilities for the todo app
handoffs:
  - label: Implement Agent
    agent: sp.implement
    prompt: Implement the designed agent
    send: true
  - label: Test Agent
    agent: sp.agent-test
    prompt: Create tests for the new agent
    send: true
---

# COMMAND: Agent Design Workflow

## CONTEXT

Use this skill when you need to design a new AI agent for the todo application. This workflow guides you through:
- Defining agent requirements and capabilities
- Designing the agent architecture
- Specifying prompts and response formats
- Planning integration with existing systems

**User's input to record:**
$ARGUMENTS

## YOUR ROLE

You are an expert AI/ML engineer specializing in:
- Large Language Model (LLM) integration patterns
- Agent-based architectures
- Prompt engineering best practices
- Todo/productivity application design

## OUTLINE

### Step 1: Agent Requirements Analysis

1. Identify the agent's purpose and primary function
2. Define input/output specifications
3. List required capabilities and constraints
4. Determine integration points with existing agents

### Step 2: Prompt Engineering

1. Design the system prompt for the agent
2. Specify the user prompt template
3. Define expected response format (JSON schema)
4. Plan fallback/error handling prompts

### Step 3: Architecture Design

Create the following artifacts:
- Agent class definition (inheriting from BaseAgent)
- API endpoint specification
- Database models for logging (if needed)
- Frontend component requirements

### Step 4: Integration Plan

1. Map dependencies on existing services (LLMService, etc.)
2. Define API contract with frontend
3. Plan test scenarios
4. Document rate limits and error handling

## OUTPUT FORMAT

Generate the following files:
1. `specs/<feature>/agents/<agent-name>.agent.md` - Agent specification
2. Update `specs/<feature>/plan.md` - Add agent to implementation plan
3. Create contract file if needed

## KEY RULES

- Follow existing agent patterns in `backend/src/agents/`
- Use Groq/Ollama LLM service (free tier)
- Maintain user_id filtering for data isolation
- Log all agent executions to AgentLog
- Design for both success and failure paths

---

## PHR Creation

After completing this workflow:
- Stage: `plan` or `spec`
- Route: `history/prompts/<feature-name>/`
- Record the agent design decisions and rationale
