# TaskCard Component Contract

**Component**: `components/tasks/TaskCard.tsx` (REDESIGN)
**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06

---

## Purpose

Display a single task with all its details (title, description, priority, tags, due date, recurrence, completion status) in a visually appealing card format. Supports inline editing, deletion with confirmation, and completion toggling.

**Note**: This component already exists at `frontend/components/tasks/TaskCard.tsx`. This contract defines the updated design while maintaining existing functionality.

---

## TypeScript Interface

```typescript
interface TaskCardProps {
  /** Task data from API */
  task: Task;

  /** Callback when task is updated/deleted/toggled (triggers refetch) */
  onTaskUpdated?: () => void;

  /** Visual variant (future enhancement, not required for MVP) */
  variant?: 'default' | 'compact';
}

// Task type (existing, from lib/types.ts)
interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'high' | 'medium' | 'low' | null;
  tags: string[] | null;
  due_date: string | null;  // ISO date string
  recurrence: 'daily' | 'weekly' | 'monthly' | null;
  created_at: string;       // ISO datetime string
  updated_at: string;       // ISO datetime string
}
```

---

## Visual Structure

### Card Container

```tsx
<div className="
  group relative
  bg-white rounded-2xl
  shadow-md hover:shadow-xl
  transition-shadow duration-300
  p-6
  border border-gray-100
  overflow-hidden
  animate-fade-in-up motion-reduce:animate-none
">
  {/* Content */}
</div>
```

**Features**:
- Rounded corners: `rounded-2xl` (16px)
- Shadow elevation: `shadow-md` default, `shadow-xl` on hover
- Smooth transition: 300ms
- Entrance animation: fade-in from bottom
- Responsive padding: `p-6` (24px)

### Gradient Accent Bar (Top)

```tsx
<div className={`absolute top-0 left-0 right-0 h-1 ${
  task.completed
    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
    : isOverdue
    ? 'bg-gradient-to-r from-red-400 to-pink-500'
    : 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500'
}`} />
```

**States**:
- **Default**: Indigo/purple/pink gradient (active task)
- **Completed**: Green gradient (success state)
- **Overdue**: Red/pink gradient (urgent attention)

### Layout (Flexbox)

```tsx
<div className="flex items-start gap-4">
  {/* Left: Checkbox */}
  <div className="flex-shrink-0 pt-1">
    {/* Custom checkbox */}
  </div>

  {/* Middle: Task content */}
  <div className="flex-grow min-w-0">
    {/* Title, description, metadata */}
  </div>

  {/* Right: Action buttons */}
  <div className="flex-shrink-0 flex gap-2">
    {/* Edit, Delete buttons */}
  </div>
</div>
```

---

## Component Sections

### 1. Completion Checkbox (Custom Styled)

```tsx
<label className="relative inline-flex items-center cursor-pointer group/checkbox">
  <input
    type="checkbox"
    checked={task.completed}
    onChange={handleToggleCompletion}
    disabled={isTogglingCompletion}
    className="sr-only peer"
  />
  <div className={`
    w-6 h-6 rounded-lg border-2
    transition-all duration-200
    flex items-center justify-center
    ${task.completed
      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 scale-110'
      : 'bg-white border-gray-300 group-hover/checkbox:border-indigo-400 group-hover/checkbox:scale-110'
    }
  `}>
    {task.completed && (
      <svg className="w-4 h-4 text-white animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    )}
  </div>
</label>
```

**Features**:
- Custom styled (hidden native checkbox)
- Gradient background when completed
- Scale animation on check/uncheck
- Hover effect (border color change, scale)
- Loading state (disabled during API call)

### 2. Task Title

```tsx
<h3 className={`text-lg font-bold transition-all ${
  task.completed
    ? 'text-gray-400 line-through'
    : 'text-gray-900 group-hover:text-indigo-600'
}`}>
  {task.title}
</h3>
```

**States**:
- **Default**: Bold, black text
- **Completed**: Gray, line-through
- **Hover**: Indigo color (when not completed)

### 3. Task Description (Optional)

```tsx
{task.description && (
  <p className={`mt-2 text-sm leading-relaxed ${
    task.completed ? 'text-gray-400' : 'text-gray-600'
  }`}>
    {task.description}
  </p>
)}
```

**Behavior**:
- Only shown if description exists
- Faded when task completed
- Wraps properly for long text

### 4. Metadata Badges

```tsx
<div className="mt-4 flex flex-wrap gap-2 items-center">
  {/* Priority badge */}
  {task.priority && (
    <span className={`
      inline-flex items-center gap-1
      px-3 py-1 rounded-lg
      text-xs font-bold shadow-sm
      ${priorityStyles[task.priority]}
    `}>
      {priorityIcons[task.priority]}
      {task.priority.toUpperCase()}
    </span>
  )}

  {/* Tags */}
  {task.tags?.map((tag, index) => (
    <span key={index} className="
      inline-flex items-center
      px-3 py-1 rounded-lg
      text-xs font-semibold
      bg-gradient-to-r from-indigo-100 to-purple-100
      text-indigo-700 border border-indigo-200
    ">
      🏷️ {tag}
    </span>
  ))}

  {/* Due date */}
  {task.due_date && (
    <span className={`
      inline-flex items-center gap-1
      px-3 py-1 rounded-lg
      text-xs font-semibold
      ${dueDateStyles}
    `}>
      📅 {formatDate(task.due_date)}
      {isOverdue && <span className="text-red-700 font-bold">⚠️</span>}
    </span>
  )}

  {/* Recurrence */}
  {task.recurrence && (
    <span className="
      inline-flex items-center gap-1
      px-3 py-1 rounded-lg
      text-xs font-semibold
      bg-purple-50 text-purple-600 border border-purple-200
    ">
      🔄 {task.recurrence}
    </span>
  )}
</div>
```

**Badge Styles**:

Priority:
- **High**: Red/pink gradient, white text
- **Medium**: Yellow/orange gradient, white text
- **Low**: Green/emerald gradient, white text

Tags:
- Indigo/purple gradient background
- Border with matching color

Due Date:
- **Default**: Blue background
- **Overdue**: Red background with warning icon
- **Completed**: Gray (faded)

Recurrence:
- Purple background, recurring icon

### 5. Action Buttons

```tsx
<div className="flex-shrink-0 flex gap-2">
  {/* Edit button */}
  <button
    onClick={() => setIsEditing(true)}
    className="
      group/btn relative
      px-4 py-2 text-sm font-bold
      text-indigo-600 bg-indigo-50
      hover:bg-indigo-600 hover:text-white
      rounded-xl
      transition-all duration-200
      border border-indigo-200
      hover:shadow-lg hover:scale-105
    "
  >
    <span className="flex items-center gap-2">
      ✏️
      <span className="hidden sm:inline">Edit</span>
    </span>
  </button>

  {/* Delete button */}
  <button
    onClick={() => setShowDeleteConfirm(true)}
    className="
      group/btn relative
      px-4 py-2 text-sm font-bold
      text-red-600 bg-red-50
      hover:bg-red-600 hover:text-white
      rounded-xl
      transition-all duration-200
      border border-red-200
      hover:shadow-lg hover:scale-105
    "
  >
    <span className="flex items-center gap-2">
      🗑️
      <span className="hidden sm:inline">Delete</span>
    </span>
  </button>
</div>
```

**Features**:
- Icon + text on desktop
- Icon only on mobile (`hidden sm:inline`)
- Hover effects: background change, scale, shadow
- Premium styling: rounded-xl, gradients, transitions

---

## Edit Mode (Inline)

When `isEditing` is true, replace card content with TaskForm:

```tsx
{isEditing && (
  <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Task</h3>
    <TaskForm
      initialValues={{
        title: task.title,
        description: task.description || undefined,
        priority: task.priority || undefined,
        tags: task.tags || undefined,
        due_date: task.due_date || undefined,
        recurrence: task.recurrence || undefined,
      }}
      mode="edit"
      taskId={task.id}
      onSuccess={handleUpdateSuccess}
      onCancel={() => setIsEditing(false)}
    />
  </div>
)}
```

---

## Delete Confirmation Modal

```tsx
{showDeleteConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 m-4 transform scale-100 animate-fade-in">
      <div className="text-center mb-4">
        <div className="text-6xl mb-4">🗑️</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Delete Task?
        </h3>
        <p className="text-gray-600 text-lg">
          Are you sure you want to delete <strong>"{task.title}"</strong>?
          This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
        <button
          onClick={() => setShowDeleteConfirm(false)}
          disabled={isDeleting}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
```

**Features**:
- Full-screen overlay with backdrop blur
- Centered modal with scale-in animation
- Large emoji icon for visual clarity
- Task title displayed for confirmation
- Loading state during deletion
- Escape key closes modal (add keyboard listener)

---

## Helper Functions

### Date Formatting

```typescript
const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
// Example: "Jan 15, 2026"
```

### Overdue Check

```typescript
const isOverdue = task.due_date &&
  !task.completed &&
  new Date(task.due_date) < new Date();
```

---

## Responsive Behavior

### Mobile (< 640px)
- Action buttons show icon only
- Metadata badges wrap to multiple lines
- Checkbox and buttons remain 44px+ (touch-friendly)

### Tablet (640px - 1024px)
- Action buttons show icon + text
- Metadata badges flow in single or double row

### Desktop (1024px+)
- Full layout with all text visible
- Hover effects more prominent

---

## Accessibility Features

### Keyboard Navigation
- Tab to checkbox, edit button, delete button
- Enter/Space to toggle checkbox
- Enter to activate buttons
- Escape to close delete modal

### Screen Readers
- Checkbox announces task title and completion status
- Buttons have clear labels (Edit, Delete)
- Modal has focus trap (add with React focus-trap)

### Color Contrast
- All text meets WCAG 2.1 AA (4.5:1 minimum)
- Icon-only buttons on mobile have aria-labels

---

## Acceptance Criteria

Before marking complete, verify:

- ✅ Card has rounded corners (rounded-2xl) and elevation shadow
- ✅ Gradient accent bar at top changes based on state
- ✅ Checkbox toggles completion with gradient animation
- ✅ Title shows line-through when completed
- ✅ Description displays when present
- ✅ Priority badge shows with gradient background and emoji
- ✅ Tags display with indigo/purple styling
- ✅ Due date shows with calendar emoji, overdue warning if applicable
- ✅ Recurrence badge displays when present
- ✅ Edit button opens inline form
- ✅ Delete button shows confirmation modal
- ✅ Delete modal has backdrop blur and scale-in animation
- ✅ Action buttons show icon only on mobile, icon+text on desktop
- ✅ All interactive elements are minimum 44x44px
- ✅ Hover effects work on card, checkbox, buttons
- ✅ Loading states prevent double-clicks during API calls
- ✅ Success toast shows after completion toggle (existing feature)

---

## Existing Code Reference

**Current Implementation**: `frontend/components/tasks/TaskCard.tsx` (lines 1-294)

Key sections to preserve:
- State management (lines 20-26)
- Priority colors (lines 28-32)
- Date formatting (lines 35-43)
- Overdue logic (line 46)
- Handler functions (lines 48-87)
- TaskForm integration (lines 90-110)
- Delete modal (lines 251-281)
- Success toast (lines 284-290)

---

## Related Components

- **TaskForm**: Used for inline editing
- **TaskList**: Parent component that renders multiple TaskCards
- **Toast**: Success/error notifications

---

## Design System Reference

- **Colors**: See `design-system.md` > Color Palette > Semantic Colors
- **Gradients**: See `design-system.md` > Gradient Patterns
- **Shadows**: See `design-system.md` > Shadows
- **Animations**: See `design-system.md` > Animation & Transitions
- **Spacing**: See `design-system.md` > Spacing System
