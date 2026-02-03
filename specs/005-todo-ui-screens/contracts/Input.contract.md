# Input Component Contract

**Component**: `components/common/Input.tsx`
**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06

---

## Purpose

Reusable input and textarea components with consistent styling, validation states, and full accessibility support. Provides a unified interface for all form inputs across the application.

---

## TypeScript Interfaces

### Input (Single-line text)

```typescript
interface InputProps {
  /** Input ID (required for label association) */
  id: string;

  /** Input name attribute (form submission) */
  name: string;

  /** Input type */
  type?: 'text' | 'email' | 'password' | 'date' | 'number';

  /** Label text (displayed above input) */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Current value */
  value: string;

  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** Required field indicator */
  required?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Error message (shows red border and error text) */
  error?: string;

  /** Helper text (shows below input in gray) */
  helperText?: string;

  /** Maximum character length */
  maxLength?: number;

  /** Autocomplete attribute (browser behavior) */
  autoComplete?: string;

  /** Additional Tailwind classes */
  className?: string;
}
```

### Textarea (Multi-line text)

```typescript
interface TextareaProps {
  /** Textarea ID (required for label association) */
  id: string;

  /** Textarea name attribute (form submission) */
  name: string;

  /** Label text (displayed above textarea) */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Current value */
  value: string;

  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /** Required field indicator */
  required?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Error message (shows red border and error text) */
  error?: string;

  /** Helper text (shows below textarea in gray) */
  helperText?: string;

  /** Number of visible rows */
  rows?: number;

  /** Maximum character length */
  maxLength?: number;

  /** Additional Tailwind classes */
  className?: string;
}
```

---

## Visual States

### Default State

**Styling**:
```tsx
className="
  w-full
  px-3 py-3
  border-2 border-gray-300
  rounded-lg
  text-base text-gray-900
  placeholder-gray-400
  bg-white
  transition-all duration-200
  min-h-[48px]
"
```

**Touch Target**: 48px height ✅

### Focus State (Active Input)

**Styling**:
```tsx
className="
  focus:outline-none
  focus:ring-4 focus:ring-indigo-100
  focus:border-indigo-500
  transition-all duration-200
"
```

**Behavior**:
- Border changes from gray-300 to indigo-500
- Ring appears (4px, indigo-100)
- Smooth 200ms transition

### Error State

**Styling**:
```tsx
className="
  border-red-500
  focus:ring-red-100
  focus:border-red-500
"
```

**Additional Elements**:
- Error message displayed below input
- Red border persists on focus
- Error text in red-600

### Disabled State

**Styling**:
```tsx
disabled={true}

className="
  bg-gray-100
  cursor-not-allowed
  opacity-75
"
```

**Behavior**:
- No focus ring
- No hover effects
- Grayed out appearance

---

## Label Styling

```tsx
<label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
  {label}
  {required && <span className="text-red-500 ml-1">*</span>}
</label>
```

**Features**:
- Associated with input via `htmlFor`
- Required indicator (red asterisk)
- Clear visual hierarchy

---

## Helper Text & Error Messages

### Helper Text (Default)

```tsx
{helperText && !error && (
  <p className="mt-1.5 text-xs text-gray-500">
    {helperText}
  </p>
)}
```

**Usage**: "Enter your email address", "Min 8 characters"

### Error Message

```tsx
{error && (
  <p className="mt-1.5 text-sm text-red-600 font-medium">
    {error}
  </p>
)}
```

**Usage**: "Email is required", "Password must be at least 8 characters"

### Character Counter (with maxLength)

```tsx
{maxLength && (
  <p className="mt-1 text-xs text-gray-500">
    {value.length}/{maxLength} characters
  </p>
)}
```

**Usage**: Shows "45/200 characters" dynamically

---

## Full Implementation Example

### Input Component

```tsx
'use client';

import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'number';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
}

export default function Input({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  maxLength,
  autoComplete,
  className = '',
}: InputProps) {
  const baseStyles = `
    w-full px-3 py-3
    border-2 rounded-lg
    text-base text-gray-900 placeholder-gray-400
    bg-white
    transition-all duration-200
    min-h-[48px]
    focus:outline-none focus:ring-4
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-75
  `;

  const stateStyles = error
    ? 'border-red-500 focus:ring-red-100 focus:border-red-500'
    : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500';

  return (
    <div className={`${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`${baseStyles} ${stateStyles}`.trim().replace(/\s+/g, ' ')}
      />

      {/* Helper text or error message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {/* Character counter */}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}
```

### Textarea Component

```tsx
'use client';

import React from 'react';

interface TextareaProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export default function Textarea({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  rows = 4,
  maxLength,
  className = '',
}: TextareaProps) {
  const baseStyles = `
    w-full px-3 py-3
    border-2 rounded-lg
    text-base text-gray-900 placeholder-gray-400
    bg-white
    transition-all duration-200
    resize-none
    focus:outline-none focus:ring-4
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-75
  `;

  const stateStyles = error
    ? 'border-red-500 focus:ring-red-100 focus:border-red-500'
    : 'border-gray-300 focus:ring-indigo-100 focus:border-indigo-500';

  return (
    <div className={`${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`${baseStyles} ${stateStyles}`.trim().replace(/\s+/g, ' ')}
      />

      {/* Helper text or error message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 font-medium flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-xs text-gray-500">
          {helperText}
        </p>
      )}

      {/* Character counter */}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}
```

---

## Usage Examples

### Basic Text Input

```tsx
<Input
  id="task-title"
  name="title"
  label="Task Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
  placeholder="Enter task title"
/>
```

### Email Input with Validation

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
  error={emailError}
  placeholder="you@example.com"
/>
```

### Password Input with Helper Text

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
  maxLength={50}
/>
```

### Textarea with Character Counter

```tsx
<Textarea
  id="description"
  name="description"
  label="Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  placeholder="Describe the task..."
  rows={4}
  maxLength={2000}
  helperText="Provide details about the task (optional)"
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

### Input with Error State

```tsx
<Input
  id="username"
  name="username"
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  required
  error="Username is already taken"
/>
```

---

## Accessibility Features

### Label Association
- `htmlFor` attribute connects label to input
- Screen readers announce label when input is focused

### Required Fields
- Visual indicator (red asterisk)
- `required` attribute for native browser validation
- ARIA attribute automatically added by browser

### Error Announcements
- Error messages displayed visually
- Consider adding `aria-describedby` for screen readers (future enhancement)

### Keyboard Navigation
- Tab to navigate between inputs
- Clear focus indicator (ring-4)

### Touch Targets
- Minimum 48px height for inputs
- Adequate padding for touch interaction

---

## Form Integration Pattern

```tsx
'use client';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit form
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
        rows={4}
        maxLength={2000}
        placeholder="Describe the task..."
      />

      <Button type="submit" variant="primary" fullWidth>
        Create Task
      </Button>
    </form>
  );
}
```

---

## Acceptance Criteria

Before marking complete, verify:

- ✅ Input height is minimum 48px (touch-friendly)
- ✅ Focus ring visible and accessible (4px, light color)
- ✅ Border changes color on focus (gray → indigo)
- ✅ Error state shows red border and error message
- ✅ Required indicator (asterisk) displays when required={true}
- ✅ Helper text displays below input (gray text)
- ✅ Character counter updates dynamically with maxLength
- ✅ Disabled state prevents interaction and shows visually
- ✅ Label correctly associated with input (htmlFor + id)
- ✅ Placeholder text visible until user types
- ✅ Textarea resizing disabled (resize-none)
- ✅ All input types supported (text, email, password, date, number)

---

## Related Components

- **Button**: Form submit/cancel actions (uses similar focus states)
- **TaskForm**: Primary consumer of Input/Textarea components

---

## Design System Reference

- **Colors**: See `design-system.md` > Color Palette
- **Typography**: See `design-system.md` > Typography
- **Spacing**: See `design-system.md` > Spacing System
- **Borders**: See `design-system.md` > Border Radius
- **Transitions**: See `design-system.md` > Animation & Transitions
