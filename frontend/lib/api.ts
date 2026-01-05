/**
 * API client for backend communication.
 * Handles JWT authentication and error handling.
 */

import { Task, TaskCreate, TaskUpdate } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Get JWT token from storage (placeholder - actual implementation depends on Better Auth).
 */
function getJWT(): string | null {
  // In actual implementation, this would retrieve JWT from Better Auth session
  // For now, placeholder that assumes JWT is in localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token');
  }
  return null;
}

/**
 * Handle API responses and errors.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    // Redirect to login on unauthorized
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'An error occurred');
  }

  if (response.status === 204) {
    return null as T; // No content
  }

  return response.json();
}

/**
 * List all tasks for authenticated user.
 */
export async function listTasks(filters?: {
  status?: 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  tags?: string;
  sort?: 'created_at' | 'due_date' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}): Promise<Task[]> {
  const params = new URLSearchParams(filters as any);
  const jwt = getJWT();

  const response = await fetch(`${API_URL}/tasks?${params}`, {
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  return handleResponse<Task[]>(response);
}

/**
 * Create a new task.
 */
export async function createTask(data: TaskCreate): Promise<Task> {
  const jwt = getJWT();

  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Task>(response);
}

/**
 * Update an existing task.
 */
export async function updateTask(id: string, data: TaskUpdate): Promise<Task> {
  const jwt = getJWT();

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Task>(response);
}

/**
 * Delete a task.
 */
export async function deleteTask(id: string): Promise<void> {
  const jwt = getJWT();

  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  return handleResponse<void>(response);
}

/**
 * Toggle task completion status.
 */
export async function toggleTaskCompletion(id: string): Promise<Task> {
  const jwt = getJWT();

  const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
  });

  return handleResponse<Task>(response);
}
