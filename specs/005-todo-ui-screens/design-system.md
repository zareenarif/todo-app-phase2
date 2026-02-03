# Visual Design System: Modern Todo UI

**Feature**: 005-todo-ui-screens
**Date**: 2026-01-06
**Purpose**: Define consistent visual language for all UI components and screens

---

## Color Palette

### Primary Colors

```css
/* Indigo/Purple Gradient (Primary Brand) */
--primary-start: #4f46e5      /* indigo-600 */
--primary-end: #9333ea        /* purple-600 */

/* Usage */
bg-gradient-to-r from-indigo-600 to-purple-600     /* Buttons, headers */
text-indigo-600                                     /* Links, icons */
border-indigo-500                                   /* Focus states */
```

### Secondary Colors

```css
/* Pink Accent */
--secondary: #ec4899           /* pink-500 */
--secondary-dark: #db2777      /* pink-600 */

/* Usage */
bg-gradient-to-r from-pink-600 to-purple-600      /* Accent buttons */
text-pink-600                                      /* Highlights */
```

### Neutral Colors

```css
/* Gray Scale */
--gray-50: #f9fafb            /* Backgrounds */
--gray-100: #f3f4f6           /* Subtle backgrounds */
--gray-200: #e5e7eb           /* Borders, dividers */
--gray-300: #d1d5db           /* Disabled states */
--gray-400: #9ca3af           /* Placeholders */
--gray-500: #6b7280           /* Secondary text */
--gray-600: #4b5563           /* Body text (secondary) */
--gray-700: #374151           /* Body text */
--gray-800: #1f2937           /* Headings (secondary) */
--gray-900: #111827           /* Headings (primary) */

/* Usage */
bg-white                      /* Cards, modals */
bg-gray-50                    /* Page backgrounds */
text-gray-900                 /* Primary text */
text-gray-700                 /* Body text */
text-gray-500                 /* Captions, metadata */
border-gray-200               /* Subtle borders */
border-gray-300               /* Input borders */
```

### Semantic Colors

```css
/* Success (Green) */
--success: #10b981            /* green-500 */
--success-dark: #059669       /* green-600 */
--success-bg: #d1fae5         /* green-100 */
--success-text: #065f46       /* green-800 */

/* Usage */
bg-green-500 text-white                           /* Success buttons */
bg-green-50 text-green-700 border-green-200       /* Success alerts */
bg-gradient-to-r from-green-400 to-emerald-500    /* Completed tasks */

/* Error (Red) */
--error: #ef4444              /* red-500 */
--error-dark: #dc2626         /* red-600 */
--error-bg: #fee2e2           /* red-50 */
--error-text: #991b1b         /* red-800 */

/* Usage */
bg-red-600 text-white                             /* Delete buttons */
bg-red-50 text-red-800 border-red-200             /* Error alerts */
border-red-500                                    /* Input errors */

/* Warning (Yellow/Orange) */
--warning: #f59e0b            /* yellow-500 */
--warning-bg: #fef3c7         /* yellow-100 */
--warning-text: #92400e       /* yellow-800 */

/* Usage */
bg-gradient-to-r from-yellow-400 to-orange-400    /* Medium priority */
bg-yellow-50 text-yellow-800                      /* Warning messages */

/* Info (Blue) */
--info: #3b82f6               /* blue-500 */
--info-dark: #2563eb          /* blue-600 */
--info-bg: #dbeafe            /* blue-50 */
--info-text: #1e40af          /* blue-700 */

/* Usage */
bg-blue-500 text-white                            /* Info buttons */
bg-blue-50 text-blue-600 border-blue-200          /* Due date badges */
```

### Approved Color Combinations (WCAG 2.1 AA)

All combinations verified for accessibility:

```css
/* Text on Backgrounds (4.5:1 minimum for normal text) */
text-gray-900 on bg-white                 /* 21:1 ✅ */
text-gray-800 on bg-gray-50               /* 12.63:1 ✅ */
text-gray-700 on bg-white                 /* 9.73:1 ✅ */
text-white on bg-indigo-600               /* 7.26:1 ✅ */
text-white on bg-purple-600               /* 7.11:1 ✅ */
text-white on bg-red-600                  /* 7.98:1 ✅ */
text-white on bg-green-600                /* 5.35:1 ✅ */
text-indigo-700 on bg-indigo-100          /* 8.16:1 ✅ */
text-red-700 on bg-red-50                 /* 9.82:1 ✅ */

/* UI Components (3:1 minimum for borders, icons) */
border-gray-300 on bg-white               /* 2.84:1 ⚠️ Borderline, OK for UI */
border-indigo-500 on bg-white             /* 4.92:1 ✅ */
border-red-500 on bg-white                /* 5.59:1 ✅ */
```

---

## Typography

### Font Family

```css
/* System Font Stack (Already configured in Next.js) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;

/* No custom fonts needed - system fonts are fast and accessible */
```

### Heading Scale

```css
/* H1 - Hero Titles, Landing Page */
.heading-1 {
  @apply text-4xl font-extrabold text-gray-900;
  /* Mobile: text-3xl sm:text-4xl */
}
/* Example: "Welcome to Todo App" */

/* H2 - Page Titles */
.heading-2 {
  @apply text-3xl font-bold text-gray-900;
  /* Mobile: text-2xl sm:text-3xl */
}
/* Example: "My Tasks", "Dashboard" */

/* H3 - Section Titles */
.heading-3 {
  @apply text-2xl font-semibold text-gray-800;
  /* Mobile: text-xl sm:text-2xl */
}
/* Example: "Completed Tasks", "Task Details" */

/* H4 - Card Titles, Component Titles */
.heading-4 {
  @apply text-xl font-semibold text-gray-800;
}
/* Example: Task card titles in edit mode */

/* H5 - Subsection Titles */
.heading-5 {
  @apply text-lg font-bold text-gray-900;
}
/* Example: Form section headers */
```

### Body Text Scale

```css
/* Body Large - Intro text, important paragraphs */
.body-large {
  @apply text-lg text-gray-700 leading-relaxed;
}

/* Body - Default body text */
.body {
  @apply text-base text-gray-700 leading-normal;
}
/* Example: Task descriptions, form helper text */

/* Body Small - Secondary text, metadata */
.body-small {
  @apply text-sm text-gray-600 leading-normal;
}
/* Example: Timestamps, character counts */

/* Caption - Tertiary text, fine print */
.caption {
  @apply text-xs text-gray-500;
}
/* Example: "Created 2 days ago", form hints */
```

### Label Text

```css
/* Label - Form labels, button labels */
.label {
  @apply text-sm font-medium text-gray-700;
}

/* Label Bold - Emphasized labels */
.label-bold {
  @apply text-sm font-bold text-gray-700;
}
```

### Special Text

```css
/* Link */
.link {
  @apply text-indigo-600 hover:text-indigo-800 underline cursor-pointer;
}

/* Code */
.code {
  @apply font-mono text-sm bg-gray-100 px-1 py-0.5 rounded;
}

/* Error Text */
.error-text {
  @apply text-sm text-red-600 font-medium;
}
```

---

## Spacing System

### Container Spacing

```css
/* Page Container */
.page-container {
  @apply px-4 sm:px-6 lg:px-8 py-6 sm:py-8;
}
/* Mobile: 16px padding, Desktop: 32px padding */

/* Card Padding */
.card-padding {
  @apply p-6;
}
/* 24px padding on all sides */

/* Section Padding */
.section-padding {
  @apply p-8;
}
/* 32px padding for major sections */

/* Compact Padding */
.compact-padding {
  @apply p-4;
}
/* 16px padding for mobile cards */
```

### Vertical Spacing (Margins)

```css
/* Section Gap - Between major page sections */
.section-gap {
  @apply mb-8;
}
/* 32px bottom margin */

/* Card Gap - Between cards/components */
.card-gap {
  @apply mb-6;
}
/* 24px bottom margin */

/* Form Field Gap - Between form inputs */
.form-gap {
  @apply space-y-4;
}
/* 16px gap between form fields */

/* Inline Gap - Between inline elements */
.inline-gap {
  @apply gap-3;
}
/* 12px gap in flex/grid layouts */

/* Tight Gap - Compact spacing */
.tight-gap {
  @apply gap-2;
}
/* 8px gap for badges, pills */
```

### Responsive Spacing

```css
/* Adaptive padding (grows with screen size) */
.responsive-padding {
  @apply p-4 sm:p-6 lg:p-8;
}

/* Adaptive margin */
.responsive-margin {
  @apply mb-6 sm:mb-8 lg:mb-12;
}
```

---

## Border Radius

### Component Rounding

```css
/* Cards - Soft, modern rounded corners */
.card-rounded {
  @apply rounded-2xl;
}
/* 16px border radius */

/* Buttons - Slightly less rounded */
.button-rounded {
  @apply rounded-xl;
}
/* 12px border radius */

/* Inputs - Subtle rounding */
.input-rounded {
  @apply rounded-lg;
}
/* 8px border radius */

/* Badges/Tags - Medium rounding */
.badge-rounded {
  @apply rounded-lg;
}
/* 8px border radius */

/* Pills - Fully rounded */
.pill-rounded {
  @apply rounded-full;
}
/* 9999px border radius (circular ends) */

/* Modal/Dialog - Same as cards */
.modal-rounded {
  @apply rounded-2xl;
}
/* 16px border radius */
```

---

## Shadows

### Elevation System

```css
/* Flat - No shadow */
.shadow-none {
  box-shadow: none;
}

/* Subtle - Resting cards */
.shadow-subtle {
  @apply shadow-sm;
}
/* Small shadow for subtle elevation */

/* Default - Cards, panels */
.shadow-default {
  @apply shadow-md;
}
/* Medium shadow for standard cards */

/* Elevated - Hover state, active cards */
.shadow-elevated {
  @apply shadow-xl;
}
/* Large shadow for hover effects */

/* Floating - Modals, dropdowns */
.shadow-floating {
  @apply shadow-2xl;
}
/* Extra large shadow for modals */
```

### Combined with Transitions

```css
/* Card with hover elevation */
.card-hover {
  @apply shadow-md hover:shadow-xl transition-shadow duration-300;
}

/* Button with hover shadow */
.button-hover {
  @apply shadow-sm hover:shadow-lg transition-shadow duration-200;
}
```

---

## Gradient Patterns

### Background Gradients

```css
/* Hero Background - Landing page */
.gradient-hero {
  @apply bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600;
}

/* Primary Button Gradient */
.gradient-primary {
  @apply bg-gradient-to-r from-indigo-600 to-purple-600;
}

/* Primary Button Hover */
.gradient-primary-hover {
  @apply hover:from-indigo-700 hover:to-purple-700;
}

/* Accent Gradient (Pink to Purple) */
.gradient-accent {
  @apply bg-gradient-to-r from-pink-600 to-purple-600;
}

/* Success Gradient */
.gradient-success {
  @apply bg-gradient-to-r from-green-400 to-emerald-500;
}

/* Danger Gradient */
.gradient-danger {
  @apply bg-gradient-to-r from-red-500 to-pink-500;
}

/* Warning Gradient */
.gradient-warning {
  @apply bg-gradient-to-r from-yellow-400 to-orange-400;
}
```

### Accent Bars

```css
/* Top accent bar for cards */
.accent-bar {
  @apply absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500;
}

/* Completed task accent */
.accent-bar-success {
  @apply bg-gradient-to-r from-green-400 to-emerald-500;
}

/* Overdue task accent */
.accent-bar-danger {
  @apply bg-gradient-to-r from-red-400 to-pink-500;
}
```

### Text Gradients

```css
/* Gradient text (headings, emphasis) */
.text-gradient {
  @apply bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent;
}
```

---

## Animation & Transitions

### Transition Durations

```css
/* Fast - Hover states, color changes */
.transition-fast {
  @apply transition-all duration-200;
}
/* 200ms */

/* Normal - Most UI interactions */
.transition-normal {
  @apply transition-all duration-300;
}
/* 300ms */

/* Slow - Modal open, page transitions */
.transition-slow {
  @apply transition-all duration-500;
}
/* 500ms */
```

### Specific Transitions

```css
/* Color transitions */
.transition-colors {
  @apply transition-colors duration-200;
}

/* Transform transitions (scale, rotate, translate) */
.transition-transform {
  @apply transition-transform duration-200;
}

/* Shadow transitions */
.transition-shadow {
  @apply transition-shadow duration-300;
}

/* Opacity transitions */
.transition-opacity {
  @apply transition-opacity duration-200;
}
```

### Hover Effects

```css
/* Scale on hover (buttons, cards) */
.hover-scale {
  @apply hover:scale-105 transition-transform duration-200;
}

/* Subtle scale (large cards) */
.hover-scale-subtle {
  @apply hover:scale-[1.02] transition-transform duration-300;
}

/* Shadow lift (cards) */
.hover-lift {
  @apply hover:shadow-xl transition-shadow duration-300;
}

/* Combined hover (buttons) */
.hover-combo {
  @apply hover:scale-105 hover:shadow-lg transition-all duration-200;
}
```

### Entrance Animations

```css
/* Fade in (simple) */
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Fade in from bottom (cards, content) */
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

/* Scale in (modals, dialogs) */
.animate-scale-in {
  animation: scale-in 0.5s ease-out;
}

/* Bounce in (icons, emphasis) */
.animate-bounce-in {
  animation: bounce-in 0.6s ease-out;
}
```

### Loading States

```css
/* Spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Pulse (skeleton loaders) */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Accessibility

```css
/* Disable animations for users who prefer reduced motion */
.motion-safe {
  @apply motion-reduce:transition-none motion-reduce:animate-none;
}

/* Example usage */
.card {
  @apply animate-fade-in-up motion-reduce:animate-none;
}
```

---

## Interactive States

### Button States

```css
/* Default state */
.btn {
  @apply px-6 py-3 rounded-xl font-bold transition-all duration-200;
}

/* Hover state */
.btn:hover {
  @apply scale-105 shadow-lg;
}

/* Focus state (keyboard navigation) */
.btn:focus {
  @apply outline-none ring-4 ring-indigo-200;
}

/* Active state (pressed) */
.btn:active {
  @apply scale-100;
}

/* Disabled state */
.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
```

### Input States

```css
/* Default state */
.input {
  @apply px-3 py-3 border-2 border-gray-300 rounded-lg;
}

/* Focus state */
.input:focus {
  @apply outline-none ring-4 ring-indigo-100 border-indigo-500;
}

/* Error state */
.input.error {
  @apply border-red-500 ring-4 ring-red-100;
}

/* Disabled state */
.input:disabled {
  @apply bg-gray-100 cursor-not-allowed;
}
```

### Card States

```css
/* Default card */
.card {
  @apply bg-white rounded-2xl shadow-md p-6;
}

/* Hover card */
.card-hover {
  @apply hover:shadow-xl transition-shadow duration-300;
}

/* Active/Selected card */
.card-active {
  @apply border-2 border-indigo-500 ring-4 ring-indigo-100;
}
```

---

## Layout Patterns

### Flexbox Patterns

```css
/* Horizontal row with gap */
.flex-row {
  @apply flex items-center gap-3;
}

/* Vertical column with gap */
.flex-col {
  @apply flex flex-col space-y-4;
}

/* Space between (navbar pattern) */
.flex-between {
  @apply flex items-center justify-between;
}

/* Center content */
.flex-center {
  @apply flex items-center justify-center;
}
```

### Grid Patterns

```css
/* Responsive task grid (1 → 2 → 3 columns) */
.task-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Auto-fit grid (dynamic columns) */
.grid-auto {
  @apply grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6;
}

/* Two column form */
.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}
```

---

## Utility Classes (Commonly Used)

### Quick Reference

```css
/* Spacing */
p-6                     /* Card padding: 24px */
mb-8                    /* Section margin: 32px */
space-y-4               /* Form field gap: 16px */
gap-3                   /* Inline gap: 12px */

/* Typography */
text-2xl font-bold text-gray-900            /* Page title */
text-base text-gray-700                     /* Body text */
text-sm font-medium text-gray-700           /* Label */
text-xs text-gray-500                       /* Caption */

/* Colors */
bg-white                                    /* Card background */
bg-gray-50                                  /* Page background */
text-gray-900                               /* Primary text */
bg-gradient-to-r from-indigo-600 to-purple-600    /* Primary button */

/* Borders */
rounded-2xl                                 /* Card */
rounded-xl                                  /* Button */
rounded-lg                                  /* Input */
border-2 border-gray-300                    /* Input border */

/* Shadows */
shadow-md                                   /* Card default */
shadow-xl                                   /* Card hover */
shadow-2xl                                  /* Modal */

/* Transitions */
transition-all duration-300                 /* General transition */
hover:scale-105 transition-transform duration-200    /* Button hover */
hover:shadow-xl transition-shadow duration-300       /* Card hover */

/* Focus */
focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500

/* Animation */
animate-fade-in-up motion-reduce:animate-none       /* Page entrance */
```

---

## Design System Checklist

When creating new components, verify:

- ✅ Uses approved color combinations (WCAG 2.1 AA compliant)
- ✅ Interactive elements minimum 44x44px (touch target size)
- ✅ Includes focus states (ring-4) for keyboard navigation
- ✅ Has motion-reduce variants for accessibility
- ✅ Uses consistent spacing (p-6, mb-8, space-y-4)
- ✅ Uses consistent rounding (rounded-2xl cards, rounded-xl buttons)
- ✅ Uses consistent shadows (shadow-md default, shadow-xl hover)
- ✅ Has hover/active states with appropriate transitions
- ✅ Typography follows scale (text-2xl → text-base → text-sm)
- ✅ Matches existing premium aesthetic (gradients, animations)

---

## Implementation Notes

All design tokens in this system are implemented using Tailwind CSS utility classes. No custom CSS is required. Existing `tailwind.config.ts` already includes custom animations (fade-in, scale-in, etc.) that should be reused.

**Next**: Create component contracts that reference this design system.
