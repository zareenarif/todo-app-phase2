'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentMessage as AgentMessageType } from '@/lib/types';
import { chatWithAgent } from '@/lib/api';
import { Bot, User, Send, Loader2 } from 'lucide-react';

export default function AgentChat() {
  const [messages, setMessages] = useState<AgentMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI task assistant. I can help you with:

• **Prioritizing tasks** - Tell me which tasks to focus on first
• **Breaking down tasks** - Decompose complex tasks into smaller steps
• **Task suggestions** - Get recommendations for your todo list
• **General questions** - Ask anything about productivity

How can I help you today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const content = input.trim();
    setInput('');

    // Add user message
    const userMessage: AgentMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add pending assistant message
    const pendingId = `assistant-${Date.now()}`;
    const pendingMessage: AgentMessageType = {
      id: pendingId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setMessages((prev) => [...prev, pendingMessage]);
    setIsLoading(true);

    try {
      const response = await chatWithAgent(content);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId
            ? { ...msg, content: response.message, status: 'completed' }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId
            ? {
                ...msg,
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                status: 'error',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
          <p className="text-xs text-purple-100">Always here to help</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-xs text-purple-100">{isLoading ? 'Thinking...' : 'Online'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-gray-200 dark:bg-gray-700'
                  : 'bg-gradient-to-br from-purple-500 to-blue-500'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-md'
                }`}>
                  {message.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  ) : (
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  )}
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full px-4 py-3 pr-12 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
