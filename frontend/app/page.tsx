'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import {
  Zap,
  BarChart3,
  Calendar,
  Bot,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Users
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 w-full border-b border-gray-100/50 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-950/80"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center">
                <Logo size="md" />
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative w-full px-4 pt-20 pb-32 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-1.5"
              >
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  AI-Powered Productivity
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
              >
                Organize your work,
                <br />
                <span className="text-gradient-hero">amplify your life</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400"
              >
                TaskFlow combines intelligent task management with AI assistance to help you
                focus on what matters most. Plan smarter, achieve more.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link href="/register" className="btn-primary px-8 py-3 text-base">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="btn-secondary px-8 py-3 text-base">
                  Sign In
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-medium text-white"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span>10,000+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} width={16} height={16} style={{ width: 16, height: 16 }} className="text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="ml-1">4.9/5 rating</span>
                </div>
              </motion.div>
            </div>

            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-950 z-10 pointer-events-none" />
              <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">taskflow.app/dashboard</span>
                  </div>
                </div>
                {/* Dashboard Content */}
                <div className="p-6 grid grid-cols-3 gap-4">
                  {/* Sidebar Preview */}
                  <div className="col-span-1 space-y-3">
                    <div className="h-8 w-24 rounded bg-purple-100 dark:bg-purple-900/30" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-8 rounded-lg ${i === 1 ? 'bg-purple-500/20' : 'bg-gray-100 dark:bg-gray-800'}`} />
                      ))}
                    </div>
                  </div>
                  {/* Main Content Preview */}
                  <div className="col-span-2 space-y-4">
                    <div className="flex gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 h-20 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-3">
                          <div className="h-3 w-12 rounded bg-gray-300 dark:bg-gray-700 mb-2" />
                          <div className="h-6 w-8 rounded bg-gray-400 dark:bg-gray-600" />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex items-center gap-3">
                          <div className="w-5 h-5 rounded border-2 border-purple-400" />
                          <div className="flex-1 h-3 rounded bg-gray-200 dark:bg-gray-700" />
                          <div className="w-16 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-gray-50/80 dark:bg-gray-900/50 px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Everything you need to stay productive
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Powerful features designed to help you manage tasks efficiently and achieve your goals faster.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: 'AI Task Prioritization',
                  description: 'Let AI analyze and prioritize your tasks based on deadlines, importance, and your work patterns.',
                  color: 'from-purple-500 to-violet-500',
                },
                {
                  icon: BarChart3,
                  title: 'Progress Analytics',
                  description: 'Track your productivity with detailed analytics, insights, and beautiful visualizations.',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Calendar,
                  title: 'Smart Scheduling',
                  description: 'Automatically schedule tasks based on your availability and optimal work hours.',
                  color: 'from-green-500 to-emerald-500',
                },
                {
                  icon: Bot,
                  title: 'AI Assistant',
                  description: 'Chat with AI to break down complex tasks, get suggestions, and optimize your workflow.',
                  color: 'from-pink-500 to-rose-500',
                },
                {
                  icon: Shield,
                  title: 'Secure & Private',
                  description: 'Your data is encrypted and secure. We never share your information with third parties.',
                  color: 'from-orange-500 to-amber-500',
                },
                {
                  icon: Users,
                  title: 'Team Collaboration',
                  description: 'Share tasks, assign responsibilities, and collaborate seamlessly with your team.',
                  color: 'from-indigo-500 to-purple-500',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 transition-all hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-800"
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '1M+', label: 'Tasks Completed' },
                { value: '99.9%', label: 'Uptime' },
                { value: '4.9/5', label: 'User Rating' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-blue-600 p-12 text-center overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to boost your productivity?
                </h2>
                <p className="text-purple-100 mb-8 max-w-lg mx-auto">
                  Join thousands of professionals who are already managing their tasks smarter with TaskFlow.
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-gray-100 dark:border-gray-800 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Logo size="sm" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; 2024 TaskFlow. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
