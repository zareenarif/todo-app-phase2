/**
 * TaskList component - fetches and displays a list of tasks.
 * Shows loading state, empty state, and error state.
 */

'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { listTasks } from '@/lib/api';
import TaskCard from './TaskCard';

interface TaskListProps {
  filters?: {
    status?: 'pending' | 'completed';
    priority?: 'high' | 'medium' | 'low';
    tags?: string;
    sort?: 'created_at' | 'due_date' | 'priority' | 'title';
    order?: 'asc' | 'desc';
  };
  refreshTrigger?: number; // Increment this to trigger a refresh
}

export default function TaskList({ filters, refreshTrigger = 0 }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedTasks = await listTasks(filters);
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters, refreshTrigger]); // Re-fetch when filters or refreshTrigger changes

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-4xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Tasks</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tasks found
        </h3>
        <p className="text-gray-600">
          {filters?.status === 'completed'
            ? "You haven't completed any tasks yet."
            : filters?.status === 'pending'
            ? "You don't have any pending tasks."
            : 'Get started by creating your first task!'}
        </p>
      </div>
    );
  }

  // Refresh handler for task updates
  const handleTaskUpdated = () => {
    // Trigger re-fetch by incrementing refreshTrigger
    window.location.reload(); // Simple refresh for now
  };

  // Task list
  return (
    <div className="space-y-4">
      {/* Task count */}
      <div className="text-sm text-gray-600">
        Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
      </div>

      {/* Tasks */}
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onTaskUpdated={handleTaskUpdated} />
      ))}
    </div>
  );
}
