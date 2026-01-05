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

  useEffect(() => {
    // Check if user has JWT token
    // In actual implementation, this would verify with Better Auth
    const checkAuth = () => {
      const token = localStorage.getItem('jwt_token');

      if (!token) {
        // No token, redirect to login
        router.push('/login');
        return;
      }

      // TODO: In actual implementation, verify token with backend
      // For now, we just check if token exists
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect happens in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
