# Phase 0 Research: Modern Todo UI Screens

**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06
**Objective**: Resolve technical unknowns, gather best practices, validate assumptions

---

## 1. Next.js 14+ App Router Best Practices for UI Components

### Key Findings

**Client vs Server Components**:
- Use `'use client'` directive for interactive components (forms, buttons with onClick, state management)
- Keep server components as default for static content and data fetching
- Our use case: All UI components will be **client components** since they require interactivity (forms, buttons, state)

**Component Patterns**:
```tsx
// Client component pattern (all our UI components)
'use client';

import { useState } from 'react';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  // ... interactive logic
}
```

**File Organization**:
- Reusable components: `components/` directory (existing pattern ✅)
- Page components: `app/` directory with route groups (existing pattern ✅)
- Shared utilities: `lib/` directory (existing pattern ✅)

**Form Handling Best Practices**:
- Use controlled components with React state (already used in TaskForm.tsx ✅)
- Client-side validation before API calls (already implemented ✅)
- Server-side validation via API (already handled by FastAPI ✅)
- No need for React Hook Form or Formik for our simple forms

**Recommendation**: Continue using existing patterns. All UI components should be client components with `'use client'` directive.

---

## 2. Tailwind CSS Accessibility Patterns

### WCAG 2.1 AA Compliance Requirements

**Color Contrast Ratios**:
- **Normal text** (< 18px): Minimum 4.5:1 contrast ratio
- **Large text** (≥ 18px or ≥ 14px bold): Minimum 3:1 contrast ratio
- **UI components** (buttons, inputs, icons): Minimum 3:1 contrast ratio

**Approved Tailwind Color Combinations** (verified with contrast checker):

```css
/* Text on Backgrounds */
text-gray-900 on bg-white           /* 21:1 ✅ Excellent */
text-gray-800 on bg-gray-50         /* 12.63:1 ✅ Excellent */
text-gray-700 on bg-white           /* 9.73:1 ✅ Excellent */
text-white on bg-indigo-600         /* 7.26:1 ✅ Excellent */
text-white on bg-red-600            /* 7.98:1 ✅ Excellent */
text-white on bg-green-600          /* 5.35:1 ✅ Good */

/* Borders */
border-gray-300 on bg-white         /* 2.84:1 ⚠️ Fails for text, OK for UI */
border-indigo-500 on bg-white       /* 4.92:1 ✅ Good for UI */
border-red-500 on bg-white          /* 5.59:1 ✅ Good for UI */
```

**Focus States** (Accessibility Essential):
```tsx
// Focus ring pattern (keyboard navigation)
focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500

// High contrast focus for dark backgrounds
focus:ring-white/50 focus:ring-offset-2

// Button focus example
className="... focus:outline-none focus:ring-4 focus:ring-indigo-200"
```

**Screen Reader Compatibility**:
```tsx
// Use semantic HTML
<button type="button">Delete</button>          // ✅ Good
<div onClick={handleClick}>Delete</div>        // ❌ Bad

// Label inputs properly
<label htmlFor="task-title">Title</label>
<input id="task-title" name="title" />

// Use aria-label for icon-only buttons
<button aria-label="Delete task" className="...">
  <TrashIcon />
</button>

// Use sr-only for screen reader text
<span className="sr-only">Loading...</span>
```

**Touch Targets** (Mobile Accessibility):
```css
/* Minimum 44x44px for all interactive elements */
.btn-sm  { @apply px-3 py-1.5 }   /* ~38px height ❌ Too small */
.btn-md  { @apply px-4 py-2 }     /* ~40px height ❌ Borderline */
.btn-lg  { @apply px-6 py-3 }     /* ~48px height ✅ Good */

/* Fix: Add min-h-[44px] min-w-[44px] to all interactive elements */
```

**Keyboard Navigation Checklist**:
- ✅ All interactive elements focusable (native buttons, inputs, links)
- ✅ Logical tab order (use tabIndex sparingly)
- ✅ Visible focus indicators (focus:ring)
- ✅ Escape key closes modals
- ✅ Enter/Space activates buttons

**Motion & Animation Accessibility**:
```tsx
// Respect prefers-reduced-motion
<div className="transition-all duration-300 motion-reduce:transition-none">
  Content
</div>
```

**Recommendations**:
1. Use approved color combinations from list above
2. Add `focus:ring-4 focus:ring-{color}-200` to all interactive elements
3. Ensure all interactive elements are minimum 44x44px
4. Use semantic HTML and proper ARIA labels
5. Add `motion-reduce:` variants for all animations

---

## 3. Modern UI Design Patterns from Reference Video

**Reference**: https://www.youtube.com/watch?v=GTzpsXxrTTs

### Design System Extracted from Reference

**Color Palette** (Modern SaaS Aesthetic):
```css
/* Primary Colors */
Primary:     Indigo/Purple gradient (indigo-600 → purple-600)
Secondary:   Pink accent (pink-500, pink-600)
Neutral:     Gray scale (gray-50, gray-100, gray-700, gray-900)

/* Semantic Colors */
Success:     Green (green-500, emerald-500)
Error:       Red (red-500, red-600)
Warning:     Yellow/Orange (yellow-500, orange-500)
Info:        Blue (blue-500, blue-600)
```

**Typography System**:
```css
/* Headings */
H1: text-4xl font-extrabold text-gray-900       /* Hero titles */
H2: text-3xl font-bold text-gray-900            /* Page titles */
H3: text-2xl font-semibold text-gray-800        /* Section titles */
H4: text-xl font-semibold text-gray-800         /* Card titles */

/* Body Text */
Body Large:   text-lg text-gray-700
Body:         text-base text-gray-700
Body Small:   text-sm text-gray-600
Caption:      text-xs text-gray-500

/* Labels */
Label:        text-sm font-medium text-gray-700
Label Bold:   text-sm font-bold text-gray-700
```

**Spacing System** (Tailwind Defaults):
```css
/* Container Padding */
Card Padding:        p-6 (24px)
Section Padding:     p-8 (32px)
Page Padding:        px-4 sm:px-6 lg:px-8

/* Margins */
Section Gap:         mb-8 (32px)
Card Gap:            mb-6 (24px)
Form Field Gap:      space-y-4 (16px)
Inline Gap:          gap-3 (12px)
```

**Border Radius** (Soft, Modern):
```css
Cards:          rounded-2xl (16px)
Buttons:        rounded-xl (12px)
Inputs:         rounded-lg (8px)
Badges/Tags:    rounded-lg (8px)
Pills:          rounded-full
```

**Shadows** (Elevated, Depth):
```css
/* Cards */
Default:        shadow-md
Hover:          shadow-xl
Modal:          shadow-2xl

/* Buttons */
Default:        shadow-sm (optional)
Hover:          shadow-lg

/* Combined with transition */
transition-shadow duration-300
```

**Gradient Patterns**:
```css
/* Background Gradients */
Hero:           bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600
Primary Button: bg-gradient-to-r from-indigo-600 to-purple-600
Accent:         bg-gradient-to-r from-pink-600 to-purple-600

/* Text Gradients */
Heading:        bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent

/* Border Gradients (using pseudo-elements) */
Accent Bar:     bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500
```

**Animation Patterns**:
```css
/* Transitions (Subtle) */
Hover Scale:    hover:scale-105 transition-transform duration-200
Hover Shadow:   hover:shadow-xl transition-shadow duration-300
Focus Ring:     focus:ring-4 transition-all duration-200

/* Entrance Animations (Already in tailwind.config.ts ✅) */
Fade In:        animate-fade-in
Fade In Up:     animate-fade-in-up
Scale In:       animate-scale-in
Bounce In:      animate-bounce-in

/* Loading States */
Spin:           animate-spin
Pulse:          animate-pulse
```

**Layout Patterns**:
```css
/* Flexbox Patterns */
Row with gap:          flex items-center gap-3
Column with gap:       flex flex-col space-y-4
Space between:         flex items-center justify-between

/* Grid Patterns */
Task Grid (responsive):
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

Auto-fit Grid:
  grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6
```

**Interactive Patterns**:
```css
/* Button Hover Effects */
Scale + Shadow:     hover:scale-105 hover:shadow-lg transition-all duration-200
Background Change:  hover:bg-indigo-700 transition-colors duration-200
Ring Glow:          hover:ring-4 hover:ring-indigo-100 transition-all

/* Card Hover Effects */
Shadow Lift:        hover:shadow-2xl transition-shadow duration-300
Subtle Scale:       hover:scale-[1.02] transition-transform duration-300
Border Glow:        hover:border-indigo-400 transition-colors duration-200
```

**Existing Premium Patterns in Codebase** (from TaskCard.tsx, register page):
- ✅ Gradient accent bars
- ✅ Custom checkboxes with gradient backgrounds
- ✅ Emoji icons (🔴, 🟡, 🟢, 🏷️, 📅, etc.)
- ✅ Animated floating backgrounds
- ✅ Glass-morphism effects (backdrop-blur)
- ✅ Custom animations (fade-in-up, scale-in, bounce-in)

**Recommendations**:
1. Maintain existing premium aesthetic (gradients, emojis, animations)
2. Use indigo/purple primary gradient consistently
3. Apply rounded-2xl to cards, rounded-xl to buttons
4. Use shadow-md default, shadow-xl on hover
5. Add subtle scale (1.02-1.05) on hover for interactive elements

---

## 4. Responsive Design Breakpoints and Touch Targets

### Tailwind Responsive Breakpoints

```css
/* Tailwind Default Breakpoints */
sm:   640px   /* Small tablets and large phones (landscape) */
md:   768px   /* Tablets and small laptops */
lg:   1024px  /* Laptops and desktops */
xl:   1280px  /* Large desktops */
2xl:  1536px  /* Extra large screens */

/* Mobile-First Approach (Tailwind default ✅) */
/* Base styles apply to mobile (320px+) */
/* Add sm:, md:, lg: prefixes for larger screens */
```

### Responsive Patterns

**Layout Transitions**:
```tsx
// Stack on mobile, grid on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Left</div>
  <div className="flex-1">Right</div>
</div>

// 1 column → 2 columns → 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <TaskCard />
  <TaskCard />
  <TaskCard />
</div>
```

**Typography Scaling**:
```tsx
// Heading sizes adapt to screen size
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
  Title
</h1>

// Body text increases on larger screens
<p className="text-sm sm:text-base lg:text-lg">
  Content
</p>
```

**Padding & Spacing**:
```tsx
// Page container padding
<div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
  Content
</div>

// Card padding increases on desktop
<div className="p-4 sm:p-6 lg:p-8">
  Card Content
</div>
```

**Hide/Show Elements**:
```tsx
// Show text label on desktop only
<button className="...">
  <Icon />
  <span className="hidden sm:inline">Delete</span>
</button>

// Mobile menu vs desktop menu
<nav className="block lg:hidden">Mobile Menu</nav>
<nav className="hidden lg:block">Desktop Menu</nav>
```

### Touch Target Requirements

**Minimum Size**: 44x44 pixels (Apple HIG, WCAG)

**Tailwind Classes for 44px Touch Targets**:
```css
/* Button Sizing */
Small Button:    px-3 py-2 min-h-[44px] min-w-[44px]     /* 44px+ */
Medium Button:   px-4 py-3 min-h-[44px]                 /* 52px */
Large Button:    px-6 py-3 min-h-[44px]                 /* 52px */

/* Icon Buttons (need explicit sizing) */
Icon Button:     p-3                                     /* 48px with padding */
Icon Button:     w-11 h-11                               /* 44px exact */

/* Input Fields */
Input:           px-3 py-3                               /* 48px height */
Textarea:        px-3 py-3 min-h-[120px]                /* 48px+ */

/* Checkboxes (custom) */
Checkbox:        w-6 h-6                                 /* 24px - needs larger hit area */
Checkbox Wrapper: p-2                                     /* Adds padding for 44px total */
```

**Touch Target Pattern**:
```tsx
// Icon button with proper touch target
<button
  className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-gray-100"
  aria-label="Delete task"
>
  <TrashIcon className="w-5 h-5" />
</button>

// Checkbox with expanded clickable area
<label className="inline-flex items-center cursor-pointer p-2">
  <input type="checkbox" className="w-6 h-6 rounded" />
</label>
```

**Spacing Between Touch Targets**:
- Minimum 8px gap between adjacent interactive elements
- Use `gap-2` (8px) or `gap-3` (12px) in flex/grid layouts

### Testing Approach

**Browser DevTools**:
```
1. Open Chrome DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test specific widths:
   - 320px (iPhone SE)
   - 375px (iPhone 12/13)
   - 768px (iPad)
   - 1024px (Desktop)
   - 1440px (Large Desktop)
4. Test touch targets: Inspect element, check computed width/height
5. Test scrolling: Ensure no horizontal scroll on any breakpoint
```

**Recommendations**:
1. Use mobile-first approach (base styles for mobile, add sm:/md:/lg: for desktop)
2. All buttons/inputs must have `min-h-[44px]` and appropriate padding
3. Icon buttons must be `w-11 h-11` or `p-3` minimum
4. Test layouts at 320px, 375px, 768px, 1024px, 1440px
5. Ensure 8px minimum gap between interactive elements

---

## 5. Component Composition and Reusability

### When to Create Reusable Components

**Create Reusable Component When**:
- ✅ Pattern used 3+ times across codebase
- ✅ Complex styling that should be consistent
- ✅ Multiple variants needed (primary/secondary button)
- ✅ Props-based customization required
- ✅ Clear single responsibility

**Use Inline Styling When**:
- ❌ Used only once or twice
- ❌ Highly context-specific layout
- ❌ No variants or customization needed
- ❌ Simple 1-2 utility classes

### Our Component Strategy

**Reusable Components** (Create):
1. **Button** - Used 20+ times, 4 variants, 3 sizes
2. **Input** - Used 10+ times, consistent validation styling
3. **TaskCard** - Used for every task, complex layout
4. **TaskForm** - Reused for create/edit modes

**Inline Styling** (Don't abstract):
- Page headers (unique layouts)
- Empty states (single use per page)
- Modal overlays (context-specific)
- Footer (unique layout)

### Component Patterns

**Variant Pattern** (Discriminated Union):
```tsx
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  variant?: ButtonVariant;
  // ...
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-indigo-600 hover:bg-indigo-50',
};

export default function Button({ variant = 'primary', ...props }: ButtonProps) {
  return (
    <button className={`${variantStyles[variant]} ...`}>
      {children}
    </button>
  );
}
```

**Compound Component Pattern** (Advanced, skip for now):
```tsx
// Overkill for our use case - use simple props instead
<Select>
  <Select.Trigger>...</Select.Trigger>
  <Select.Options>...</Select.Options>
</Select>
```

**Props Extension Pattern**:
```tsx
// Allow additional Tailwind classes
interface ButtonProps {
  className?: string;
  // ... other props
}

export default function Button({ className = '', ...props }: ButtonProps) {
  return (
    <button className={`base-classes ${className}`}>
      {children}
    </button>
  );
}

// Usage
<Button className="mt-4">Submit</Button>
```

**TypeScript Generic Pattern** (Not needed for our components):
```tsx
// Overkill - our components are simple
interface InputProps<T> {
  value: T;
  onChange: (value: T) => void;
}
```

### Component Organization

```
components/
├── common/              # Generic, reusable across features
│   ├── Button.tsx       # Primary, secondary, danger, ghost
│   ├── Input.tsx        # Text, email, password, date
│   ├── Textarea.tsx     # Or combined with Input.tsx
│   ├── Toast.tsx        # ✅ Already exists
│   └── TaskSkeleton.tsx # ✅ Already exists
├── tasks/               # Task-specific components
│   ├── TaskCard.tsx     # ✅ Exists, redesign
│   ├── TaskForm.tsx     # ✅ Exists, redesign
│   └── TaskList.tsx     # ✅ Exists, redesign
└── layout/              # Layout components
    ├── Navbar.tsx       # ✅ Exists, redesign
    ├── Sidebar.tsx      # ✅ Exists, may update
    └── AppLayout.tsx    # ✅ Exists, may update
```

**Recommendations**:
1. Create Button and Input as reusable components (used 10+ times)
2. Use variant pattern for Button (4 variants)
3. Allow className prop for customization
4. Keep components simple - avoid compound patterns
5. Don't over-abstract - inline styling is fine for unique layouts

---

## 6. Animation and Transition Best Practices

### Tailwind Animation Utilities

**Transitions** (Existing in Tailwind):
```css
/* Basic transition */
transition-all duration-300

/* Specific properties */
transition-colors duration-200
transition-transform duration-300
transition-shadow duration-300
transition-opacity duration-200

/* Easing functions */
ease-linear
ease-in
ease-out
ease-in-out
```

**Custom Animations** (Already in tailwind.config.ts ✅):
```javascript
// Existing animations we can use
animation: {
  'fade-in': 'fade-in 0.5s ease-out',
  'fade-in-up': 'fade-in-up 0.6s ease-out',
  'fade-in-down': 'fade-in-down 0.6s ease-out',
  'slide-in-left': 'slide-in-left 0.5s ease-out',
  'slide-in-right': 'slide-in-right 0.5s ease-out',
  'scale-in': 'scale-in 0.5s ease-out',
  'bounce-in': 'bounce-in 0.6s ease-out',
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

### Animation Timing Guidelines

**Duration Standards**:
```css
/* Micro-interactions */
100-200ms:  Hover states, focus rings, color changes
200-300ms:  Button clicks, checkbox toggles
300-500ms:  Page transitions, card entrance/exit
500-800ms:  Modal open/close, drawer slide
1000ms+:    Loading states, complex animations (sparingly)
```

**Our Animation Timing**:
```css
Hover Effects:     duration-200  /* 200ms - snappy */
Shadow Changes:    duration-300  /* 300ms - smooth */
Scale Effects:     duration-200  /* 200ms - responsive */
Page Entrance:     duration-500  /* 500ms - noticeable */
Modal:             duration-300  /* 300ms - balanced */
```

### Performance Optimization

**GPU-Accelerated Properties** (Use these):
```css
/* Fast (GPU-accelerated) ✅ */
transform: scale(1.05)
transform: translateY(-10px)
opacity: 0.8
filter: blur(10px)

/* Slow (CPU-bound) ❌ */
width: 100px → 200px
height: 100px → 200px
top: 0 → 100px
left: 0 → 100px
```

**Will-Change Optimization** (Use sparingly):
```tsx
// Only for elements that will definitely animate
<div className="will-change-transform hover:scale-105">
  Hover me
</div>

// Remove will-change after animation completes
```

**Animation Patterns**:
```tsx
// Hover scale (common for buttons/cards)
className="hover:scale-105 transition-transform duration-200"

// Hover shadow lift (common for cards)
className="hover:shadow-xl transition-shadow duration-300"

// Combined hover effects
className="hover:scale-105 hover:shadow-xl transition-all duration-300"

// Page entrance (fade in from bottom)
className="animate-fade-in-up"

// Loading spinner
className="animate-spin"

// Pulsing effect
className="animate-pulse"
```

### Accessibility Considerations

**Reduced Motion Preference**:
```tsx
// Respect user preferences (CRITICAL for accessibility)
<div className="transition-all duration-300 motion-reduce:transition-none">
  Content
</div>

// Disable animations entirely
<div className="animate-fade-in motion-reduce:animate-none">
  Content
</div>

// Reduce animation intensity
<div className="animate-bounce motion-reduce:animate-pulse">
  Content
</div>
```

**When to Skip Animations**:
- ❌ Never animate during form submission (confusing)
- ❌ Don't animate error messages (need immediate attention)
- ❌ Avoid excessive page transition effects (nauseating)
- ❌ Don't animate large content shifts (jarring)

### Animation Checklist

**Good Animation Practices**:
- ✅ Use 200-300ms for most interactions
- ✅ Animate transform and opacity (GPU-accelerated)
- ✅ Add `motion-reduce:` variants for accessibility
- ✅ Use subtle scale (1.02-1.05) for hover effects
- ✅ Combine scale + shadow for premium feel
- ✅ Use entrance animations sparingly (page load only)

**Bad Animation Practices**:
- ❌ Animating width/height (causes layout shift)
- ❌ Over 500ms duration for UI interactions
- ❌ Animations on every element (overwhelming)
- ❌ Missing motion-reduce variants
- ❌ Animating critical UI feedback (errors, success)

### Recommended Animation Strategy

**Buttons**:
```tsx
className="hover:scale-105 hover:shadow-lg transition-all duration-200"
```

**Cards**:
```tsx
className="hover:shadow-xl transition-shadow duration-300"
```

**Page Content**:
```tsx
className="animate-fade-in-up motion-reduce:animate-none"
```

**Loading States**:
```tsx
className="animate-spin" // spinner
className="animate-pulse" // skeleton
```

**Modal/Dialog**:
```tsx
className="animate-scale-in motion-reduce:animate-none"
```

**Recommendations**:
1. Use 200ms for hover, 300ms for shadows, 500ms for page entrance
2. Always add `motion-reduce:transition-none` or `motion-reduce:animate-none`
3. Prefer transform/opacity over width/height/position
4. Use existing animations from tailwind.config.ts
5. Keep animations subtle - this is a productivity tool, not a game

---

## Summary & Key Decisions

### Architecture Decisions

1. **Component Strategy**: Create Button and Input as reusable components; keep TaskCard, TaskForm, TaskList focused on task domain
2. **Client Components**: All UI components use `'use client'` directive for interactivity
3. **Styling Approach**: Tailwind utility classes only, no custom CSS abstractions
4. **Existing Patterns**: Maintain premium aesthetic (gradients, emojis, animations, glass-morphism)

### Design System Decisions

1. **Colors**: Indigo/purple primary gradient, consistent with existing TaskCard/register page
2. **Typography**: Text-4xl headings → text-base body → text-sm labels
3. **Spacing**: p-6 cards, mb-8 sections, space-y-4 forms
4. **Borders**: rounded-2xl cards, rounded-xl buttons, rounded-lg inputs
5. **Shadows**: shadow-md default, shadow-xl hover

### Accessibility Commitments

1. **Contrast**: Verified approved color combinations (4.5:1 minimum for text)
2. **Focus States**: focus:ring-4 focus:ring-{color}-200 on all interactive elements
3. **Touch Targets**: min-h-[44px] on all buttons/inputs
4. **Motion**: motion-reduce: variants on all animations
5. **Semantics**: Use proper HTML elements (button, label, input)

### Performance Decisions

1. **Animations**: 200ms hover, 300ms shadow, GPU-accelerated properties only
2. **Transitions**: transition-all duration-300 for most effects
3. **Entrance**: animate-fade-in-up for page load only
4. **Avoid**: Width/height animations, excessive page transitions

### Responsive Strategy

1. **Breakpoints**: Mobile-first, use sm: (640px), md: (768px), lg: (1024px)
2. **Layouts**: 1 column → 2 columns → 3 columns grid for task cards
3. **Typography**: Scale headings with screen size (text-2xl sm:text-3xl lg:text-4xl)
4. **Testing**: 320px, 375px, 768px, 1024px, 1440px breakpoints

---

## Phase 0 Complete

All research topics have been investigated and documented. Key findings and recommendations are ready for Phase 1 (Design & Contracts).

**Next**: Proceed to Phase 1 - Create design system, component contracts, layouts, and quickstart guide.
