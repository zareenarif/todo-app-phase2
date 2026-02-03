'use client';

interface DecorativeBackgroundProps {
  variant?: 'dots' | 'gradient' | 'circles' | 'none';
}

export default function DecorativeBackground({ variant = 'gradient' }: DecorativeBackgroundProps) {
  // No decoration
  if (variant === 'none') {
    return null;
  }

  if (variant === 'dots') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <svg
          className="absolute h-full w-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots-pattern"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                className="fill-gray-300 dark:fill-gray-700"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
      </div>
    );
  }

  if (variant === 'circles') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Subtle gradient blobs - light colors only */}
        <div
          className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10"
        />
        <div
          className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-500/10"
        />
      </div>
    );
  }

  // Default: gradient - simple and safe
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
      />
    </div>
  );
}
