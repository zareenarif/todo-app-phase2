'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 text-3xl">⚠️</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
