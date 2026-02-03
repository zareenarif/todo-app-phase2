---
description: Check API contract coverage between frontend and backend
handoffs:
  - label: Fix Coverage Gaps
    agent: sp.implement
    prompt: Implement missing API endpoints or frontend integrations
    send: true
---

# COMMAND: API Coverage Audit

## CONTEXT

Use this skill to verify frontend-backend API alignment. This workflow checks:
- All backend endpoints have frontend consumers
- All frontend API calls have backend handlers
- Request/response types match
- Error handling is consistent

**User's input to record:**
$ARGUMENTS

## YOUR ROLE

You are a full-stack engineer specializing in:
- API design and contracts
- TypeScript and Python type systems
- REST API best practices
- Frontend-backend integration

## OUTLINE

### Step 1: Backend Endpoint Inventory

List all endpoints from `backend/src/api/v1/`:
```
Auth:
- POST /auth/login
- POST /auth/register

Tasks:
- GET /tasks
- POST /tasks
- GET /tasks/{id}
- PUT /tasks/{id}
- DELETE /tasks/{id}
- PATCH /tasks/{id}/complete

Agents:
- POST /agents/prioritize
- POST /agents/decompose
- POST /agents/chat
- GET /agents/logs
- GET /agents/health
```

### Step 2: Frontend API Client Inventory

List all functions from `frontend/lib/api.ts`:
```
Tasks:
- listTasks()
- createTask()
- updateTask()
- deleteTask()
- toggleTaskCompletion()

Agents:
- prioritizeTasks()
- decomposeTask()
- chatWithAgent()
- getAgentLogs()
- checkLLMHealth()
```

### Step 3: Type Alignment Check

Compare types between:
- `backend/src/schemas/*.py` (Pydantic)
- `frontend/lib/types.ts` (TypeScript)

```
[ ] Task types match
[ ] TaskCreate types match
[ ] TaskUpdate types match
[ ] Agent response types match
[ ] Error response types match
```

### Step 4: Missing Coverage Detection

Identify:
- Backend endpoints with no frontend consumer
- Frontend calls with no backend handler
- Type mismatches between layers
- Missing error handling

### Step 5: Generate Coverage Report

```markdown
# API Coverage Report

## Summary
- Total Backend Endpoints: X
- Total Frontend Consumers: X
- Coverage: X%

## Endpoints

| Endpoint | Backend | Frontend | Types Match |
|----------|---------|----------|-------------|
| GET /tasks | ✅ | ✅ | ✅ |
| POST /agents/prioritize | ✅ | ✅ | ✅ |

## Missing Coverage
[List gaps]

## Type Mismatches
[List mismatches]
```

## OUTPUT FORMAT

Generate:
1. `specs/<feature>/api-coverage.md` - Coverage report
2. Update `frontend/lib/types.ts` if types missing
3. Update `frontend/lib/api.ts` if endpoints missing

## KEY RULES

- Every backend endpoint should have a frontend consumer (or be intentionally internal)
- Types must match exactly (field names, types, optionality)
- Error responses must be handled consistently
- Document any intentional gaps

---

## PHR Creation

After completing this workflow:
- Stage: `misc` or `explainer`
- Route: `history/prompts/<feature-name>/`
- Record coverage findings and gaps
