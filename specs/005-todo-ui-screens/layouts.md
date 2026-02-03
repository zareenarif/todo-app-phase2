# Screen Layouts: Modern Todo UI

**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06
**Purpose**: Define layout structure for all application screens

---

## Navigation / Global Layout

### Navbar (`components/layout/Navbar.tsx`)

**Location**: Top of every page (sticky)

**Layout**:
```tsx
<nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Left: Logo + App Title */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-2xl">✓</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Todo App
          </span>
        </Link>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-4">
        {/* Navigation links (if logged in) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-2">
            <Link href="/dashboard" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              Dashboard
            </Link>
            <Link href="/tasks" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              Tasks
            </Link>
          </div>
        )}

        {/* User profile menu */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition-transform">
              {userInitial}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  </div>
</nav>
```

**Features**:
- Sticky positioning (stays at top on scroll)
- Glass-morphism effect (backdrop-blur)
- Gradient logo with checkmark icon
- Gradient text for app title
- Navigation links (dashboard, tasks) - desktop only
- User avatar with gradient background
- Login/Signup buttons for guests

**Responsive**:
- Mobile: Logo + user avatar only
- Desktop: Logo + nav links + user menu

---

## 1. Landing Page (`app/page.tsx`)

**Route**: `/`
**Audience**: Public (not logged in)

### Hero Section

```tsx
<div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 relative overflow-hidden">
  {/* Animated background shapes */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '1s' }}></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
  </div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
    {/* Logo/Icon */}
    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl mb-8 border border-white/30 animate-bounce-in">
      <span className="text-6xl">✓</span>
    </div>

    {/* Heading */}
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-lg animate-fade-in-down">
      Organize Your Life
      <br />
      <span className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">One Task at a Time</span>
    </h1>

    {/* Subheading */}
    <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl animate-fade-in-up">
      A beautiful, modern task manager that helps you stay productive and achieve your goals. Simple, powerful, and always in sync.
    </p>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
      <Link href="/register">
        <Button variant="primary" size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl px-8 py-4">
          Get Started Free
        </Button>
      </Link>
      <Link href="/login">
        <Button variant="ghost" size="lg" className="bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 border-2 border-white/30 px-8 py-4">
          Sign In
        </Button>
      </Link>
    </div>

    {/* Features (optional) */}
    <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-xl font-bold text-white mb-2">Stay Focused</h3>
        <p className="text-white/80 text-sm">Organize tasks with priorities, tags, and due dates</p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="text-4xl mb-3">🔄</div>
        <h3 className="text-xl font-bold text-white mb-2">Stay Consistent</h3>
        <p className="text-white/80 text-sm">Create recurring tasks for daily habits and routines</p>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="text-4xl mb-3">📱</div>
        <h3 className="text-xl font-bold text-white mb-2">Stay Connected</h3>
        <p className="text-white/80 text-sm">Access your tasks anywhere, on any device</p>
      </div>
    </div>
  </div>
</div>
```

**Features**:
- Full-screen gradient background (pink → purple → indigo)
- Animated floating gradient blobs (glass-morphism effect)
- Large hero heading with gradient text
- Clear value proposition
- Two CTAs (Get Started, Sign In)
- Three feature cards with icons
- All content centered and animated on entrance

**Responsive**:
- Mobile: Single column, smaller text
- Desktop: Larger text, features in row

---

## 2. Dashboard Page (`app/(protected)/dashboard/page.tsx`)

**Route**: `/dashboard`
**Audience**: Authenticated users

### Layout Structure

```tsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        Welcome back, {userName} 👋
      </h1>
      <p className="text-lg text-gray-600">
        Here's what's on your plate today
      </p>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* Total tasks */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Total Tasks</span>
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
      </div>

      {/* Completed */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Completed</span>
          <span className="text-2xl">✅</span>
        </div>
        <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
      </div>

      {/* Pending */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Pending</span>
          <span className="text-2xl">⏳</span>
        </div>
        <p className="text-3xl font-bold text-indigo-600">{pendingTasks}</p>
      </div>

      {/* Overdue */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Overdue</span>
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-3xl font-bold text-red-600">{overdueTasks}</p>
      </div>
    </div>

    {/* Task Preview */}
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
        <Link href="/tasks">
          <Button variant="ghost" size="sm">
            View All →
          </Button>
        </Link>
      </div>

      {/* Task grid (show 3-6 recent tasks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentTasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskUpdated={refetchTasks} />
        ))}
      </div>

      {/* Empty state */}
      {recentTasks.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-6">Create your first task to get started</p>
          <Link href="/tasks">
            <Button variant="primary">Create Task</Button>
          </Link>
        </div>
      )}
    </div>

    {/* Quick Actions */}
    <div className="flex justify-center">
      <Link href="/tasks">
        <Button variant="primary" size="lg" className="shadow-xl">
          ➕ Add New Task
        </Button>
      </Link>
    </div>
  </div>
</div>
```

**Features**:
- Personalized greeting with user name
- 4 stat cards (total, completed, pending, overdue)
- Recent tasks preview (3-6 tasks in grid)
- "View All" link to tasks page
- "Add New Task" CTA button
- Empty state for new users

**Responsive**:
- Mobile: 1 column for stats and tasks
- Tablet: 2 columns for stats, 2 columns for tasks
- Desktop: 4 columns for stats, 3 columns for tasks

---

## 3. Task List Page (`app/(protected)/tasks/page.tsx`)

**Route**: `/tasks`
**Audience**: Authenticated users

### Layout Structure

```tsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header with action */}
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
        My Tasks
      </h1>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        ➕ New Task
      </Button>
    </div>

    {/* Filters/Sort (optional, may already exist) */}
    {hasFilters && (
      <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-100">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status filter */}
          <select className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
            <option>All Tasks</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>

          {/* Priority filter */}
          <select className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          {/* Sort */}
          <select className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm">
            <option>Sort by Date</option>
            <option>Sort by Priority</option>
            <option>Sort by Title</option>
          </select>
        </div>
      </div>
    )}

    {/* Task grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onTaskUpdated={refetchTasks} />
      ))}
    </div>

    {/* Loading state */}
    {isLoading && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    )}

    {/* Empty state */}
    {!isLoading && tasks.length === 0 && (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-600 mb-6">
          {hasActiveFilters
            ? 'Try adjusting your filters'
            : 'Create your first task to get started'}
        </p>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          ➕ Create Task
        </Button>
      </div>
    )}
  </div>

  {/* Create task modal (optional, could also navigate to separate page) */}
  {showCreateModal && (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 m-4 max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <TaskForm
          mode="create"
          onSuccess={() => {
            setShowCreateModal(false);
            refetchTasks();
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  )}
</div>
```

**Features**:
- Page title with "New Task" button
- Optional filters/sort bar
- Task grid (3 columns on desktop)
- Loading skeletons
- Empty state with CTA
- Create task modal (alternative to dedicated page)

**Responsive**:
- Mobile: 1 column for tasks
- Tablet: 2 columns for tasks
- Desktop: 3 columns for tasks

---

## 4. Login Page (`app/(auth)/login/page.tsx`)

**Route**: `/login`
**Audience**: Public (not logged in)

**Status**: ✅ Already implemented with modern design (no changes needed)

**Reference**: `frontend/app/(auth)/login/page.tsx`

**Features**:
- Full-screen gradient background
- Animated floating blobs
- Glass-morphism card
- Email and password inputs
- "Sign In" button with loading state
- Link to registration
- Modern, premium aesthetic

---

## 5. Registration Page (`app/(auth)/register/page.tsx`)

**Route**: `/register`
**Audience**: Public (not logged in)

**Status**: ✅ Already implemented with modern design (no changes needed)

**Reference**: `frontend/app/(auth)/register/page.tsx` (lines 60-221)

**Features**:
- Full-screen gradient background
- Animated floating blobs
- Glass-morphism card
- Email, password, confirm password inputs
- "Create Account" button with loading state
- Link to login
- Modern, premium aesthetic

---

## 6. Task Detail Page (OPTIONAL)

**Route**: `/tasks/[id]`
**Audience**: Authenticated users

**Status**: ⚠️ Optional feature (not required for MVP)

### Layout Structure (if implemented)

```tsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Back button */}
    <Link href="/tasks" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-medium">
      ← Back to Tasks
    </Link>

    {/* Task card (expanded view) */}
    <TaskCard task={task} onTaskUpdated={refetchTask} variant="expanded" />

    {/* Additional details (optional) */}
    <div className="mt-6 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-600">Created</dt>
          <dd className="text-base text-gray-900 mt-1">{formatDateTime(task.created_at)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-600">Last Updated</dt>
          <dd className="text-base text-gray-900 mt-1">{formatDateTime(task.updated_at)}</dd>
        </div>
      </dl>
    </div>
  </div>
</div>
```

**Decision**: Recommend NOT implementing this page for MVP. Inline editing in TaskCard is sufficient.

---

## Common Layout Patterns

### Container Widths

```tsx
/* Max-width containers (centered) */
<div className="max-w-7xl mx-auto">  {/* Main content (1280px max) */}
<div className="max-w-4xl mx-auto">  {/* Narrow content (896px max) */}
<div className="max-w-2xl mx-auto">  {/* Forms, modals (672px max) */}
```

### Page Padding

```tsx
/* Responsive page padding */
<div className="px-4 sm:px-6 lg:px-8 py-8">
  {/* Content */}
</div>

/* Breakdown:
- Mobile: 16px horizontal, 32px vertical
- Tablet: 24px horizontal, 32px vertical
- Desktop: 32px horizontal, 32px vertical
*/
```

### Section Spacing

```tsx
/* Between major sections */
<div className="mb-8">  {/* 32px bottom margin */}

/* Between cards/items */
<div className="mb-6">  {/* 24px bottom margin */}

/* Between form fields */
<div className="space-y-4">  {/* 16px gap */}
```

### Grid Layouts

```tsx
/* Task grid (1 → 2 → 3 columns) */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

/* Stat cards (1 → 2 → 4 columns) */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

/* Feature cards (1 → 3 columns) */
<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
```

---

## Acceptance Criteria

Before marking complete, verify:

- ✅ Landing page has hero section with gradient background and animated blobs
- ✅ Landing page has clear CTAs (Get Started, Sign In)
- ✅ Dashboard shows personalized greeting with user name
- ✅ Dashboard shows 4 stat cards (total, completed, pending, overdue)
- ✅ Dashboard shows recent tasks preview (3-6 tasks)
- ✅ Task list page has "New Task" button in header
- ✅ Task list page displays tasks in responsive grid (1 → 2 → 3 columns)
- ✅ Empty states display with helpful message and CTA
- ✅ Loading states show skeleton placeholders
- ✅ All pages use consistent max-width containers (max-w-7xl)
- ✅ All pages use consistent padding (px-4 sm:px-6 lg:px-8 py-8)
- ✅ Navbar is sticky and includes logo, nav links, user menu
- ✅ Login/Register pages already modern (no changes needed)

---

## Related Documentation

- **Components**: See `contracts/` for Button, Input, TaskCard, TaskForm
- **Design System**: See `design-system.md` for colors, spacing, typography
- **Research**: See `research.md` for responsive patterns and best practices
