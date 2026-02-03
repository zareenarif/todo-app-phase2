# Quickstart Guide: Modern Todo UI Components

**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06
**Purpose**: Quick reference for using UI components

---

## Installation & Setup

All components are located in `frontend/components/` and use Tailwind CSS for styling. No additional dependencies required beyond what's already installed (Next.js, React, Tailwind CSS).

---

## Button Component

**Location**: `components/common/Button.tsx`

### Basic Usage

```tsx
import Button from '@/components/common/Button';

export default function MyComponent() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <Button onClick={handleClick}>
      Click Me
    </Button>
  );
}
```

### All Variants

```tsx
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="ghost">Ghost Button</Button>
```

### All Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (Default)</Button>
<Button size="lg">Large</Button>
```

### Form Submit Button

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" variant="primary" fullWidth>
    Submit Form
  </Button>
</form>
```

### Loading State

```tsx
const [loading, setLoading] = useState(false);

<Button
  variant="primary"
  loading={loading}
  onClick={async () => {
    setLoading(true);
    await saveTask();
    setLoading(false);
  }}
>
  Save Task
</Button>
```

### Disabled State

```tsx
<Button
  variant="primary"
  disabled={!isValid}
>
  Submit
</Button>
```

### Icon Button

```tsx
<Button
  variant="ghost"
  size="sm"
  ariaLabel="Edit task"
>
  ✏️
</Button>
```

### Custom Styling

```tsx
<Button
  variant="primary"
  className="mt-4 shadow-2xl"
>
  Custom Margin & Shadow
</Button>
```

---

## Input Component

**Location**: `components/common/Input.tsx`

### Basic Text Input

```tsx
import Input from '@/components/common/Input';

export default function MyForm() {
  const [title, setTitle] = useState('');

  return (
    <Input
      id="title"
      name="title"
      label="Task Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      placeholder="Enter task title"
    />
  );
}
```

### Email Input

```tsx
<Input
  id="email"
  name="email"
  type="email"
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  autoComplete="email"
  placeholder="you@example.com"
/>
```

### Password Input

```tsx
<Input
  id="password"
  name="password"
  type="password"
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  autoComplete="new-password"
  helperText="Must be at least 8 characters long"
/>
```

### Input with Error

```tsx
const [username, setUsername] = useState('');
const [error, setError] = useState('');

const validate = () => {
  if (!username.trim()) {
    setError('Username is required');
    return false;
  }
  if (username.length < 3) {
    setError('Username must be at least 3 characters');
    return false;
  }
  setError('');
  return true;
};

<Input
  id="username"
  name="username"
  label="Username"
  value={username}
  onChange={(e) => {
    setUsername(e.target.value);
    if (error) validate(); // Re-validate on change
  }}
  onBlur={validate}  // Validate on blur
  required
  error={error}
  maxLength={50}
/>
```

### Input with Character Counter

```tsx
<Input
  id="title"
  name="title"
  label="Task Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  maxLength={200}
  helperText="Keep it short and descriptive"
/>
// Automatically shows: "45/200 characters"
```

### Date Input

```tsx
<Input
  id="due-date"
  name="due-date"
  type="date"
  label="Due Date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
/>
```

### Disabled Input

```tsx
<Input
  id="created-at"
  name="created-at"
  label="Created At"
  value={createdAt}
  onChange={() => {}}
  disabled
/>
```

---

## Textarea Component

**Location**: `components/common/Input.tsx` (same file as Input)

### Basic Textarea

```tsx
import Textarea from '@/components/common/Textarea';

export default function MyForm() {
  const [description, setDescription] = useState('');

  return (
    <Textarea
      id="description"
      name="description"
      label="Description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={4}
      placeholder="Enter task description..."
    />
  );
}
```

### Textarea with Character Counter

```tsx
<Textarea
  id="description"
  name="description"
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={6}
  maxLength={2000}
  helperText="Provide details about the task"
/>
// Automatically shows: "145/2000 characters"
```

### Textarea with Error

```tsx
<Textarea
  id="notes"
  name="notes"
  label="Notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  error={notesError}
  rows={4}
/>
```

---

## Complete Form Example

```tsx
'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';

export default function CreateTaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { title: '', description: '' };

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less';
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // API call here
      await createTask({ title, description, due_date: dueDate });

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        name="title"
        type="text"
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        error={errors.title}
        maxLength={200}
        placeholder="Enter task title"
      />

      <Textarea
        id="description"
        name="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
        rows={4}
        maxLength={2000}
        placeholder="Describe the task..."
      />

      <Input
        id="due-date"
        name="due-date"
        type="date"
        label="Due Date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
        >
          Create Task
        </Button>
      </div>
    </form>
  );
}
```

---

## TaskCard Component

**Location**: `components/tasks/TaskCard.tsx`

### Basic Usage

```tsx
import TaskCard from '@/components/tasks/TaskCard';
import { Task } from '@/lib/types';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const refetchTasks = () => {
    // Refetch tasks from API
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onTaskUpdated={refetchTasks}
        />
      ))}
    </div>
  );
}
```

### Task Data Structure

```typescript
interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'high' | 'medium' | 'low' | null;
  tags: string[] | null;
  due_date: string | null;  // ISO date string "2026-01-15"
  recurrence: 'daily' | 'weekly' | 'monthly' | null;
  created_at: string;       // ISO datetime string
  updated_at: string;       // ISO datetime string
}
```

### Example Task Object

```typescript
const exampleTask: Task = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  user_id: '987fcdeb-51a2-43f7-9012-345678901234',
  title: 'Complete project documentation',
  description: 'Write comprehensive docs for the new API endpoints',
  completed: false,
  priority: 'high',
  tags: ['work', 'documentation'],
  due_date: '2026-01-20',
  recurrence: null,
  created_at: '2026-01-06T10:30:00Z',
  updated_at: '2026-01-06T10:30:00Z',
};
```

### Inline Editing

TaskCard automatically handles inline editing when the Edit button is clicked. It displays the TaskForm component inline.

### Completion Toggle

TaskCard has a custom checkbox that toggles task completion:

```tsx
// Click checkbox → calls toggleTaskCompletion API → calls onTaskUpdated callback
<TaskCard task={task} onTaskUpdated={refetchTasks} />
```

### Delete Confirmation

TaskCard shows a confirmation modal when Delete is clicked:

```tsx
// Click Delete → shows modal → confirms → deletes task → calls onTaskUpdated
<TaskCard task={task} onTaskUpdated={refetchTasks} />
```

---

## TaskForm Component

**Location**: `components/tasks/TaskForm.tsx`

### Create Mode

```tsx
import TaskForm from '@/components/tasks/TaskForm';

export default function CreateTaskPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
      <TaskForm
        mode="create"
        onSuccess={(task) => {
          console.log('Task created:', task);
          router.push('/tasks');
        }}
      />
    </div>
  );
}
```

### Edit Mode (with Initial Values)

```tsx
import TaskForm from '@/components/tasks/TaskForm';

export default function EditTaskPage({ task }: { task: Task }) {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
      <TaskForm
        mode="edit"
        taskId={task.id}
        initialValues={{
          title: task.title,
          description: task.description || undefined,
          priority: task.priority || undefined,
          tags: task.tags || undefined,
          due_date: task.due_date || undefined,
          recurrence: task.recurrence || undefined,
        }}
        onSuccess={() => {
          router.push('/tasks');
        }}
        onCancel={() => {
          router.back();
        }}
      />
    </div>
  );
}
```

### Modal Usage

```tsx
'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';
import TaskForm from '@/components/tasks/TaskForm';

export default function TaskListPage() {
  const [showModal, setShowModal] = useState(false);

  const refetchTasks = () => {
    // Refetch tasks
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>
        ➕ New Task
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 m-4 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <TaskForm
              mode="create"
              onSuccess={() => {
                setShowModal(false);
                refetchTasks();
              }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Layout Components

### Page Container

```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Page Title</h1>
        {/* Content */}
      </div>
    </div>
  );
}
```

### Responsive Grid

```tsx
// 1 column → 2 columns → 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card key={item.id} />
  ))}
</div>
```

### Card Container

```tsx
<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
  {/* Card content */}
</div>
```

---

## Common Patterns

### Loading State

```tsx
const [loading, setLoading] = useState(false);

{loading ? (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
) : (
  <div>{/* Content */}</div>
)}
```

### Empty State

```tsx
{items.length === 0 && (
  <div className="bg-white rounded-2xl shadow-md p-12 text-center">
    <div className="text-6xl mb-4">📝</div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
    <p className="text-gray-600 mb-6">Get started by creating your first item</p>
    <Button variant="primary" onClick={handleCreate}>
      Create Item
    </Button>
  </div>
)}
```

### Error Alert

```tsx
{error && (
  <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 mb-4">
    <div className="flex items-center gap-3">
      <span className="text-2xl">⚠️</span>
      <p className="text-sm text-red-800 font-medium">{error}</p>
    </div>
  </div>
)}
```

### Success Toast

```tsx
import Toast from '@/components/common/Toast';

const [showToast, setShowToast] = useState(false);

{showToast && (
  <Toast
    message="Task created successfully!"
    type="success"
    onClose={() => setShowToast(false)}
  />
)}
```

---

## Styling Reference

### Color Classes

```tsx
// Primary
bg-indigo-600 text-white
bg-gradient-to-r from-indigo-600 to-purple-600

// Success
bg-green-500 text-white
text-green-600

// Error
bg-red-500 text-white
text-red-600

// Neutral
bg-gray-50
bg-gray-100
text-gray-900
text-gray-600
```

### Typography Classes

```tsx
// Headings
text-4xl font-extrabold text-gray-900  // H1
text-3xl font-bold text-gray-900       // H2
text-2xl font-semibold text-gray-800   // H3

// Body
text-base text-gray-700   // Default
text-sm text-gray-600     // Small
text-xs text-gray-500     // Caption
```

### Spacing Classes

```tsx
// Padding
p-6   // Card padding (24px)
p-8   // Section padding (32px)

// Margin
mb-8  // Section margin (32px)
mb-6  // Card margin (24px)

// Gap
space-y-4  // Form field gap (16px)
gap-6      // Grid gap (24px)
gap-3      // Inline gap (12px)
```

### Border & Shadow Classes

```tsx
// Borders
rounded-2xl border border-gray-100      // Card
rounded-xl                              // Button
rounded-lg                              // Input

// Shadows
shadow-md                               // Default
shadow-xl                               // Hover
shadow-2xl                              // Modal
```

### Animation Classes

```tsx
// Transitions
transition-all duration-300
hover:scale-105 hover:shadow-lg

// Entrance animations
animate-fade-in-up
animate-scale-in
animate-bounce-in

// Motion safe
motion-reduce:animate-none
```

---

## Tips & Best Practices

### Always Use Labels

```tsx
// ✅ Good
<Input id="email" name="email" label="Email" />

// ❌ Bad
<input id="email" /> {/* No label */}
```

### Validate Before Submit

```tsx
// ✅ Good
const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;
  submitForm();
};

// ❌ Bad
const handleSubmit = (e) => {
  e.preventDefault();
  submitForm(); // No validation
};
```

### Handle Loading States

```tsx
// ✅ Good
<Button loading={isSubmitting}>Submit</Button>

// ❌ Bad
<button onClick={submit}>Submit</button> {/* No loading feedback */}
```

### Provide Feedback

```tsx
// ✅ Good
try {
  await saveTask();
  showSuccessToast('Task saved!');
} catch (error) {
  showErrorAlert(error.message);
}

// ❌ Bad
await saveTask(); // Silent success/failure
```

### Use Semantic HTML

```tsx
// ✅ Good
<Button type="submit">Submit</Button>

// ❌ Bad
<div onClick={submit}>Submit</div>
```

---

## Troubleshooting

### Component Not Importing

```tsx
// ✅ Correct import paths
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';

// ❌ Wrong
import { Button } from '@/components/common/Button'; // No named export
```

### Styles Not Applying

Ensure Tailwind is configured to scan your component files:

```js
// tailwind.config.ts
content: [
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

### TypeScript Errors

Make sure types are imported:

```tsx
import { Task, TaskCreate, PriorityEnum } from '@/lib/types';
```

---

## Additional Resources

- **Component Contracts**: See `contracts/` for detailed interface documentation
- **Design System**: See `design-system.md` for visual styling reference
- **Layouts**: See `layouts.md` for page layout examples
- **Research**: See `research.md` for accessibility and responsive design patterns

---

## Quick Command Reference

```bash
# Start development server
cd frontend
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

---

**Last Updated**: 2026-01-06
**Feature**: 005-todo-ui-screens
