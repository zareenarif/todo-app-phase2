/**
 * Task Skeleton - Beautiful loading state for tasks
 */

export default function TaskSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 animate-pulse">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />

      <div className="flex items-start gap-4">
        {/* Checkbox skeleton */}
        <div className="flex-shrink-0 pt-1">
          <div className="w-6 h-6 rounded-lg bg-gray-200" />
        </div>

        {/* Content skeleton */}
        <div className="flex-grow min-w-0 space-y-3">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 rounded w-3/4" />

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
          </div>

          {/* Badges skeleton */}
          <div className="flex gap-2 mt-4">
            <div className="h-6 w-16 bg-gray-200 rounded-lg" />
            <div className="h-6 w-20 bg-gray-200 rounded-lg" />
            <div className="h-6 w-24 bg-gray-200 rounded-lg" />
          </div>

          {/* Timestamp skeleton */}
          <div className="h-3 bg-gray-100 rounded w-32 mt-3" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex-shrink-0 flex gap-2">
          <div className="h-10 w-20 bg-gray-200 rounded-xl" />
          <div className="h-10 w-20 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
