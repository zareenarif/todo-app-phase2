# Component API Contracts

**Feature**: 006-saas-ui-builder
**Date**: 2026-01-21

## Contract Overview

This document defines the public API surface for each component. These contracts serve as the interface specification that implementations must satisfy.

---

## Atomic Components (ui/)

### Button

**File**: `frontend/components/ui/Button.tsx`

**Import**: `import { Button } from '@/components/ui'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'outline'` | `'primary'` | No | Visual style |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Button size |
| loading | `boolean` | `false` | No | Shows loading spinner |
| fullWidth | `boolean` | `false` | No | Full container width |
| leftIcon | `ReactNode` | - | No | Icon before text |
| rightIcon | `ReactNode` | - | No | Icon after text |
| disabled | `boolean` | `false` | No | Disables interaction |
| children | `ReactNode` | - | Yes | Button content |

**Usage**:
```tsx
<Button variant="primary" size="lg" loading={isSubmitting}>
  Submit
</Button>
```

---

### Input

**File**: `frontend/components/ui/Input.tsx`

**Import**: `import { Input } from '@/components/ui'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| label | `string` | - | No | Input label |
| helperText | `string` | - | No | Helper text below |
| error | `string` | - | No | Error message |
| leftAddon | `ReactNode` | - | No | Left addon |
| rightAddon | `ReactNode` | - | No | Right addon |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | No | Input size |

**Usage**:
```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  leftAddon={<MailIcon />}
/>
```

---

### Card

**File**: `frontend/components/ui/Card.tsx`

**Import**: `import { Card, CardHeader, CardFooter } from '@/components/ui'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `'elevated' \| 'outlined' \| 'filled'` | `'elevated'` | No | Card style |
| padding | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | No | Internal padding |
| interactive | `boolean` | `false` | No | Hover effects |
| children | `ReactNode` | - | Yes | Card content |

**Usage**:
```tsx
<Card variant="elevated" padding="lg">
  <CardHeader title="Card Title" subtitle="Subtitle" />
  <p>Card content here</p>
  <CardFooter align="right">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## Dashboard Components

### StatsCard

**File**: `frontend/components/dashboard/StatsCard.tsx`

**Import**: `import { StatsCard } from '@/components/dashboard'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| title | `string` | - | Yes | Metric title |
| value | `string \| number` | - | Yes | Metric value |
| icon | `ReactNode` | - | No | Icon element |
| iconGradient | `{ from: string; to: string }` | indigo→purple | No | Icon bg gradient |
| trend | `{ value: number; direction: 'up' \| 'down' \| 'neutral' }` | - | No | Trend indicator |
| footer | `ReactNode` | - | No | Footer content |

**Usage**:
```tsx
<StatsCard
  title="Total Revenue"
  value="$45,231"
  icon={<DollarIcon />}
  trend={{ value: 12.5, direction: 'up' }}
/>
```

---

### DataTable

**File**: `frontend/components/dashboard/DataTable.tsx`

**Import**: `import { DataTable } from '@/components/dashboard'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| data | `T[]` | - | Yes | Table data array |
| columns | `Column<T>[]` | - | Yes | Column definitions |
| rowKey | `keyof T \| ((row: T) => string)` | - | Yes | Row key extractor |
| loading | `boolean` | `false` | No | Loading state |
| emptyState | `ReactNode` | Default message | No | Empty state UI |
| sort | `{ key: string; direction: 'asc' \| 'desc' }` | - | No | Current sort |
| onSortChange | `(key, direction) => void` | - | No | Sort handler |
| onRowClick | `(row, index) => void` | - | No | Row click handler |
| selectable | `boolean` | `false` | No | Row selection |
| selectedKeys | `string[]` | `[]` | No | Selected rows |
| onSelectionChange | `(keys) => void` | - | No | Selection handler |

**Column Definition**:
```typescript
interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value, row, index) => ReactNode;
  align?: 'left' | 'center' | 'right';
}
```

**Usage**:
```tsx
<DataTable
  data={users}
  rowKey="id"
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (v) => <Badge>{v}</Badge> }
  ]}
  sort={{ key: 'name', direction: 'asc' }}
  onSortChange={handleSort}
/>
```

---

## Layout Components

### Sidebar

**File**: `frontend/components/layout/Sidebar.tsx`

**Import**: `import { Sidebar } from '@/components/layout'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| items | `NavItem[]` | - | Yes | Navigation items |
| activeKey | `string` | - | No | Active item key |
| collapsed | `boolean` | `false` | No | Collapsed state |
| onToggleCollapse | `() => void` | - | No | Toggle handler |
| logo | `ReactNode` | - | No | Logo element |
| footer | `ReactNode` | - | No | Footer content |

**NavItem Definition**:
```typescript
interface NavItem {
  key: string;
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
}
```

---

### Modal

**File**: `frontend/components/ui/Modal.tsx`

**Import**: `import { Modal } from '@/components/ui'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| isOpen | `boolean` | - | Yes | Open state |
| onClose | `() => void` | - | Yes | Close handler |
| title | `string` | - | No | Modal title |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | No | Modal size |
| closeOnBackdropClick | `boolean` | `true` | No | Backdrop closes |
| closeOnEscape | `boolean` | `true` | No | Escape key closes |
| showCloseButton | `boolean` | `true` | No | Show X button |
| children | `ReactNode` | - | Yes | Modal content |
| footer | `ReactNode` | - | No | Footer content |

**Usage**:
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="ghost" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm}>Delete</Button>
    </>
  }
>
  <p>Are you sure you want to delete this item?</p>
</Modal>
```

---

## Landing Page Components

### Hero

**File**: `frontend/components/landing/Hero.tsx`

**Import**: `import { Hero } from '@/components/landing'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| headline | `string` | - | Yes | Main headline |
| subheadline | `string` | - | No | Supporting text |
| primaryCta | `{ label: string; href: string }` | - | No | Primary CTA |
| secondaryCta | `{ label: string; href: string }` | - | No | Secondary CTA |
| image | `ReactNode` | - | No | Hero image |
| variant | `'centered' \| 'split' \| 'image-right'` | `'centered'` | No | Layout |

---

### Features

**File**: `frontend/components/landing/Features.tsx`

**Import**: `import { Features } from '@/components/landing'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| headline | `string` | - | No | Section headline |
| subheadline | `string` | - | No | Section subheadline |
| features | `FeatureItem[]` | - | Yes | Feature items |
| columns | `2 \| 3 \| 4` | `3` | No | Grid columns |

---

### Pricing

**File**: `frontend/components/landing/Pricing.tsx`

**Import**: `import { Pricing } from '@/components/landing'`

**Props Contract**:
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| headline | `string` | - | No | Section headline |
| tiers | `PricingTier[]` | - | Yes | Pricing tiers |

**PricingTier Definition**:
```typescript
interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}
```

---

## Export Index

**File**: `frontend/components/ui/index.ts`
```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Card, CardHeader, CardFooter } from './Card';
export { Modal } from './Modal';
export { Select } from './Select';
export { Checkbox } from './Checkbox';
export { Textarea } from './Textarea';
```

**File**: `frontend/components/dashboard/index.ts`
```typescript
export { StatsCard } from './StatsCard';
export { DataTable } from './DataTable';
```

**File**: `frontend/components/layout/index.ts`
```typescript
export { Sidebar } from './Sidebar';
export { Navbar } from './Navbar';
export { AppLayout } from './AppLayout';
export { DashboardLayout } from './DashboardLayout';
```

**File**: `frontend/components/landing/index.ts`
```typescript
export { Hero } from './Hero';
export { Features } from './Features';
export { Testimonials } from './Testimonials';
export { Pricing } from './Pricing';
export { Footer } from './Footer';
```
