/**
 * Landing page - public entry point for the application.
 * Shows welcome message with links to login/register.
 */

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Todo App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Organize your tasks, boost your productivity, and achieve your goals.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Register
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Create Tasks
            </h3>
            <p className="text-gray-600">
              Easily add and organize your tasks with priorities and tags.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Mark tasks as complete and watch your productivity grow.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Never Miss Deadlines
            </h3>
            <p className="text-gray-600">
              Set due dates and recurring tasks to stay on top of everything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
