/**
 * Dashboard page - main protected page for authenticated users.
 * Landing page with quick links to main features.
 */

'use client';

import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back! Manage your tasks and stay productive.
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* View Tasks */}
            <Link
              href="/tasks"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View Tasks
              </h3>
              <p className="text-gray-600">
                See all your tasks, filter, and manage them efficiently.
              </p>
            </Link>

            {/* Create Task - Coming in Phase 5 */}
            <div className="bg-white rounded-lg shadow p-6 opacity-50">
              <div className="text-4xl mb-3">➕</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Task
              </h3>
              <p className="text-gray-600">
                Add new tasks with priorities, tags, and due dates.
              </p>
              <span className="inline-block mt-2 text-xs text-indigo-600 font-medium">
                Coming soon
              </span>
            </div>

            {/* Statistics - Future feature */}
            <div className="bg-white rounded-lg shadow p-6 opacity-50">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Statistics
              </h3>
              <p className="text-gray-600">
                View your productivity stats and task completion trends.
              </p>
              <span className="inline-block mt-2 text-xs text-indigo-600 font-medium">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
