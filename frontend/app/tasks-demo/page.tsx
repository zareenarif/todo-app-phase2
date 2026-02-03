'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Badge from '@/components/Badge';

export default function TasksDemoPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const dummyTasks = [
    {
      id: 1,
      title: 'Design new landing page',
      description: 'Create wireframes and mockups for the new marketing site',
      completed: false,
      priority: 'high',
    },
    {
      id: 2,
      title: 'Update documentation',
      description: 'Add API reference docs for the new endpoints',
      completed: true,
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Review pull requests',
      description: 'Check and merge pending PRs from the team',
      completed: false,
      priority: 'high',
    },
  ];

  const filteredTasks = dummyTasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      <Header variant="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
          {filteredTasks.length === 0 ? (
            <p className="text-gray-600 text-lg">No tasks yet. Create your first one!</p>
          ) : (
            <p className="text-gray-600 text-lg">{filteredTasks.length} tasks found</p>
          )}
        </div>

        {/* Filters & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Filter Pills */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                filter === 'pending'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                filter === 'completed'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Add Task Button */}
          <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md flex items-center gap-2">
            <span className="text-lg">+</span>
            <span>Add Task</span>
          </button>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'completed' && 'You haven\'t completed any tasks yet.'}
              {filter === 'pending' && 'You don\'t have any pending tasks.'}
              {filter === 'all' && 'Get started by creating your first task!'}
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md">
              Create Task
            </button>
          </div>
        ) : (
          // Task Cards
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="sr-only peer"
                        onChange={() => {}}
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                        task.completed
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500'
                          : 'bg-white border-gray-300 hover:border-indigo-400'
                      }`}>
                        {task.completed && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className={`text-lg font-bold mb-1 ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    <p className={`text-sm mb-3 ${
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={task.priority === 'high' ? 'warning' : 'info'}
                        size="sm"
                      >
                        {task.priority === 'high' ? '🔴 High' : '🟡 Medium'}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
