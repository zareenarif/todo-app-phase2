# Task Decomposer Agent

The Task Decomposer Agent breaks down complex tasks into smaller, actionable subtasks using AI analysis.

## Overview

- **Type**: `decomposer`
- **Endpoint**: `POST /api/v1/agents/decompose`
- **Source**: `backend/src/agents/task_decomposer.py`

## How It Works

1. **Task Retrieval**: Fetches the target task from database
2. **Ownership Verification**: Ensures user owns the task
3. **LLM Processing**: Sends task details to LLM for decomposition
4. **Response Parsing**: Extracts structured subtasks from LLM response
5. **Logging**: Records execution in AgentLog

## API Reference

### Request

```http
POST /api/v1/agents/decompose
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "task_id": "uuid-of-task-to-decompose",
  "max_subtasks": 10,
  "detail_level": "medium"
}
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `task_id` | string | required | UUID of task to decompose |
| `max_subtasks` | integer | 10 | Maximum subtasks to generate (1-20) |
| `detail_level` | string | "medium" | "brief", "medium", or "detailed" |

### Response

```json
{
  "success": true,
  "parent_task_id": "uuid-of-original-task",
  "subtasks": [
    {
      "title": "Research existing solutions",
      "description": "Look at competitor implementations",
      "priority": "high",
      "effort": "small"
    },
    {
      "title": "Create design document",
      "description": "Outline the architecture and approach",
      "priority": "high",
      "effort": "medium"
    },
    {
      "title": "Implement core functionality",
      "description": "",
      "priority": "medium",
      "effort": "large"
    }
  ],
  "message": "Generated 3 subtasks."
}
```

## Subtask Structure

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Action-oriented task title (starts with verb) |
| `description` | string | Optional additional details |
| `priority` | string | "high", "medium", or "low" |
| `effort` | string | "small", "medium", or "large" |

## Detail Levels

| Level | Description |
|-------|-------------|
| **brief** | Concise, high-level subtasks |
| **medium** | Moderate detail, balanced approach |
| **detailed** | Comprehensive descriptions and context |

## System Prompt

```
You are an expert task decomposition assistant. Your job is to break down complex tasks into smaller, actionable subtasks.

Guidelines for decomposition:
1. **Actionable**: Each subtask should be a concrete action that can be completed
2. **Specific**: Subtasks should be clear and unambiguous
3. **Appropriately sized**: Not too large (should take minutes to hours, not days)
4. **Ordered**: List subtasks in logical execution order when applicable
5. **Complete**: Cover all aspects needed to complete the parent task
```

## Usage Examples

### Frontend (TypeScript)

```typescript
import { decomposeTask } from '@/lib/api';

const result = await decomposeTask(
  'task-uuid',
  8,       // max 8 subtasks
  'detailed'
);

if (result.success) {
  result.subtasks.forEach((subtask, i) => {
    console.log(`${i + 1}. ${subtask.title} (${subtask.effort} effort)`);
  });
}
```

### Creating Subtasks from Results

```typescript
// After getting decomposition results
const result = await decomposeTask(taskId);

// Create each subtask as a new task
for (const subtask of result.subtasks) {
  await createTask({
    title: subtask.title,
    description: subtask.description,
    priority: subtask.priority as PriorityEnum,
  });
}
```

## Best Practices

1. **Use for complex tasks**: Simple tasks don't need decomposition
2. **Review subtasks**: AI suggestions are starting points, adjust as needed
3. **Consider dependencies**: Some subtasks may need ordering
4. **Estimate effort**: Use effort hints for planning

## Related

- [Task Prioritizer Agent](./task-prioritizer.md)
- [Architecture Overview](./architecture.md)
- [API Reference](./api-reference.md)
