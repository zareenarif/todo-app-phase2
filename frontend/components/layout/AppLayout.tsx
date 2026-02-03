'use client';

import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - fixed width */}
      <Sidebar />

      {/* Main content area - takes remaining space */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <main className="min-h-screen w-full p-6 pt-20 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
