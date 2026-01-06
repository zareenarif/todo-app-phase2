/**
 * Tasks page - main task management interface.
 * Protected route that displays task list for authenticated users.
 */

'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import { Task } from '@/lib/types';

import AppLayout from '@/components/layout/AppLayout';

export default function TasksPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'due_date' | 'priority' | 'title'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleTaskCreated = (task: Task) => {
    setRefreshTrigger(prev => prev + 1);
    setShowCreateForm(false);
  };

  // Build filters object
  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    sort: sortBy,
    order: sortOrder,
  };

  return (
    <AuthGuard>
      <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
              My Tasks
            </h1>
            <p className="text-lg text-gray-600">
              Organize, prioritize, and accomplish your goals 🎯
            </p>
          </div>

          {/* Action Bar */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Add New Task</span>
            </button>
          </div>

          {/* Create Task Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Create New Task</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                  >
                    ×
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

          {/* Filters Bar */}
          <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">📊 Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium text-gray-700 hover:border-indigo-300 transition-colors"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">🎯 Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium text-gray-700 hover:border-indigo-300 transition-colors"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">🔀 Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium text-gray-700 hover:border-indigo-300 transition-colors"
                >
                  <option value="created_at">📅 Date Created</option>
                  <option value="due_date">⏰ Due Date</option>
                  <option value="priority">🎯 Priority</option>
                  <option value="title">🔤 Title</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">↕️ Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium text-gray-700 hover:border-indigo-300 transition-colors"
                >
                  <option value="desc">⬇️ Newest First</option>
                  <option value="asc">⬆️ Oldest First</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(statusFilter !== 'all' || priorityFilter !== 'all') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-semibold text-gray-700">Active Filters:</span>
                  {statusFilter !== 'all' && (
                    <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold flex items-center gap-2">
                      {statusFilter === 'pending' ? '⏳' : '✅'} {statusFilter}
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="hover:text-indigo-900 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {priorityFilter !== 'all' && (
                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-bold flex items-center gap-2">
                      {priorityFilter === 'high' ? '🔴' : priorityFilter === 'medium' ? '🟡' : '🟢'} {priorityFilter}
                      <button
                        onClick={() => setPriorityFilter('all')}
                        className="hover:text-purple-900 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-300 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Task List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <TaskList filters={filters} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
      </AppLayout>
    </AuthGuard>
  );
}
