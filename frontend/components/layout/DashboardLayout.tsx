'use client';

import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from '@/lib/types/components';
import { useTheme } from '../providers/ThemeProvider';

interface DashboardLayoutProps {
  children: ReactNode;
  navItems?: NavItem[];
  logo?: ReactNode;
  userMenu?: ReactNode;
}

const defaultNavItems: NavItem[] = [
  { key: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'tasks', href: '/tasks', label: 'My Tasks', icon: '✓' },
  { key: 'agent', href: '/agent', label: 'AI Agent', icon: '🤖' },
  { key: 'calendar', href: '/calendar', label: 'Calendar', icon: '📅' },
  { key: 'analytics', href: '/analytics', label: 'Analytics', icon: '📊' },
];

export function DashboardLayout({
  children,
  navItems = defaultNavItems,
  logo,
  userMenu,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 text-white transition-all duration-300 z-50 hidden lg:block ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3 animate-fade-in">
                {logo || (
                  <>
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center border border-white/30">
                      <span className="text-base">✓</span>
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Todo App</h2>
                      <p className="text-xs text-white/70">Productivity Hub</p>
                    </div>
                  </>
                )}
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-base group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <>
                    <span className="font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-yellow-400 text-yellow-900 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/10">
          {userMenu || (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/30">
                  U
                </div>
                {!isCollapsed && (
                  <div className="flex-1">
                    <p className="font-semibold text-sm">User</p>
                    <p className="text-xs text-white/70">user@example.com</p>
                  </div>
                )}
              </div>
              <button
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all mb-2 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <span className="text-sm">{theme === 'light' ? '🌙' : '☀️'}</span>
                {!isCollapsed && (
                  <span className="font-medium">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <span className="text-sm">🚪</span>
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <span className="text-sm">{theme === 'light' ? '🌙' : '☀️'}</span>
                  <span className="font-medium">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <span className="text-sm">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        } pt-16 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
