'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';
import AppLayout from '@/components/layout/AppLayout';
import { listTasks } from '@/lib/api';
import { Task } from '@/lib/types';
import {
  CheckSquare,
  Clock,
  TrendingUp,
  Calendar,
  Check,
  Plus,
  Bot,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await listTasks();
        setTasks(fetchedTasks || []);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length || 12; // Default for demo
  const dueTodayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const today = new Date().toDateString();
    return new Date(task.due_date).toDateString() === today;
  }).length || 5; // Default for demo
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 89;

  const stats = [
    {
      label: 'Total Tasks',
      value: loading ? '...' : totalTasks,
      icon: CheckSquare,
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-500/10 to-purple-600/10',
    },
    {
      label: 'Due Today',
      value: loading ? '...' : dueTodayTasks,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 to-orange-600/10',
    },
    {
      label: 'Completed',
      value: loading ? '...' : `${completionRate}%`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-500/10 to-green-600/10',
    },
  ];

  // Demo tasks if no tasks loaded
  const demoTasks = [
    { id: '1', title: 'Review project proposal', completed: true, priority: 'high', due_date: new Date().toISOString() },
    { id: '2', title: 'Update documentation', completed: false, priority: 'medium', due_date: new Date().toISOString() },
    { id: '3', title: 'Team standup meeting', completed: false, priority: 'high', due_date: new Date().toISOString() },
    { id: '4', title: 'Code review for feature branch', completed: true, priority: 'medium', due_date: null },
    { id: '5', title: 'Prepare presentation slides', completed: false, priority: 'low', due_date: new Date(Date.now() + 86400000).toISOString() },
  ];

  const displayTasks = tasks.length > 0 ? tasks.slice(0, 5) : demoTasks;

  return (
    <AuthGuard>
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          {/* Header with Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getGreeting()}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your tasks today.
            </p>
          </motion.div>

          {/* Stats Cards - Glass Morphism with Gradient Borders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative group"
              >
                {/* Gradient border effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`} />

                {/* Glass card */}
                <div className="relative glass-card rounded-2xl p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}>
                      <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.gradient} bg-clip-text`} style={{ color: stat.gradient.includes('violet') ? '#8b5cf6' : stat.gradient.includes('amber') ? '#f59e0b' : '#10b981' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            <Link href="/tasks" className="group">
              <div className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-purple-600 to-blue-600 text-white transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Create New Task</h3>
                    <p className="text-sm text-purple-100">Add tasks with priorities</p>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/tasks" className="group">
              <div className="relative overflow-hidden rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">View All Tasks</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your tasks</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            <Link href="/agent" className="group">
              <div className="relative overflow-hidden rounded-xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1">
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Sparkles className="w-3 h-3" /> AI
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get AI suggestions</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Recent Tasks - Glass Morphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 rounded-2xl opacity-20 blur" />

            <div className="relative glass-card rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
                </div>
                <Link href="/tasks" className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Loading tasks...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {displayTasks.map((task: any, index: number) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group"
                    >
                      {/* Checkbox */}
                      <button className={`relative flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-transparent'
                          : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                      }`}>
                        {task.completed && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          task.completed
                            ? 'text-gray-400 dark:text-gray-500 line-through'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </p>
                        {task.due_date && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {/* Priority Badge */}
                      {task.priority && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {task.priority}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
