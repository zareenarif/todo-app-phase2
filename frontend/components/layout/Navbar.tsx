/**
 * Navbar component - main navigation bar.
 * Shows app branding, navigation links, and auth controls.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Button from '../common/Button';
import { useTheme } from '../providers/ThemeProvider';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('jwt_token');
    setIsAuthenticated(!!token);
  }, [pathname]); // Re-check when route changes

  const handleLogout = () => {
    // Clear JWT token
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === '/dashboard'
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/tasks"
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === '/tasks'
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ✓ Tasks
                </Link>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>

                {/* User Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button and avatar */}
          <div className="flex items-center gap-3 md:hidden">
            {isAuthenticated && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xs">U</span>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-indigo-100"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
          <div className="px-4 pt-4 pb-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                    pathname === '/dashboard'
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/tasks"
                  className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                    pathname === '/tasks'
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ✓ Tasks
                </Link>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="secondary"
                  size="md"
                  fullWidth
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:bg-gray-100 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
