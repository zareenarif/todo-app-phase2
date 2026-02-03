/**
 * AuthGuard component - protects routes requiring authentication.
 * Redirects to login if user is not authenticated.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if user has JWT token
    const checkAuth = () => {
      // Ensure we're in browser environment
      if (typeof window === 'undefined') {
        return;
      }

      const token = localStorage.getItem('jwt_token');
      console.log('[AuthGuard] Checking auth, token exists:', !!token);

      if (!token) {
        // No token, redirect to login
        console.log('[AuthGuard] No token found, redirecting to login');
        setIsRedirecting(true);
        setIsLoading(false);
        router.push('/login');
        return;
      }

      // Token exists - user is authenticated
      console.log('[AuthGuard] Token found, user authenticated');
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3 dark:border-gray-700"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If redirecting, show a brief message
  if (isRedirecting) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not redirecting, show nothing
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
