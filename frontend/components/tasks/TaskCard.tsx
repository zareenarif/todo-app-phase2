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
import Button from '../common/Button';

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
    <div className={`group relative rounded-lg border bg-white p-4 dark:bg-gray-900 overflow-hidden ${
      task.completed
        ? 'border-gray-200 dark:border-gray-800 opacity-75'
        : isOverdue
        ? 'border-red-200 dark:border-red-900'
        : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700'
    }`}>
      {/* Accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        task.completed
          ? 'bg-green-500'
          : isOverdue
          ? 'bg-red-500'
          : 'bg-indigo-500'
      }`} />
      <div className="relative flex items-start gap-4">
        {/* Completion status checkbox - Premium style */}
        <div className="flex-shrink-0 pt-1">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              disabled={isTogglingCompletion}
              className="sr-only peer"
            />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-indigo-400'
            } ${isTogglingCompletion ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
          }`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className={`mt-2 text-sm leading-relaxed ${
              task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {task.description}
            </p>
          )}

          {/* Metadata: Priority, Tags, Due Date */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            {/* Priority badge */}
            {task.priority && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                task.priority === PriorityEnum.HIGH
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : task.priority === PriorityEnum.MEDIUM
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {task.priority.toUpperCase()}
              </span>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {tag}
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
          <div className="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
            <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex gap-2">
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            ariaLabel="Edit task"
          >
            ✏️
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
            size="sm"
            ariaLabel="Delete task"
          >
            🗑️
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-sm w-full rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🗑️</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Task?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                loading={isDeleting}
                variant="danger"
                size="md"
                fullWidth
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                variant="secondary"
                size="md"
                fullWidth
              >
                Cancel
              </Button>
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
