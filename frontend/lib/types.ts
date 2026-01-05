/**
 * TypeScript type definitions for the application.
 */

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

export interface ErrorResponse {
  detail: string;
}
