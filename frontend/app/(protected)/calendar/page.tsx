'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import AppLayout from '@/components/layout/AppLayout';
import Calendar from '@/components/calendar/Calendar';
import { Task, PriorityEnum } from '@/lib/types';
import { listTasks, toggleTaskCompletion, updateTask } from '@/lib/api';

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await listTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Handle toggle completion
  const handleToggleCompletion = async (taskId: string) => {
    try {
      await toggleTaskCompletion(taskId);
      // Refresh tasks
      const updatedTasks = await listTasks();
      setTasks(updatedTasks);
      setSelectedTask(null);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedTask(null);
  };

  // Handle task drop (reschedule)
  const handleTaskDrop = async (taskId: string, newDate: string) => {
    try {
      // Find the task to get its title for the toast
      const task = tasks.find(t => t.id === taskId);

      // Update the task with the new due date
      await updateTask(taskId, { due_date: newDate });

      // Refresh tasks
      const updatedTasks = await listTasks();
      setTasks(updatedTasks);

      // Show success toast
      const formattedDate = new Date(newDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      setToastMessage(`"${task?.title}" moved to ${formattedDate}`);

      // Auto-hide toast after 3 seconds
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Failed to reschedule task:', err);
      setToastMessage('Failed to reschedule task');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Get priority badge style
  const getPriorityBadge = (priority: PriorityEnum | null) => {
    switch (priority) {
      case PriorityEnum.HIGH:
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case PriorityEnum.MEDIUM:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case PriorityEnum.LOW:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Calculate stats
  const tasksWithDueDate = tasks.filter(t => t.due_date);
  const completedTasks = tasksWithDueDate.filter(t => t.completed);
  const overdueTasks = tasksWithDueDate.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date());

  return (
    <AuthGuard>
      <AppLayout>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                Calendar
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and manage your tasks by date
              </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{tasksWithDueDate.length}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{completedTasks.length}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{overdueTasks.length}</p>
              </div>
            </div>

            {/* Calendar */}
            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
                <div className="text-red-600 dark:text-red-400 text-4xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2">Error Loading Calendar</h3>
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            ) : (
              <Calendar
                tasks={tasks}
                onTaskClick={handleTaskClick}
                onTaskDrop={handleTaskDrop}
              />
            )}

            {/* Task Detail Modal */}
            {selectedTask && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
                <div
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {selectedTask.priority && (
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityBadge(selectedTask.priority)}`}>
                            {selectedTask.priority.toUpperCase()}
                          </span>
                        )}
                        {selectedTask.completed && (
                          <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <h2 className={`text-2xl font-bold ${
                        selectedTask.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {selectedTask.title}
                      </h2>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
                    >
                      ×
                    </button>
                  </div>

                  {/* Description */}
                  {selectedTask.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {selectedTask.description}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="space-y-3 mb-6">
                    {selectedTask.due_date && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <span className="text-xl">📅</span>
                        <span>Due: {new Date(selectedTask.due_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    )}
                    {selectedTask.recurrence && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <span className="text-xl">🔄</span>
                        <span>Repeats: {selectedTask.recurrence}</span>
                      </div>
                    )}
                    {selectedTask.tags && selectedTask.tags.length > 0 && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🏷️</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleToggleCompletion(selectedTask.id)}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                        selectedTask.completed
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                      }`}
                    >
                      {selectedTask.completed ? '↩️ Mark Incomplete' : '✅ Mark Complete'}
                    </button>
                    <a
                      href="/tasks"
                      className="px-4 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      View All Tasks
                    </a>
                  </div>
                </div>
              </div>
            )}
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                <div className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl shadow-2xl flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>{toastMessage}</span>
                  <button
                    onClick={() => setToastMessage(null)}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
