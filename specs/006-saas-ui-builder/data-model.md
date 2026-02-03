# Data Model: SaaS UI Builder Component Interfaces

**Feature**: 006-saas-ui-builder
**Date**: 2026-01-21
**Status**: Complete

## Overview

This document defines the TypeScript interfaces and types for all SaaS UI Builder components. These serve as the "data model" for the component library.

## Design Tokens

### Color Palette

```typescript
// Design token types
type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

interface DesignTokens {
  colors: {
    primary: {
      gradient: {
        from: 'indigo-600';
        to: 'purple-600';
      };
      solid: 'indigo-600';
    };
    success: 'green-500' | 'emerald-500';
    warning: 'yellow-500' | 'amber-500';
    danger: 'red-500' | 'pink-500';
    neutral: {
      light: `gray-${ColorScale}`;
      dark: `gray-${ColorScale}`;
    };
  };
  shadows: 'shadow-sm' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl';
  radius: 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  spacing: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
  animation: {
    duration: '150' | '200' | '300' | '500';
    easing: 'ease-in' | 'ease-out' | 'ease-in-out';
  };
}
```

### Typography Scale

```typescript
interface TypographyTokens {
  fontFamily: {
    sans: 'system-ui, -apple-system, sans-serif';
    mono: 'ui-monospace, monospace';
  };
  fontSize: {
    xs: '0.75rem';    // 12px
    sm: '0.875rem';   // 14px
    base: '1rem';     // 16px
    lg: '1.125rem';   // 18px
    xl: '1.25rem';    // 20px
    '2xl': '1.5rem';  // 24px
    '3xl': '1.875rem';// 30px
    '4xl': '2.25rem'; // 36px
    '5xl': '3rem';    // 48px
  };
  fontWeight: {
    normal: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
    extrabold: '800';
  };
}
```

## Component Interfaces

### 1. Button Component

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';

  /** Whether button shows loading spinner */
  loading?: boolean;

  /** Whether button takes full width */
  fullWidth?: boolean;

  /** Left icon element */
  leftIcon?: React.ReactNode;

  /** Right icon element */
  rightIcon?: React.ReactNode;

  /** Button content */
  children: React.ReactNode;
}

// Default values
const buttonDefaults: Partial<ButtonProps> = {
  variant: 'primary',
  size: 'md',
  loading: false,
  fullWidth: false,
};
```

### 2. Input Component

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;

  /** Helper text below input */
  helperText?: string;

  /** Error message (shows error state when present) */
  error?: string;

  /** Left addon/icon */
  leftAddon?: React.ReactNode;

  /** Right addon/icon */
  rightAddon?: React.ReactNode;

  /** Input size */
  size?: 'sm' | 'md' | 'lg';
}
```

### 3. Card Component

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: 'elevated' | 'outlined' | 'filled';

  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /** Whether card is interactive (hover effects) */
  interactive?: boolean;

  /** Card content */
  children: React.ReactNode;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}
```

### 4. StatsCard Component

```typescript
interface StatsCardProps {
  /** Metric title */
  title: string;

  /** Metric value (number or formatted string) */
  value: string | number;

  /** Icon element or emoji */
  icon?: React.ReactNode;

  /** Icon background gradient colors */
  iconGradient?: {
    from: string;
    to: string;
  };

  /** Trend indicator */
  trend?: {
    value: number;  // Percentage change
    direction: 'up' | 'down' | 'neutral';
  };

  /** Footer text or link */
  footer?: React.ReactNode;
}
```

### 5. DataTable Component

```typescript
interface Column<T> {
  /** Unique column key */
  key: keyof T | string;

  /** Column header text */
  header: string;

  /** Column width */
  width?: string | number;

  /** Whether column is sortable */
  sortable?: boolean;

  /** Custom cell renderer */
  render?: (value: any, row: T, index: number) => React.ReactNode;

  /** Cell alignment */
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends Record<string, any>> {
  /** Table data */
  data: T[];

  /** Column definitions */
  columns: Column<T>[];

  /** Row key extractor */
  rowKey: keyof T | ((row: T) => string);

  /** Whether table shows loading state */
  loading?: boolean;

  /** Empty state content */
  emptyState?: React.ReactNode;

  /** Current sort configuration */
  sort?: {
    key: string;
    direction: 'asc' | 'desc';
  };

  /** Sort change handler */
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;

  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;

  /** Whether rows are selectable */
  selectable?: boolean;

  /** Selected row keys */
  selectedKeys?: string[];

  /** Selection change handler */
  onSelectionChange?: (keys: string[]) => void;
}

interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;

  /** Total number of pages */
  totalPages: number;

  /** Page change handler */
  onPageChange: (page: number) => void;

  /** Items per page options */
  pageSizeOptions?: number[];

  /** Current page size */
  pageSize?: number;

  /** Page size change handler */
  onPageSizeChange?: (size: number) => void;
}
```

### 6. Modal Component

```typescript
interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;

  /** Close handler */
  onClose: () => void;

  /** Modal title */
  title?: string;

  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /** Whether clicking backdrop closes modal */
  closeOnBackdropClick?: boolean;

  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean;

  /** Whether to show close button */
  showCloseButton?: boolean;

  /** Modal content */
  children: React.ReactNode;

  /** Footer content (typically action buttons) */
  footer?: React.ReactNode;
}
```

### 7. Navigation Components

```typescript
interface NavItem {
  /** Unique key */
  key: string;

  /** Display label */
  label: string;

  /** Route path */
  href: string;

  /** Icon element */
  icon?: React.ReactNode;

  /** Badge content */
  badge?: string | number;

  /** Nested items */
  children?: NavItem[];
}

interface SidebarProps {
  /** Navigation items */
  items: NavItem[];

  /** Currently active item key */
  activeKey?: string;

  /** Whether sidebar is collapsed */
  collapsed?: boolean;

  /** Collapse toggle handler */
  onToggleCollapse?: () => void;

  /** Logo element */
  logo?: React.ReactNode;

  /** Footer content */
  footer?: React.ReactNode;
}

interface NavbarProps {
  /** Logo element */
  logo?: React.ReactNode;

  /** Navigation items */
  items?: NavItem[];

  /** Right side content (user menu, etc.) */
  rightContent?: React.ReactNode;

  /** Whether navbar is sticky */
  sticky?: boolean;

  /** Whether navbar has border */
  bordered?: boolean;
}
```

### 8. Form Components

```typescript
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Select label */
  label?: string;

  /** Options array */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;

  /** Placeholder text */
  placeholder?: string;

  /** Error message */
  error?: string;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Checkbox label */
  label?: string;

  /** Whether indeterminate state */
  indeterminate?: boolean;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Textarea label */
  label?: string;

  /** Helper text */
  helperText?: string;

  /** Error message */
  error?: string;

  /** Whether textarea auto-resizes */
  autoResize?: boolean;
}
```

### 9. Landing Page Components

```typescript
interface HeroProps {
  /** Main headline */
  headline: string;

  /** Subheadline text */
  subheadline?: string;

  /** Primary CTA button */
  primaryCta?: {
    label: string;
    href: string;
  };

  /** Secondary CTA button */
  secondaryCta?: {
    label: string;
    href: string;
  };

  /** Hero image/illustration */
  image?: React.ReactNode;

  /** Layout variant */
  variant?: 'centered' | 'split' | 'image-right';
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesProps {
  /** Section headline */
  headline?: string;

  /** Section subheadline */
  subheadline?: string;

  /** Feature items */
  features: FeatureItem[];

  /** Grid columns */
  columns?: 2 | 3 | 4;
}

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialsProps {
  /** Section headline */
  headline?: string;

  /** Testimonial items */
  testimonials: TestimonialItem[];

  /** Display variant */
  variant?: 'grid' | 'carousel';
}

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: {
    label: string;
    href: string;
  };
  highlighted?: boolean;
}

interface PricingProps {
  /** Section headline */
  headline?: string;

  /** Pricing tiers */
  tiers: PricingTier[];
}
```

## State Management Types

```typescript
// Theme state
interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  setMode: (mode: 'light' | 'dark' | 'system') => void;
}

// Toast/notification state
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}
```

## Validation Rules

| Component | Field | Rule |
|-----------|-------|------|
| Button | children | Required, non-empty |
| Input | label | Required when standalone |
| Card | children | Required |
| StatsCard | title | Required, max 50 chars |
| StatsCard | value | Required |
| DataTable | data | Required array |
| DataTable | columns | Required, min 1 column |
| Modal | isOpen | Required boolean |
| Modal | onClose | Required function |

## Component Relationships

```
App
├── ThemeProvider
│   └── ToastProvider
│       ├── Landing Page
│       │   ├── Navbar
│       │   ├── Hero
│       │   ├── Features
│       │   ├── Testimonials
│       │   ├── Pricing
│       │   └── Footer
│       │
│       └── Dashboard
│           ├── Sidebar
│           ├── Navbar (dashboard variant)
│           └── Content Area
│               ├── StatsCard[]
│               ├── DataTable
│               ├── Card[]
│               └── Modal (conditional)
```
