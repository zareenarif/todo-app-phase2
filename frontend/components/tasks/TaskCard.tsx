/**
 * TaskCard component - displays a single task with all its details.
 * Supports view mode and edit mode with inline editing.
 */

'use client';

import { useState } from 'react';
import { Task, PriorityEnum, TaskUpdate } from '@/lib/types';
import { updateTask, deleteTask, toggleTaskCompletion } from '@/lib/api';
import TaskForm from './TaskForm';
import Toast from '../common/Toast';

interface TaskCardProps {
  task: Task;
  onTaskUpdated?: () => void;
}

export default function TaskCard({ task, onTaskUpdated }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingCompletion, setIsTogglingCompletion] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Priority badge colors
  const priorityColors = {
    [PriorityEnum.HIGH]: 'bg-red-100 text-red-800',
    [PriorityEnum.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [PriorityEnum.LOW]: 'bg-green-100 text-green-800',
  };

  // Format due date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if task is overdue
  const isOverdue = task.due_date && !task.completed && new Date(task.due_date) < new Date();

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleToggleCompletion = async () => {
    if (isTogglingCompletion) return; // Prevent double-click

    setIsTogglingCompletion(true);
    try {
      await toggleTaskCompletion(task.id);
      setSuccessMessage(task.completed ? 'Task marked as incomplete' : 'Task completed!');
      setShowSuccessToast(true);
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsTogglingCompletion(false);
    }
  };

  // If editing, show the task form
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Task</h3>
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description || undefined,
            priority: task.priority || undefined,
            tags: task.tags,
            due_date: task.due_date || undefined,
            recurrence: task.recurrence || undefined,
          }}
          mode="edit"
          taskId={task.id}
          onSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // View mode
  return (
    <div className={`group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden animate-fade-in-up ${
      task.completed ? 'opacity-75' : ''
    }`}>
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        task.completed
          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
          : isOverdue
          ? 'bg-gradient-to-r from-red-400 to-pink-500'
          : 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'
      }`} />

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 rounded-2xl" />
      <div className="relative flex items-start gap-4">
        {/* Completion status checkbox - Premium style */}
        <div className="flex-shrink-0 pt-1">
          <label className="relative inline-flex items-center cursor-pointer group/checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              disabled={isTogglingCompletion}
              className="sr-only peer"
            />
            <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
              task.completed
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 scale-110'
                : 'bg-white border-gray-300 group-hover/checkbox:border-indigo-400 group-hover/checkbox:scale-110'
            } ${isTogglingCompletion ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {task.completed && (
                <svg className="w-4 h-4 text-white animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
        </div>

        {/* Task content */}
        <div className="flex-grow min-w-0">
          {/* Title */}
          <h3 className={`text-lg font-bold transition-all ${
            task.completed ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-indigo-600'
          }`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className={`mt-2 text-sm leading-relaxed ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}

          {/* Metadata: Priority, Tags, Due Date */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            {/* Priority badge */}
            {task.priority && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                task.priority === PriorityEnum.HIGH
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  : task.priority === PriorityEnum.MEDIUM
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                  : 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
              }`}>
                {task.priority === PriorityEnum.HIGH && '🔴'}
                {task.priority === PriorityEnum.MEDIUM && '🟡'}
                {task.priority === PriorityEnum.LOW && '🟢'}
                {task.priority.toUpperCase()}
              </span>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200"
              >
                🏷️ {tag}
              </span>
            ))}

            {/* Due date */}
            {task.due_date && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
                isOverdue
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : task.completed
                  ? 'bg-gray-50 text-gray-400 border border-gray-200'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
              }`}>
                📅 {formatDate(task.due_date)}
                {isOverdue && <span className="text-red-700 font-bold">⚠️</span>}
              </span>
            )}

            {/* Recurrence indicator */}
            {task.recurrence && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-600 border border-purple-200">
                🔄 {task.recurrence}
              </span>
            )}
          </div>

          {/* Timestamps */}
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
            <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action buttons - Premium style */}
        <div className="flex-shrink-0 flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="group/btn relative px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all duration-200 border border-indigo-200 hover:shadow-lg hover:scale-105"
          >
            <span className="flex items-center gap-2">
              ✏️
              <span className="hidden sm:inline">Edit</span>
            </span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="group/btn relative px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 border border-red-200 hover:shadow-lg hover:scale-105"
          >
            <span className="flex items-center gap-2">
              🗑️
              <span className="hidden sm:inline">Delete</span>
            </span>
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 m-4 transform scale-100 animate-fade-in">
            <div className="text-center mb-4">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Delete Task?
              </h3>
              <p className="text-gray-600 text-lg">
                Are you sure you want to delete <strong>"{task.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
}
