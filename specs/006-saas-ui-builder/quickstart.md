# Quickstart: SaaS UI Builder

**Feature**: 006-saas-ui-builder
**Date**: 2026-01-21

## Overview

This guide helps developers quickly generate and use SaaS-styled UI components in their Next.js + Tailwind projects.

## Prerequisites

- Next.js 14+ with App Router
- Tailwind CSS configured
- TypeScript enabled

## Quick Setup

### 1. Verify Tailwind Configuration

Ensure your `tailwind.config.js` includes the design tokens:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Design system is built into Tailwind defaults
      // Indigo and purple are available by default
    },
  },
  plugins: [],
}
```

### 2. Add Custom Animations to globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
```

## Component Usage Examples

### Button

```tsx
import { Button } from '@/components/ui';

// Primary button with gradient
<Button variant="primary" size="lg">
  Get Started
</Button>

// Secondary ghost button
<Button variant="ghost" size="md">
  Learn More
</Button>

// Loading state
<Button loading={isSubmitting}>
  Submit
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardFooter } from '@/components/ui';

<Card variant="elevated" padding="lg">
  <CardHeader
    title="Card Title"
    subtitle="Supporting text"
    action={<Button size="sm">Action</Button>}
  />
  <p className="text-gray-600 dark:text-gray-400">
    Card content goes here.
  </p>
  <CardFooter align="right">
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

### StatsCard

```tsx
import { StatsCard } from '@/components/dashboard';

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <StatsCard
    title="Total Users"
    value="12,345"
    icon="👥"
    trend={{ value: 12.5, direction: 'up' }}
  />
  <StatsCard
    title="Revenue"
    value="$45,231"
    icon="💰"
    iconGradient={{ from: 'green-500', to: 'emerald-500' }}
    trend={{ value: 8.2, direction: 'up' }}
  />
  <StatsCard
    title="Active Now"
    value="573"
    icon="🔥"
    iconGradient={{ from: 'red-500', to: 'pink-500' }}
  />
</div>
```

### DataTable

```tsx
import { DataTable } from '@/components/dashboard';

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {value}
      </span>
    )
  },
];

<DataTable
  data={users}
  columns={columns}
  rowKey="id"
  sort={{ key: 'name', direction: 'asc' }}
  onSortChange={(key, dir) => setSort({ key, direction: dir })}
  onRowClick={(row) => router.push(`/users/${row.id}`)}
/>
```

### Modal

```tsx
import { Modal } from '@/components/ui';

<Modal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  title="Confirm Delete"
  size="sm"
  footer={
    <div className="flex gap-3 justify-end">
      <Button variant="ghost" onClick={() => setShowConfirm(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  }
>
  <p className="text-gray-600 dark:text-gray-400">
    Are you sure you want to delete this item? This action cannot be undone.
  </p>
</Modal>
```

## Page Templates

### Landing Page Structure

```tsx
// app/page.tsx
import { Hero, Features, Testimonials, Pricing, Footer } from '@/components/landing';
import { Navbar } from '@/components/layout';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar logo={<Logo />} />
      <Hero
        headline="Build Something Amazing"
        subheadline="The fastest way to ship your next project"
        primaryCta={{ label: 'Get Started', href: '/register' }}
        secondaryCta={{ label: 'Learn More', href: '#features' }}
      />
      <Features
        headline="Everything You Need"
        features={featuresData}
        columns={3}
      />
      <Testimonials testimonials={testimonialsData} />
      <Pricing tiers={pricingTiers} />
      <Footer />
    </div>
  );
}
```

### Dashboard Page Structure

```tsx
// app/(protected)/dashboard/page.tsx
import { DashboardLayout } from '@/components/layout';
import { StatsCard, DataTable } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Tasks" value={stats.total} icon="📋" />
          <StatsCard title="Completed" value={stats.completed} icon="✅" />
          <StatsCard title="In Progress" value={stats.pending} icon="🔄" />
          <StatsCard title="Overdue" value={stats.overdue} icon="⚠️" />
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader title="Recent Tasks" />
          <DataTable data={tasks} columns={taskColumns} rowKey="id" />
        </Card>
      </div>
    </DashboardLayout>
  );
}
```

## Design Patterns

### Gradient Text

```tsx
<h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
  Gradient Heading
</h1>
```

### Glassmorphism Card

```tsx
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white dark:border-gray-700 p-6">
  Content
</div>
```

### Primary Gradient Button

```tsx
<button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
  Click Me
</button>
```

### Icon Container

```tsx
<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
  <span className="text-2xl">🎯</span>
</div>
```

## Dark Mode

Components automatically support dark mode using Tailwind's `dark:` variant:

```tsx
// Wrap your app with theme provider
import { ThemeProvider } from 'next-themes';

function App({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
```

Toggle dark mode:

```tsx
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

## Responsive Design

All components are mobile-first. Use Tailwind breakpoints:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Cards adapt to screen size */}
</div>
```

## Next Steps

1. Review component contracts in `specs/006-saas-ui-builder/contracts/`
2. Generate tasks with `/sp.tasks`
3. Implement components following the contracts
4. Test with Lighthouse for accessibility and performance
