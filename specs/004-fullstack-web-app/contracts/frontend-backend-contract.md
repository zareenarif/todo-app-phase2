# Frontend-Backend Contract

**Feature**: 004-fullstack-web-app
**Date**: 2026-01-05
**Purpose**: Define the integration contract between Next.js frontend and FastAPI backend

---

## Overview

This document specifies how the Next.js frontend and FastAPI backend communicate, including authentication flow, API requests, error handling, and data formats.

---

## Authentication Flow

### Registration

**Frontend (Next.js + Better Auth)**:
1. User submits email/password on `/register` page
2. Better Auth creates user account in PostgreSQL `users` table
3. Better Auth generates JWT signed with `BETTER_AUTH_SECRET`
4. JWT stored in HTTP-only cookie (inaccessible to JavaScript)
5. User redirected to `/dashboard`

**Backend (FastAPI)**:
- No action required (user creation handled by Better Auth)
- Backend will reference user via `user_id` from JWT

### Login

**Frontend (Next.js + Better Auth)**:
1. User submits email/password on `/login` page
2. Better Auth verifies credentials against `users` table
3. Better Auth generates JWT signed with `BETTER_AUTH_SECRET`
4. JWT stored in HTTP-only cookie
5. User redirected to `/dashboard`

**Backend (FastAPI)**:
- No action required (login handled by Better Auth)

### Logout

**Frontend (Next.js + Better Auth)**:
1. User clicks "Logout" button
2. Better Auth clears JWT from HTTP-only cookie
3. User redirected to `/` (landing page)

**Backend (FastAPI)**:
- No action required (stateless; token simply expires)

---

## API Request Pattern

### Request Format

All protected API requests follow this pattern:

```http
GET /api/v1/tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Headers** (Required):
- `Authorization`: `Bearer <JWT_TOKEN>` (from Better Auth)
- `Content-Type`: `application/json` (for POST/PUT/PATCH requests)

**JWT Token**:
- Frontend extracts JWT from HTTP-only cookie
- Includes in `Authorization` header on every API request
- Backend extracts and verifies JWT to get `user_id`

### Response Format

**Success Response** (2xx):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "650e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": null,
  "completed": false,
  "priority": null,
  "tags": [],
  "due_date": null,
  "recurrence": null,
  "created_at": "2026-01-05T10:00:00Z",
  "updated_at": "2026-01-05T10:00:00Z"
}
```

**Error Response** (4xx/5xx):
```json
{
  "detail": "Task not found"
}
```

---

## API Endpoints (Frontend Usage)

### 1. List Tasks

**Frontend Request**:
```typescript
// src/lib/api.ts
export async function listTasks(filters?: {
  status?: 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  tags?: string;
  sort?: 'created_at' | 'due_date' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}): Promise<Task[]> {
  const params = new URLSearchParams(filters as any);
  const response = await fetch(`${API_URL}/tasks?${params}`, {
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
}
```

**Backend Behavior**:
- Extracts `user_id` from JWT
- Queries tasks WHERE `user_id == current_user_id`
- Applies optional filters
- Returns tasks as JSON array

### 2. Create Task

**Frontend Request**:
```typescript
export async function createTask(data: {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  due_date?: string;
  recurrence?: 'daily' | 'weekly' | 'monthly';
}): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
}
```

**Backend Behavior**:
- Extracts `user_id` from JWT
- Creates task with `user_id` automatically assigned
- Validates request body (Pydantic)
- Returns created task as JSON

### 3. Update Task

**Frontend Request**:
```typescript
export async function updateTask(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    tags: string[];
    due_date: string;
    recurrence: 'daily' | 'weekly' | 'monthly';
  }>
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
}
```

**Backend Behavior**:
- Extracts `user_id` from JWT
- Verifies task.user_id == JWT.user_id (403 if mismatch)
- Updates task fields
- Sets `updated_at` to NOW()
- Returns updated task as JSON

### 4. Delete Task

**Frontend Request**:
```typescript
export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete task');
}
```

**Backend Behavior**:
- Extracts `user_id` from JWT
- Verifies task.user_id == JWT.user_id (403 if mismatch)
- Deletes task from database
- Returns 204 No Content

### 5. Toggle Completion

**Frontend Request**:
```typescript
export async function toggleTaskCompletion(id: string): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getJWT()}`,
    },
  });
  if (!response.ok) throw new Error('Failed to toggle task');
  return response.json();
}
```

**Backend Behavior**:
- Extracts `user_id` from JWT
- Verifies task.user_id == JWT.user_id (403 if mismatch)
- Toggles `completed` field (true ↔ false)
- If recurring task marked complete, creates new task instance
- Returns updated task as JSON

---

## Error Handling

### Frontend Error Handling

**HTTP Status Codes**:
- `400 Bad Request`: Validation error (display error message to user)
- `401 Unauthorized`: JWT missing/invalid (redirect to `/login`)
- `403 Forbidden`: JWT valid but accessing another user's task (display error)
- `404 Not Found`: Task ID doesn't exist (display error)
- `500 Internal Server Error`: Server error (display generic error, log details)

**Example Error Handler**:
```typescript
// src/lib/api.ts
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    // Redirect to login
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'An error occurred');
  }

  if (response.status === 204) {
    return null as T; // No content (e.g., DELETE response)
  }

  return response.json();
}
```

### Backend Error Responses

**Validation Error (400)**:
```json
{
  "detail": "Title cannot be empty"
}
```

**Unauthorized (401)**:
```json
{
  "detail": "Could not validate credentials"
}
```

**Forbidden (403)**:
```json
{
  "detail": "You do not have permission to access this task"
}
```

**Not Found (404)**:
```json
{
  "detail": "Task not found"
}
```

**Internal Server Error (500)**:
```json
{
  "detail": "An unexpected error occurred"
}
```

---

## Data Isolation Guarantee

**Contract**: The backend GUARANTEES that:
1. All task queries filter by authenticated `user_id`
2. No user can access another user's tasks via any endpoint
3. All ownership checks return 403 Forbidden (not 404) when task exists but belongs to another user
4. `user_id` is automatically extracted from JWT (frontend never sends user_id in request body)

**Frontend Responsibility**:
- Include valid JWT in every API request
- Handle 401 by redirecting to login
- Handle 403 by displaying "Access denied" error
- Never attempt to manipulate `user_id` (backend ignores any client-provided user_id)

---

## Environment Variables

### Frontend (.env.local)

```env
# Better Auth secret (MUST match backend)
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars

# Database URL (Better Auth needs access to users table)
DATABASE_URL=postgresql://user:password@ep-example.us-east-2.aws.neon.tech/todo_db?sslmode=require

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend (.env)

```env
# Better Auth secret (MUST match frontend)
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars

# Database URL
DATABASE_URL=postgresql://user:password@ep-example.us-east-2.aws.neon.tech/todo_db?sslmode=require

# CORS origins (allow frontend origin)
CORS_ORIGINS=http://localhost:3000,https://app.example.com
```

**CRITICAL**: `BETTER_AUTH_SECRET` MUST be identical in both frontend and backend

---

## TypeScript Types (Frontend)

```typescript
// src/lib/types.ts

export enum PriorityEnum {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum RecurrenceEnum {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: PriorityEnum | null;
  tags: string[];
  due_date: string | null; // ISO date string (YYYY-MM-DD)
  recurrence: RecurrenceEnum | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: PriorityEnum;
  tags?: string[];
  due_date?: string; // YYYY-MM-DD
  recurrence?: RecurrenceEnum;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: PriorityEnum;
  tags?: string[];
  due_date?: string; // YYYY-MM-DD
  recurrence?: RecurrenceEnum;
}
```

---

## Development Workflow

1. **Start Backend**: `cd backend && uvicorn src.main:app --reload` (port 8000)
2. **Start Frontend**: `cd frontend && npm run dev` (port 3000)
3. **CORS**: Backend allows `http://localhost:3000` in development
4. **Database**: Both frontend (Better Auth) and backend connect to same Neon PostgreSQL
5. **JWT Secret**: Same `BETTER_AUTH_SECRET` in both `.env` files

---

## Summary

| Aspect | Frontend Responsibility | Backend Responsibility |
|--------|------------------------|------------------------|
| Authentication | Better Auth handles registration/login/logout | Verify JWT on every protected endpoint |
| JWT Storage | HTTP-only cookie (secure) | Extract from Authorization header |
| User ID | Never send in request body | Extract from verified JWT |
| API Calls | Include `Authorization: Bearer <token>` | Filter queries by `user_id` |
| Error Handling | Redirect to login on 401, display errors on 400/403/404/500 | Return consistent error format |
| Data Format | JSON request/response | JSON request/response with Pydantic validation |

**Status**: ✅ Frontend-Backend contract complete
