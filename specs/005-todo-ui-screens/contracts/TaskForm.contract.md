# TaskForm Component Contract

**Component**: `components/tasks/TaskForm.tsx` (REDESIGN)
**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06

---

## Purpose

Form for creating new tasks or editing existing tasks. Supports all task fields (title, description, priority, tags, due date, recurrence) with validation and error handling. Uses new reusable Input components for consistent styling.

**Note**: This component already exists at `frontend/components/tasks/TaskForm.tsx`. This contract defines the updated design using new Input/Textarea/Button components while maintaining existing functionality.

---

## TypeScript Interface

```typescript
interface TaskFormProps {
  /** Success callback (triggered after successful create/update) */
  onSuccess?: (task: Task) => void;

  /** Cancel callback (close form without saving) */
  onCancel?: () => void;

  /** Initial values for form fields (edit mode) */
  initialValues?: Partial<TaskCreate>;

  /** Form mode (create or edit) */
  mode?: 'create' | 'edit';

  /** Task ID (required when mode is 'edit') */
  taskId?: string;
}

// TaskCreate type (existing, from lib/types.ts)
interface TaskCreate {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  due_date?: string;  // ISO date string (YYYY-MM-DD)
  recurrence?: 'daily' | 'weekly' | 'monthly';
}

// Task type (existing, from lib/types.ts)
interface Task extends TaskCreate {
  id: string;
  user_id: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}
```

---

## Form Structure

### Container

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  {/* Error alert */}
  {/* Form fields */}
  {/* Form actions */}
</form>
```

**Layout**: Vertical stack with 16px gap (`space-y-4`)

---

## Form Sections

### 1. Error Alert (Conditional)

```tsx
{error && (
  <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 animate-fade-in">
    <div className="flex items-center gap-3">
      <span className="text-2xl">⚠️</span>
      <p className="text-sm text-red-800 font-medium">{error}</p>
    </div>
  </div>
)}
```

**Features**:
- Only shown when validation/API error occurs
- Red background with border
- Fade-in animation
- Warning emoji icon

### 2. Title Input (Required)

```tsx
<Input
  id="title"
  name="title"
  type="text"
  label="Task Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
  maxLength={200}
  placeholder="Enter task title"
  helperText="Clear, concise description of the task"
/>
```

**Validation**:
- Required (cannot be empty)
- Max 200 characters
- Client-side validation before submit

### 3. Description Textarea (Optional)

```tsx
<Textarea
  id="description"
  name="description"
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  maxLength={2000}
  placeholder="Enter task description (optional)"
  helperText="Additional details or context for the task"
/>
```

**Validation**:
- Optional field
- Max 2000 characters
- Character counter displays

### 4. Priority Select (Optional)

```tsx
<div>
  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
    Priority
  </label>
  <select
    id="priority"
    value={priority}
    onChange={(e) => setPriority(e.target.value as PriorityEnum | '')}
    className="
      w-full px-3 py-3
      border-2 border-gray-300
      rounded-lg
      text-base text-gray-900
      bg-white
      min-h-[48px]
      transition-all duration-200
      focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
    "
  >
    <option value="">None</option>
    <option value="high">🔴 High</option>
    <option value="medium">🟡 Medium</option>
    <option value="low">🟢 Low</option>
  </select>
</div>
```

**Features**:
- Dropdown with emoji icons
- Matches Input styling (same border, focus states)
- Optional field (can be "None")

### 5. Tags Input (Optional)

```tsx
<Input
  id="tags"
  name="tags"
  type="text"
  label="Tags"
  value={tags}
  onChange={(e) => setTags(e.target.value)}
  placeholder="work, urgent, personal"
  helperText="Separate tags with commas"
/>
```

**Features**:
- Comma-separated values
- Parsed into array before submission
- Trimmed and filtered (empty tags removed)

**Parsing Logic**:
```typescript
const tagArray = tags
  .split(',')
  .map(tag => tag.trim())
  .filter(tag => tag.length > 0);
```

### 6. Due Date Input (Optional)

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

**Features**:
- Native date picker
- ISO format (YYYY-MM-DD)
- Optional field

### 7. Recurrence Select (Optional)

```tsx
<div>
  <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
    Recurrence
  </label>
  <select
    id="recurrence"
    value={recurrence}
    onChange={(e) => setRecurrence(e.target.value as RecurrenceEnum | '')}
    className="
      w-full px-3 py-3
      border-2 border-gray-300
      rounded-lg
      text-base text-gray-900
      bg-white
      min-h-[48px]
      transition-all duration-200
      focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500
    "
  >
    <option value="">None</option>
    <option value="daily">🔄 Daily</option>
    <option value="weekly">📅 Weekly</option>
    <option value="monthly">📆 Monthly</option>
  </select>
</div>
```

**Features**:
- Dropdown with emoji icons
- Matches Input styling
- Optional field

---

## Form Actions

```tsx
<div className="flex gap-3 pt-4">
  {/* Submit button */}
  <Button
    type="submit"
    variant="primary"
    size="md"
    fullWidth
    loading={loading}
    className="flex-1"
  >
    {mode === 'create' ? 'Create Task' : 'Save Changes'}
  </Button>

  {/* Cancel button (only when onCancel provided) */}
  {onCancel && (
    <Button
      type="button"
      variant="secondary"
      size="md"
      onClick={onCancel}
      className="flex-1"
    >
      Cancel
    </Button>
  )}
</div>
```

**Features**:
- Primary button for submit (full width or flex-1)
- Secondary button for cancel (only shown when needed)
- Loading state on submit button
- Button text changes based on mode

---

## Validation Logic

### Client-Side Validation (handleSubmit)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  // Title validation
  if (!title.trim()) {
    setError('Title is required');
    return;
  }

  if (title.length > 200) {
    setError('Title must be 200 characters or less');
    return;
  }

  // Description validation
  if (description.length > 2000) {
    setError('Description must be 2000 characters or less');
    return;
  }

  // All validations passed, proceed with API call
  setLoading(true);

  try {
    // Parse tags
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Build task data
    const taskData: TaskCreate = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority: priority || undefined,
      tags: tagArray.length > 0 ? tagArray : undefined,
      due_date: dueDate || undefined,
      recurrence: recurrence || undefined,
    };

    // API call
    let resultTask: Task;
    if (mode === 'edit' && taskId) {
      resultTask = await updateTask(taskId, taskData);
    } else {
      resultTask = await createTask(taskData);
    }

    // Success callback
    if (onSuccess) {
      onSuccess(resultTask);
    }

    // Reset form (create mode only)
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
```

**Validation Rules**:
1. Title required and <= 200 chars
2. Description <= 2000 chars
3. All other fields optional

---

## Success Handling

### Success Toast (Optional)

```tsx
{showSuccessToast && (
  <Toast
    message={mode === 'edit' ? 'Task updated successfully!' : 'Task created successfully!'}
    type="success"
    onClose={() => setShowSuccessToast(false)}
  />
)}
```

**Features**:
- Brief success message
- Auto-dismisses after 3 seconds
- Can be closed manually

### Callback Execution

```typescript
if (onSuccess) {
  onSuccess(resultTask);
}
```

**Behavior**:
- Passes created/updated task to parent
- Parent typically triggers refetch or navigation
- Form may close (in inline edit mode)

---

## Usage Examples

### Create Mode (Standalone)

```tsx
<TaskForm
  mode="create"
  onSuccess={(task) => {
    console.log('Task created:', task);
    router.push('/tasks');
  }}
/>
```

### Edit Mode (Inline in TaskCard)

```tsx
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
    setIsEditing(false);
    refetchTasks();
  }}
  onCancel={() => setIsEditing(false)}
/>
```

### Create Mode (Modal)

```tsx
{showCreateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 m-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>
      <TaskForm
        mode="create"
        onSuccess={(task) => {
          setShowCreateModal(false);
          refetchTasks();
        }}
        onCancel={() => setShowCreateModal(false)}
      />
    </div>
  </div>
)}
```

---

## Responsive Behavior

### Mobile (< 640px)
- Form stacks vertically (already default)
- Input fields full width
- Action buttons full width or flex

### Tablet (640px - 1024px)
- Same layout as mobile
- Slightly larger padding

### Desktop (1024px+)
- Same layout (form is vertical by nature)
- May place form in centered container or modal

---

## Accessibility Features

### Form Semantics
- Proper `<form>` element
- `<label>` associated with each input
- Submit button with `type="submit"`

### Keyboard Navigation
- Tab through all form fields
- Enter to submit form
- Escape to cancel (when in modal)

### Error Handling
- Clear error messages displayed above form
- Red border on invalid inputs (future enhancement)
- Focus first invalid field (future enhancement)

### Screen Readers
- Labels announced when focusing inputs
- Required fields indicated with asterisk
- Error messages read aloud

---

## State Management

```typescript
// Form state
const [title, setTitle] = useState(initialValues?.title || '');
const [description, setDescription] = useState(initialValues?.description || '');
const [priority, setPriority] = useState<PriorityEnum | ''>(initialValues?.priority || '');
const [tags, setTags] = useState(initialValues?.tags?.join(', ') || '');
const [dueDate, setDueDate] = useState(initialValues?.due_date || '');
const [recurrence, setRecurrence] = useState<RecurrenceEnum | ''>(initialValues?.recurrence || '');

// UI state
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [showSuccessToast, setShowSuccessToast] = useState(false);
```

---

## Acceptance Criteria

Before marking complete, verify:

- ✅ Uses new Input component for title
- ✅ Uses new Textarea component for description
- ✅ Uses new Button components for submit/cancel
- ✅ Select elements match Input styling (border, focus, height)
- ✅ All form fields have proper labels
- ✅ Required field indicator (asterisk) on title
- ✅ Character counters display on title and description
- ✅ Client-side validation prevents empty title submission
- ✅ Error alert displays with clear message
- ✅ Loading state disables submit button and shows spinner
- ✅ Success toast displays after create/update
- ✅ Create mode resets form after successful submission
- ✅ Edit mode pre-fills all existing values
- ✅ Tags are parsed correctly (comma-separated → array)
- ✅ Cancel button closes form without saving
- ✅ All interactive elements are minimum 44x44px
- ✅ Form works in both standalone and inline contexts

---

## Existing Code Reference

**Current Implementation**: `frontend/components/tasks/TaskForm.tsx` (lines 1-249)

Key sections to preserve:
- State initialization (lines 28-33)
- Validation logic (lines 44-57)
- Tag parsing (lines 63-65)
- Task data building (lines 68-75)
- API calls (lines 78-83)
- Error handling (lines 102-103)
- Success toast (lines 239-245)

Key sections to update:
- Replace native inputs with Input component
- Replace native textarea with Textarea component
- Replace styled buttons with Button component
- Update select element styling to match Input

---

## Related Components

- **Input**: Text input fields (title, tags, due date)
- **Textarea**: Multi-line description field
- **Button**: Submit and cancel buttons
- **TaskCard**: Parent component for inline edit mode
- **Toast**: Success/error notifications

---

## Design System Reference

- **Forms**: See `design-system.md` > Interactive States > Input States
- **Buttons**: See `design-system.md` > Interactive States > Button States
- **Spacing**: See `design-system.md` > Spacing System > Form Field Gap
- **Colors**: See `design-system.md` > Color Palette > Semantic Colors (error states)
