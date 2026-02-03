'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import Button from '@/components/common/Button';
import { Task } from '@/lib/types';
import { listTasks } from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';

export default function TasksPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allTasks = await listTasks();
        const completed = allTasks.filter(t => t.completed).length;
        setTaskStats({
          total: allTasks.length,
          completed,
          pending: allTasks.length - completed
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCreateForm) {
        setShowCreateForm(false);
      }
      if (event.key === 'n' && !showCreateForm &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        setShowCreateForm(true);
      }
      if (event.key === '/' && !showCreateForm &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') {
        event.preventDefault();
        document.getElementById('task-search')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCreateForm]);

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date' | 'priority' | 'title'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleTaskCreated = (task: Task) => {
    setRefreshTrigger(prev => prev + 1);
    setShowCreateForm(false);
  };

  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    sort: sortBy,
    order: sortOrder,
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organize and manage your tasks
                </p>
              </div>
              <Button onClick={() => setShowCreateForm(true)} variant="primary" size="lg">
                <span>+ New Task</span>
              </Button>
            </div>

            {/* Stats */}
            {taskStats.total > 0 && (
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{taskStats.total}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{taskStats.completed}</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{taskStats.pending}</p>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  id="task-search"
                  type="text"
                  placeholder="Search tasks... (Press /)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="created_at">Date Created</option>
                    <option value="due_date">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {(statusFilter !== 'all' || priorityFilter !== 'all') && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                  <span className="text-xs text-gray-500">Filters:</span>
                  {statusFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                      {statusFilter}
                      <button onClick={() => setStatusFilter('all')}>✕</button>
                    </span>
                  )}
                  {priorityFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                      {priorityFilter}
                      <button onClick={() => setPriorityFilter('all')}>✕</button>
                    </span>
                  )}
                  <button
                    onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); }}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Task List */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <TaskList filters={filters} refreshTrigger={refreshTrigger} searchQuery={searchQuery} />
            </div>

            {/* Keyboard hints */}
            <div className="mt-4 text-center text-xs text-gray-400">
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">N</kbd> New task
              <span className="mx-2">·</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">/</kbd> Search
              <span className="mx-2">·</span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">Esc</kbd> Close
            </div>
          </div>

          {/* Create Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create New Task</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                <TaskForm
                  onSuccess={handleTaskCreated}
                  onCancel={() => setShowCreateForm(false)}
                  mode="create"
                />
              </div>
            </div>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
