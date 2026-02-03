'use client';

import { StatsCardProps } from '@/lib/types/components';

export function StatsCard({
  title,
  value,
  icon,
  iconGradient = { from: 'indigo-500', to: 'purple-500' },
  trend,
  footer,
}: StatsCardProps) {
  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-5 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 bg-gradient-to-br from-${iconGradient.from} to-${iconGradient.to} rounded-lg flex items-center justify-center shadow-md`}
          style={{
            background: `linear-gradient(to bottom right, var(--tw-gradient-from, #6366f1), var(--tw-gradient-to, #a855f7))`,
          }}
        >
          {icon ? (
            <span className="text-base">{icon}</span>
          ) : (
            <span className="text-white text-sm">📊</span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <span className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
                {getTrendIcon()}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}

export default StatsCard;
