# AI Agents System

The Todo App includes an AI-powered agent system that helps users manage and optimize their tasks using Large Language Models (LLMs).

## Overview

The agent system provides:
- **Task Prioritization** - AI analysis of task importance and urgency
- **Task Decomposition** - Breaking complex tasks into actionable subtasks
- **Chat Interface** - Natural language interaction for task management
- **Execution Logging** - Tracking all agent interactions for history/debugging

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ AgentChat   │  │ AgentInput  │  │ AgentMessage    │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────┐
│                    Backend (FastAPI)                     │
│  ┌─────────────────────────────────────────────────┐    │
│  │              /api/v1/agents/*                    │    │
│  │  - POST /prioritize                              │    │
│  │  - POST /decompose                               │    │
│  │  - POST /chat                                    │    │
│  │  - GET /logs                                     │    │
│  │  - GET /health                                   │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Agent Classes                       │    │
│  │  - TaskPrioritizerAgent                          │    │
│  │  - TaskDecomposerAgent                           │    │
│  │  - (Future: SmartSchedulerAgent, ReminderAgent)  │    │
│  └─────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────┐    │
│  │              LLM Service                         │    │
│  │  - Groq (Primary - Free Tier)                    │    │
│  │  - Ollama (Fallback - Local)                     │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

## Available Agents

### 1. Task Prioritizer Agent

**Purpose**: Analyzes tasks and suggests optimal priority assignments.

**Endpoint**: `POST /api/v1/agents/prioritize`

**Input**:
```json
{
  "task_ids": ["uuid1", "uuid2", "uuid3"],
  "context": "I have a meeting tomorrow and need to prepare"
}
```

**Output**:
```json
{
  "success": true,
  "priorities": [
    {"task_id": "uuid1", "priority": "high", "reason": "Deadline tomorrow"},
    {"task_id": "uuid2", "priority": "medium", "reason": "Important but not urgent"}
  ],
  "message": "Successfully analyzed 3 tasks."
}
```

[Full documentation →](./task-prioritizer.md)

### 2. Task Decomposer Agent

**Purpose**: Breaks complex tasks into actionable subtasks.

**Endpoint**: `POST /api/v1/agents/decompose`

**Input**:
```json
{
  "task_id": "uuid-of-complex-task",
  "max_subtasks": 10,
  "detail_level": "medium"
}
```

**Output**:
```json
{
  "success": true,
  "parent_task_id": "uuid-of-complex-task",
  "subtasks": [
    {"title": "Research options", "priority": "high", "effort": "small"},
    {"title": "Create outline", "priority": "medium", "effort": "medium"}
  ],
  "message": "Generated 5 subtasks."
}
```

[Full documentation →](./task-decomposer.md)

### 3. Chat Agent

**Purpose**: General-purpose assistant for task-related questions.

**Endpoint**: `POST /api/v1/agents/chat`

**Input**:
```json
{
  "message": "What should I focus on today?",
  "agent_type": "chat"
}
```

**Output**:
```json
{
  "success": true,
  "message": "Based on your tasks, I recommend focusing on...",
  "agent_type": "chat"
}
```

## LLM Providers

### Groq (Primary)

- **Free Tier**: 14,400 tokens/minute, 30 requests/minute
- **Models**: Llama 3.1 70B, Mixtral 8x7B
- **Latency**: Sub-second responses
- **Setup**: Set `GROQ_API_KEY` in environment

### Ollama (Fallback)

- **Cost**: Completely free (runs locally)
- **Models**: Llama 3, Mistral, CodeLlama
- **Latency**: Depends on hardware
- **Setup**: Install Ollama, run `ollama pull llama3`

## Configuration

Environment variables:
```bash
# Groq (primary)
GROQ_API_KEY=gsk_xxxxxxxxxxxx
GROQ_MODEL=llama-3.1-70b-versatile

# Ollama (fallback)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Settings
LLM_PROVIDER=groq  # or "ollama"
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=1024
```

## Security

- All agent endpoints require JWT authentication
- User data is isolated by `user_id`
- Agent logs are user-scoped
- No sensitive task data is stored in LLM providers
- Rate limiting protects against abuse

## Adding New Agents

1. Create agent class in `backend/src/agents/`
2. Inherit from `BaseAgent`
3. Implement `execute()` method
4. Add endpoint in `backend/src/api/v1/agents.py`
5. Add frontend integration in `frontend/lib/api.ts`

See [Architecture Documentation](./architecture.md) for details.
