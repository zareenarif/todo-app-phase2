# Button Component Contract

**Component**: `components/common/Button.tsx`
**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06

---

## Purpose

Reusable button component with consistent styling, multiple variants, and full accessibility support. Provides a unified interface for all interactive buttons across the application.

---

## TypeScript Interface

```typescript
interface ButtonProps {
  /** Button content (text, icons, or combination) */
  children: React.ReactNode;

  /** Click handler */
  onClick?: () => void;

  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';

  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';

  /** Disabled state */
  disabled?: boolean;

  /** Full width button (flex-1 or w-full) */
  fullWidth?: boolean;

  /** Loading state (shows spinner, disables interaction) */
  loading?: boolean;

  /** Additional Tailwind classes for customization */
  className?: string;

  /** ARIA label for accessibility (required for icon-only buttons) */
  ariaLabel?: string;
}
```

---

## Variants

### Primary (Default)

**Purpose**: Main call-to-action buttons (Save, Create, Submit)

**Styling**:
```tsx
className="
  bg-gradient-to-r from-indigo-600 to-purple-600
  text-white font-bold
  hover:from-indigo-700 hover:to-purple-700
  hover:scale-105 hover:shadow-lg
  focus:outline-none focus:ring-4 focus:ring-indigo-200
  transition-all duration-200
  shadow-sm
"
```

**Usage**:
```tsx
<Button variant="primary" onClick={handleSave}>
  Save Task
</Button>
```

### Secondary

**Purpose**: Secondary actions (Cancel, Back, View Details)

**Styling**:
```tsx
className="
  bg-gray-200 text-gray-700 font-bold
  hover:bg-gray-300
  hover:scale-105
  focus:outline-none focus:ring-4 focus:ring-gray-300
  transition-all duration-200
"
```

**Usage**:
```tsx
<Button variant="secondary" onClick={handleCancel}>
  Cancel
</Button>
```

### Danger

**Purpose**: Destructive actions (Delete, Remove, Clear)

**Styling**:
```tsx
className="
  bg-red-600 text-white font-bold
  hover:bg-red-700
  hover:scale-105 hover:shadow-lg
  focus:outline-none focus:ring-4 focus:ring-red-200
  transition-all duration-200
  shadow-sm
"
```

**Usage**:
```tsx
<Button variant="danger" onClick={handleDelete}>
  Delete Task
</Button>
```

### Ghost

**Purpose**: Tertiary actions, less emphasis (links, minor actions)

**Styling**:
```tsx
className="
  bg-transparent text-indigo-600 font-bold
  hover:bg-indigo-50
  hover:scale-105
  focus:outline-none focus:ring-4 focus:ring-indigo-100
  transition-all duration-200
"
```

**Usage**:
```tsx
<Button variant="ghost" onClick={handleLearnMore}>
  Learn More
</Button>
```

---

## Size Variants

### Small (`sm`)

**Purpose**: Compact buttons in tight spaces, inline actions

**Sizing**:
```tsx
className="px-3 py-2 text-sm min-h-[44px]"
```

**Touch Target**: 44px height minimum ✅

### Medium (`md`) - Default

**Purpose**: Standard buttons for most use cases

**Sizing**:
```tsx
className="px-4 py-3 text-base min-h-[44px]"
```

**Touch Target**: 52px height ✅

### Large (`lg`)

**Purpose**: Hero CTAs, primary landing page actions

**Sizing**:
```tsx
className="px-6 py-3 text-lg min-h-[44px]"
```

**Touch Target**: 52px height ✅

---

## States

### Default State
- Base variant styling applied
- Cursor pointer
- Interactive transitions enabled

### Hover State
- Scale: `scale-105` (5% larger)
- Shadow: `shadow-lg` (elevated)
- Variant-specific background change
- Duration: 200ms

### Focus State (Keyboard Navigation)
- Outline removed (`outline-none`)
- Ring added (`ring-4`)
- Ring color matches variant
- Accessible contrast maintained

### Active State (Pressed)
- Scale returns to normal (`scale-100`)
- Brief visual feedback

### Disabled State
```tsx
disabled={true}

className="
  opacity-50
  cursor-not-allowed
  pointer-events-none
"
```
- No hover effects
- No click events
- Visual indication of disabled state

### Loading State
```tsx
loading={true}

// Renders:
<button disabled>
  <span className="animate-spin">⏳</span>
  <span>{children}</span>
</button>
```
- Automatically disables button
- Shows spinning indicator
- Preserves button text

---

## Accessibility Features

### Keyboard Navigation
- Focusable via Tab key
- Activatable via Enter/Space keys
- Clear focus indicator (ring-4)

### Screen Readers
- Use semantic `<button>` element
- Provide `aria-label` for icon-only buttons
- Announce disabled state automatically

### Touch Targets
- Minimum 44x44px for all sizes
- Use `min-h-[44px]` on all variants

### Motion Accessibility
```tsx
className="
  motion-reduce:transform-none
  motion-reduce:transition-none
"
```
- Respects `prefers-reduced-motion`
- Disables scale/transform animations

---

## Full Implementation Example

```tsx
'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  className = '',
  ariaLabel,
}: ButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm focus:ring-indigo-200',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm focus:ring-red-200',
    ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-100',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Base styles (always applied)
  const baseStyles = `
    rounded-xl font-bold
    min-h-[44px]
    inline-flex items-center justify-center gap-2
    transition-all duration-200
    focus:outline-none focus:ring-4
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    motion-reduce:transform-none motion-reduce:transition-none
  `;

  // Hover styles (only when not disabled/loading)
  const hoverStyles = !disabled && !loading ? 'hover:scale-105 hover:shadow-lg' : '';

  // Full width
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${hoverStyles}
        ${widthStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {loading && (
        <span className="animate-spin" role="status" aria-label="Loading">
          ⏳
        </span>
      )}
      {children}
    </button>
  );
}
```

---

## Usage Examples

### Basic Button
```tsx
<Button onClick={handleClick}>
  Click Me
</Button>
```

### Form Submit Button
```tsx
<Button
  type="submit"
  variant="primary"
  size="lg"
  fullWidth
  loading={isSubmitting}
>
  Create Task
</Button>
```

### Danger Button
```tsx
<Button
  variant="danger"
  onClick={handleDelete}
  ariaLabel="Delete task"
>
  🗑️ Delete
</Button>
```

### Icon-Only Button
```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={handleEdit}
  ariaLabel="Edit task"
>
  ✏️
</Button>
```

### Custom Styling
```tsx
<Button
  variant="primary"
  className="mt-4 shadow-xl"
>
  Custom Margin and Shadow
</Button>
```

---

## Acceptance Criteria

Before marking complete, verify:

- ✅ All 4 variants render correctly (primary, secondary, danger, ghost)
- ✅ All 3 sizes render correctly (sm, md, lg)
- ✅ All interactive elements are minimum 44x44px
- ✅ Focus ring visible when navigating with keyboard
- ✅ Hover effects work (scale, shadow, background)
- ✅ Disabled state prevents interaction and shows visually
- ✅ Loading state shows spinner and disables button
- ✅ `className` prop allows additional customization
- ✅ `fullWidth` prop makes button stretch to container
- ✅ Icon-only buttons have `aria-label`
- ✅ Respects `prefers-reduced-motion` setting

---

## Related Components

- **Input**: Form input component (uses similar focus states)
- **TaskForm**: Uses Button for submit/cancel actions
- **TaskCard**: Uses Button for edit/delete actions

---

## Design System Reference

- **Colors**: See `design-system.md` > Color Palette
- **Typography**: See `design-system.md` > Typography
- **Spacing**: See `design-system.md` > Spacing System
- **Shadows**: See `design-system.md` > Shadows
- **Transitions**: See `design-system.md` > Animation & Transitions
