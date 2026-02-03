'use client';

import { AgentMessage as AgentMessageType } from '@/lib/types';

interface AgentMessageProps {
  message: AgentMessageType;
}

export default function AgentMessage({ message }: AgentMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
        }`}
      >
        {/* Role indicator */}
        <div className={`text-xs mb-1 ${isUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
          {isUser ? 'You' : 'AI Assistant'}
        </div>

        {/* Message content */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>

        {/* Timestamp */}
        <div className={`text-xs mt-2 ${isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>

        {/* Status indicator */}
        {message.status === 'pending' && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Processing...</span>
          </div>
        )}
        {message.status === 'error' && (
          <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-xs text-red-400">Failed</span>
          </div>
        )}
      </div>
    </div>
  );
}
