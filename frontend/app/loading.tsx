export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4 dark:border-gray-700"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
