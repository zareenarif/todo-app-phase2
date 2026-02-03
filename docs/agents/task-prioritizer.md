# Task Prioritizer Agent

The Task Prioritizer Agent analyzes your tasks and suggests optimal priority assignments based on deadlines, importance, effort, and context.

## Overview

- **Type**: `prioritizer`
- **Endpoint**: `POST /api/v1/agents/prioritize`
- **Source**: `backend/src/agents/task_prioritizer.py`

## How It Works

1. **Input Analysis**: Receives a list of task IDs and optional context
2. **Task Fetching**: Retrieves full task details from database
3. **LLM Processing**: Sends task data to LLM with prioritization prompt
4. **Response Parsing**: Extracts structured priorities from LLM response
5. **Logging**: Records execution in AgentLog

## API Reference

### Request

```http
POST /api/v1/agents/prioritize
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "task_ids": ["uuid1", "uuid2", "uuid3"],
  "context": "Optional context about your situation"
}
```

### Response

```json
{
  "success": true,
  "priorities": [
    {
      "task_id": "uuid1",
      "priority": "high",
      "reason": "Due tomorrow and blocking other work"
    },
    {
      "task_id": "uuid2",
      "priority": "medium",
      "reason": "Important but no urgent deadline"
    },
    {
      "task_id": "uuid3",
      "priority": "low",
      "reason": "Nice to have, can be deferred"
    }
  ],
  "message": "Successfully analyzed 3 tasks."
}
```

### Error Response

```json
{
  "success": false,
  "priorities": [],
  "message": "Failed to prioritize tasks.",
  "error": "LLM service unavailable"
}
```

## Priority Levels

| Priority | Meaning | Characteristics |
|----------|---------|-----------------|
| **high** | Critical | Urgent deadlines, blocking other work, high impact |
| **medium** | Important | Should be done soon, moderate impact |
| **low** | Nice to have | Can wait, low urgency, minor impact |

## System Prompt

The agent uses this system prompt:

```
You are an expert task prioritization assistant. Your job is to analyze tasks and assign appropriate priorities based on:

1. **Urgency**: Due dates, deadlines, time-sensitivity
2. **Importance**: Impact on goals, dependencies, consequences of not completing
3. **Effort**: Estimated time and complexity
4. **Context**: Tags, descriptions, relationships to other tasks

Priority levels:
- **high**: Critical tasks that need immediate attention
- **medium**: Important tasks that should be done soon
- **low**: Tasks that can wait or are nice-to-have
```

## Usage Examples

### Frontend (TypeScript)

```typescript
import { prioritizeTasks } from '@/lib/api';

const taskIds = ['task-1', 'task-2', 'task-3'];
const context = 'I have a presentation tomorrow';

const result = await prioritizeTasks(taskIds, context);

if (result.success) {
  result.priorities.forEach(p => {
    console.log(`Task ${p.task_id}: ${p.priority} - ${p.reason}`);
  });
}
```

### cURL

```bash
curl -X POST http://localhost:8000/api/v1/agents/prioritize \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "task_ids": ["uuid1", "uuid2"],
    "context": "Working on a deadline"
  }'
```

## Considerations

- **Rate Limits**: Groq free tier allows 30 requests/minute
- **Token Usage**: Each request uses ~500-1000 tokens
- **Latency**: Typically 1-3 seconds per request
- **Fallback**: If Groq fails, automatically falls back to Ollama

## Related

- [Task Decomposer Agent](./task-decomposer.md)
- [Architecture Overview](./architecture.md)
- [API Reference](./api-reference.md)
