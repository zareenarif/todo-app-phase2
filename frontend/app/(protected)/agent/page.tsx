'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AuthGuard from '@/components/auth/AuthGuard';
import AppLayout from '@/components/layout/AppLayout';
import AgentChat from '@/components/agent/AgentChat';
import { checkLLMHealth } from '@/lib/api';
import { LLMHealthCheck } from '@/lib/types';
import { Bot, Zap, ListTree, Lightbulb, Sparkles } from 'lucide-react';

export default function AgentPage() {
  const [health, setHealth] = useState<LLMHealthCheck | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const healthData = await checkLLMHealth();
        setHealth(healthData);
      } catch (error) {
        console.error('Failed to check LLM health:', error);
      } finally {
        setHealthLoading(false);
      }
    };

    fetchHealth();
  }, []);

  const quickActions = [
    {
      icon: Zap,
      title: 'Prioritize Tasks',
      description: 'Get AI recommendations on task priority',
      prompt: 'Can you help me prioritize my tasks?',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: ListTree,
      title: 'Break Down Task',
      description: 'Decompose complex tasks into steps',
      prompt: 'Help me break down this task into smaller steps',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: Lightbulb,
      title: 'Productivity Tips',
      description: 'Get personalized productivity advice',
      prompt: 'What productivity tips do you have for me?',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
  ];

  return (
    <AuthGuard>
      <AppLayout>
        <div className="min-h-screen w-full p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      AI Assistant
                    </h1>
                    <span className="badge badge-purple flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Powered by AI
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Chat with AI to manage and optimize your tasks
                  </p>
                </div>

                {/* Health Status */}
                {healthLoading ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
                    <span className="text-sm text-gray-500">Checking...</span>
                  </div>
                ) : health ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className={`w-2 h-2 rounded-full ${
                      health.primary.status === 'ok' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {health.primary.status === 'ok' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                ) : null}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-3 gap-4 mb-6"
            >
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="group text-left p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                      <action.icon className={`w-5 h-5 bg-gradient-to-br ${action.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="h-[500px]"
            >
              <AgentChat />
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400"
            >
              Powered by Groq with Llama 3 | Ollama fallback available
            </motion.p>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
