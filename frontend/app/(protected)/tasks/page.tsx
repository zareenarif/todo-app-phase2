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

export default function TasksPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = (task: Task) => {
    // Refresh task list
    setRefreshTrigger(prev => prev + 1);
    // Close form
    setShowCreateForm(false);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page header with Add Task button */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
              <p className="mt-2 text-gray-600">
                View and manage all your tasks in one place.
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
            >
              + Add Task
            </button>
          </div>

          {/* Create Task Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
                <TaskForm
                  onSuccess={handleTaskCreated}
                  onCancel={() => setShowCreateForm(false)}
                  mode="create"
                />
              </div>
            </div>
          )}

          {/* Task list */}
          <TaskList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </AuthGuard>
  );
}
