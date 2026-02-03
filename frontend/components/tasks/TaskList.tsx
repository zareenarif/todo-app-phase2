/**
 * TaskList component - fetches and displays a list of tasks.
 * Shows loading state, empty state, and error state.
 */

'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { listTasks } from '@/lib/api';
import TaskCard from './TaskCard';
import TaskSkeleton from '../common/TaskSkeleton';

interface TaskListProps {
  filters?: {
    status?: 'pending' | 'completed';
    priority?: 'high' | 'medium' | 'low';
    tags?: string;
    sort?: 'created_at' | 'due_date' | 'priority' | 'title';
    order?: 'asc' | 'desc';
  };
  refreshTrigger?: number; // Increment this to trigger a refresh
  searchQuery?: string; // Client-side search filter
}

export default function TaskList({ filters, refreshTrigger = 0, searchQuery = '' }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter tasks by search query (client-side)
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

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

  // Loading state with skeleton loaders
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-xl mb-2">⚠️</div>
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

  // Empty state - Premium design
  if (filteredTasks.length === 0) {
    const isSearching = searchQuery.trim().length > 0;
    const hasFilters = filters?.status || filters?.priority;

    return (
      <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-3xl shadow-lg p-16 text-center overflow-hidden animate-fade-in transition-colors">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 rounded-full opacity-20 -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-900 dark:to-purple-900 rounded-full opacity-20 -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl mb-4 animate-bounce-in">
            <span className="text-2xl">{isSearching ? '🔍' : '📝'}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {isSearching
              ? 'No Results Found'
              : filters?.status === 'completed'
              ? 'No Completed Tasks Yet'
              : filters?.status === 'pending'
              ? 'No Pending Tasks'
              : 'No Tasks Found'}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            {isSearching
              ? `No tasks match "${searchQuery}". Try a different search term.`
              : filters?.status === 'completed'
              ? "You haven't completed any tasks yet. Keep working on your pending tasks!"
              : filters?.status === 'pending'
              ? "Great job! You don't have any pending tasks at the moment."
              : 'Get started on your productivity journey by creating your first task!'}
          </p>
          {!filters?.status && !isSearching && (
            <button
              onClick={() => window.location.href = '/tasks'}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Create Your First Task
            </button>
          )}
        </div>
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
    <div>
      {/* Task count */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          {searchQuery && tasks.length !== filteredTasks.length && (
            <span className="text-gray-400 dark:text-gray-500"> (filtered from {tasks.length})</span>
          )}
        </span>
      </div>

      {/* Tasks - Responsive grid: 1 col → 2 cols → 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskUpdated={handleTaskUpdated} />
        ))}
      </div>
    </div>
  );
}
