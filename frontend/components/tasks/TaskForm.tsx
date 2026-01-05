/**
 * TaskForm component - form for creating and editing tasks.
 * Supports both create and edit modes with validation.
 */

'use client';

import { useState } from 'react';
import { TaskCreate, PriorityEnum, RecurrenceEnum, Task } from '@/lib/types';
import { createTask, updateTask } from '@/lib/api';
import Toast from '../common/Toast';

interface TaskFormProps {
  onSuccess?: (task: Task) => void;
  onCancel?: () => void;
  initialValues?: Partial<TaskCreate>;
  mode?: 'create' | 'edit';
  taskId?: string; // Required when mode is 'edit'
}

export default function TaskForm({
  onSuccess,
  onCancel,
  initialValues,
  mode = 'create',
  taskId,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState<PriorityEnum | ''>(initialValues?.priority || '');
  const [tags, setTags] = useState(initialValues?.tags?.join(', ') || '');
  const [dueDate, setDueDate] = useState(initialValues?.due_date || '');
  const [recurrence, setRecurrence] = useState<RecurrenceEnum | ''>(initialValues?.recurrence || '');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    if (description.length > 2000) {
      setError('Description must be 2000 characters or less');
      return;
    }

    setLoading(true);

    try {
      // Parse tags from comma-separated string
      const tagArray = tags
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      // Build task data
      const taskData: TaskCreate = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority || undefined,
        tags: tagArray.length > 0 ? tagArray : undefined,
        due_date: dueDate || undefined,
        recurrence: recurrence || undefined,
      };

      // Create or update task based on mode
      let resultTask: Task;
      if (mode === 'edit' && taskId) {
        resultTask = await updateTask(taskId, taskData);
      } else {
        resultTask = await createTask(taskData);
      }

      // Show success toast
      setShowSuccessToast(true);

      // Success callback
      if (onSuccess) {
        onSuccess(resultTask);
      }

      // Reset form if creating
      if (mode === 'create') {
        setTitle('');
        setDescription('');
        setPriority('');
        setTags('');
        setDueDate('');
        setRecurrence('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${mode === 'edit' ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter task title"
        />
        <p className="mt-1 text-xs text-gray-500">{title.length}/200 characters</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          placeholder="Enter task description (optional)"
        />
        <p className="mt-1 text-xs text-gray-500">{description.length}/2000 characters</p>
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as PriorityEnum | '')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">None</option>
          <option value={PriorityEnum.HIGH}>High</option>
          <option value={PriorityEnum.MEDIUM}>Medium</option>
          <option value={PriorityEnum.LOW}>Low</option>
        </select>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="work, urgent, personal (comma-separated)"
        />
        <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Recurrence */}
      <div>
        <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
          Recurrence
        </label>
        <select
          id="recurrence"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as RecurrenceEnum | '')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">None</option>
          <option value={RecurrenceEnum.DAILY}>Daily</option>
          <option value={RecurrenceEnum.WEEKLY}>Weekly</option>
          <option value={RecurrenceEnum.MONTHLY}>Monthly</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Task' : 'Save Changes')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <Toast
          message={mode === 'edit' ? 'Task updated successfully!' : 'Task created successfully!'}
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </form>
  );
}
