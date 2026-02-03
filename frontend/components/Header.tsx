'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  variant?: 'landing' | 'dashboard';
}

export default function Header({ variant = 'landing' }: HeaderProps) {
  const pathname = usePathname();

  if (variant === 'landing') {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard variant
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/tasks" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              href="/tasks"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/tasks'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tasks
            </Link>
            <Link
              href="/profile"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/profile'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </Link>
            <Link
              href="/settings"
              className={`text-sm font-semibold transition-colors ${
                pathname === '/settings'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </Link>
          </nav>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
