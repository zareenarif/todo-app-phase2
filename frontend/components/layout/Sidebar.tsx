/**
 * Sidebar Navigation - Modern sidebar with smooth animations
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    router.push('/');
  };

  const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { href: '/tasks', icon: '✓', label: 'My Tasks' },
    { href: '/calendar', icon: '📅', label: 'Calendar', badge: 'Soon' },
    { href: '/analytics', icon: '📊', label: 'Analytics', badge: 'Soon' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 text-white transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Todo App</h2>
                <p className="text-xs text-white/70">Productivity Hub</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
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
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative animate-fade-in-left ${
                isActive
                  ? 'bg-white/20 shadow-lg'
                  : 'hover:bg-white/10'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/30">
            U
          </div>
          {!isCollapsed && (
            <div className="flex-1 animate-fade-in">
              <p className="font-semibold text-sm">User</p>
              <p className="text-xs text-white/70">user@example.com</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <span className="text-xl">🚪</span>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
