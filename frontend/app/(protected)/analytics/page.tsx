'use client';

import { useState, useEffect, useMemo } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import AppLayout from '@/components/layout/AppLayout';
import { Task, PriorityEnum } from '@/lib/types';
import { listTasks } from '@/lib/api';

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await listTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const timeRangeDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - timeRangeDays);

    // Filter tasks by time range
    const filteredTasks = timeRange === 'all'
      ? tasks
      : tasks.filter(t => new Date(t.created_at) >= startDate);

    // Basic stats
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority breakdown
    const byPriority = {
      high: filteredTasks.filter(t => t.priority === PriorityEnum.HIGH).length,
      medium: filteredTasks.filter(t => t.priority === PriorityEnum.MEDIUM).length,
      low: filteredTasks.filter(t => t.priority === PriorityEnum.LOW).length,
      none: filteredTasks.filter(t => !t.priority).length,
    };

    // Completion by priority
    const completedByPriority = {
      high: filteredTasks.filter(t => t.priority === PriorityEnum.HIGH && t.completed).length,
      medium: filteredTasks.filter(t => t.priority === PriorityEnum.MEDIUM && t.completed).length,
      low: filteredTasks.filter(t => t.priority === PriorityEnum.LOW && t.completed).length,
    };

    // Tags breakdown
    const tagCounts: Record<string, number> = {};
    filteredTasks.forEach(task => {
      task.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Daily completion trend (last 7 days for the chart)
    const dailyData: { date: string; completed: number; created: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const completedOnDay = tasks.filter(t =>
        t.completed && t.updated_at.split('T')[0] === dateStr
      ).length;

      const createdOnDay = tasks.filter(t =>
        t.created_at.split('T')[0] === dateStr
      ).length;

      dailyData.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: completedOnDay,
        created: createdOnDay,
      });
    }

    // Overdue tasks
    const overdue = filteredTasks.filter(t =>
      !t.completed && t.due_date && new Date(t.due_date) < now
    ).length;

    // Tasks due soon (next 7 days)
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dueSoon = filteredTasks.filter(t =>
      !t.completed && t.due_date &&
      new Date(t.due_date) >= now &&
      new Date(t.due_date) <= nextWeek
    ).length;

    // Streak calculation (consecutive days with completed tasks)
    let streak = 0;
    let checkDate = new Date(now);
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasCompletion = tasks.some(t =>
        t.completed && t.updated_at.split('T')[0] === dateStr
      );
      if (hasCompletion) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Average tasks per day
    const avgTasksPerDay = timeRangeDays > 0
      ? (total / timeRangeDays).toFixed(1)
      : '0';

    return {
      total,
      completed,
      pending,
      completionRate,
      byPriority,
      completedByPriority,
      topTags,
      dailyData,
      overdue,
      dueSoon,
      streak,
      avgTasksPerDay,
    };
  }, [tasks, timeRange]);

  if (loading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl mb-1">
                    Analytics
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track your productivity and task completion trends
                  </p>
                </div>

                {/* Time Range Selector */}
                <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-md border border-gray-200 dark:border-gray-700">
                  {[
                    { value: '7d', label: '7 Days' },
                    { value: '30d', label: '30 Days' },
                    { value: '90d', label: '90 Days' },
                    { value: 'all', label: 'All Time' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeRange(option.value as typeof timeRange)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        timeRange === option.value
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Tasks */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Total Tasks</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.total}</div>
              </div>

              {/* Completed */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.completed}</div>
              </div>

              {/* Completion Rate */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Completion Rate</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analytics.completionRate}%</div>
              </div>

              {/* Streak */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.streak}</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Activity Chart */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Daily Activity (Last 7 Days)</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {analytics.dailyData.map((day, i) => {
                    const maxValue = Math.max(...analytics.dailyData.map(d => Math.max(d.completed, d.created)), 1);
                    const completedHeight = (day.completed / maxValue) * 100;
                    const createdHeight = (day.created / maxValue) * 100;

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full h-36 flex items-end justify-center gap-1">
                          {/* Created bar */}
                          <div
                            className="w-1/3 bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-md transition-all duration-300"
                            style={{ height: `${createdHeight}%`, minHeight: day.created > 0 ? '8px' : '0' }}
                            title={`Created: ${day.created}`}
                          />
                          {/* Completed bar */}
                          <div
                            className="w-1/3 bg-gradient-to-t from-green-400 to-green-500 rounded-t-md transition-all duration-300"
                            style={{ height: `${completedHeight}%`, minHeight: day.completed > 0 ? '8px' : '0' }}
                            title={`Completed: ${day.completed}`}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{day.date}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  </div>
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Tasks by Priority</h3>
                <div className="space-y-4">
                  {[
                    { label: 'High', count: analytics.byPriority.high, completed: analytics.completedByPriority.high, color: 'from-red-500 to-pink-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
                    { label: 'Medium', count: analytics.byPriority.medium, completed: analytics.completedByPriority.medium, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
                    { label: 'Low', count: analytics.byPriority.low, completed: analytics.completedByPriority.low, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
                    { label: 'No Priority', count: analytics.byPriority.none, completed: 0, color: 'from-gray-400 to-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-700' },
                  ].map((item) => {
                    const percentage = analytics.total > 0 ? (item.count / analytics.total) * 100 : 0;
                    const completionRate = item.count > 0 ? Math.round((item.completed / item.count) * 100) : 0;

                    return (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {item.completed}/{item.count}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {item.count}
                            </span>
                          </div>
                        </div>
                        <div className={`h-3 ${item.bgColor} rounded-full overflow-hidden`}>
                          <div
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <span className="text-gray-700 dark:text-gray-300">Pending</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{analytics.pending}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <span className="text-gray-700 dark:text-gray-300">Overdue</span>
                    </div>
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">{analytics.overdue}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <span className="text-gray-700 dark:text-gray-300">Due This Week</span>
                    </div>
                    <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{analytics.dueSoon}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📈</span>
                      <span className="text-gray-700 dark:text-gray-300">Avg Tasks/Day</span>
                    </div>
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{analytics.avgTasksPerDay}</span>
                  </div>
                </div>
              </div>

              {/* Top Tags */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Tags</h3>
                {analytics.topTags.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.topTags.map(([tag, count], i) => {
                      const maxCount = analytics.topTags[0][1];
                      const percentage = (count / maxCount) * 100;
                      const colors = [
                        'from-indigo-500 to-purple-500',
                        'from-blue-500 to-cyan-500',
                        'from-green-500 to-emerald-500',
                        'from-yellow-500 to-orange-500',
                        'from-pink-500 to-rose-500',
                      ];

                      return (
                        <div key={tag} className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-6">
                            {i + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700 dark:text-gray-300">🏷️ {tag}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{count} tasks</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${colors[i]} rounded-full transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <span className="text-xl block mb-1">🏷️</span>
                    No tags used yet
                  </div>
                )}
              </div>

              {/* Productivity Score */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Productivity Score</h3>
                <div className="flex flex-col items-center">
                  {/* Circular Progress */}
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#scoreGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(analytics.completionRate / 100) * 440} 440`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {analytics.completionRate}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">out of 100</span>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                      <span className="font-medium text-gray-900 dark:text-white">{analytics.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
                      <span className="font-medium text-gray-900 dark:text-white">{analytics.streak} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">On-time Rate</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {analytics.total > 0 ? Math.round(((analytics.total - analytics.overdue) / analytics.total) * 100) : 100}%
                      </span>
                    </div>
                  </div>

                  {/* Motivational Message */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {analytics.completionRate >= 80 ? '🌟 Excellent work! Keep it up!' :
                       analytics.completionRate >= 60 ? '💪 Good progress! Stay focused!' :
                       analytics.completionRate >= 40 ? '📈 Room for improvement!' :
                       '🚀 Let\'s get started!'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
