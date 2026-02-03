/**
 * TaskForm component - form for creating and editing tasks.
 * Supports both create and edit modes with validation.
 */

'use client';

import { useState } from 'react';
import { TaskCreate, PriorityEnum, RecurrenceEnum, Task } from '@/lib/types';
import { createTask, updateTask } from '@/lib/api';
import Toast from '../common/Toast';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';

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
        <div className="rounded-xl bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 p-4">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium">{error}</p>
        </div>
      )}

      {/* Title */}
      <Input
        id="title"
        name="title"
        type="text"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        required
        placeholder="Enter task title"
      />

      {/* Description */}
      <Textarea
        id="description"
        name="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={2000}
        rows={4}
        placeholder="Enter task description (optional)"
      />

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as PriorityEnum | '')}
          className="w-full px-3 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px] focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200"
        >
          <option value="">Select priority...</option>
          <option value={PriorityEnum.HIGH}>🔴 High</option>
          <option value={PriorityEnum.MEDIUM}>🟡 Medium</option>
          <option value={PriorityEnum.LOW}>🟢 Low</option>
        </select>
      </div>

      {/* Tags */}
      <Input
        id="tags"
        name="tags"
        type="text"
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="work, urgent, personal (comma-separated)"
        helperText="Separate tags with commas"
      />

      {/* Due Date */}
      <Input
        id="dueDate"
        name="dueDate"
        type="date"
        label="Due Date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* Recurrence */}
      <div>
        <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Recurrence
        </label>
        <select
          id="recurrence"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as RecurrenceEnum | '')}
          className="w-full px-3 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[48px] focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200"
        >
          <option value="">No recurrence</option>
          <option value={RecurrenceEnum.DAILY}>🔄 Daily</option>
          <option value={RecurrenceEnum.WEEKLY}>📅 Weekly</option>
          <option value={RecurrenceEnum.MONTHLY}>📆 Monthly</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          {mode === 'create' ? 'Create Task' : 'Save Changes'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onCancel}
          >
            Cancel
          </Button>
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
