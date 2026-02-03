# Research: SaaS UI Builder (Next.js + Tailwind)

**Feature**: 006-saas-ui-builder
**Date**: 2026-01-21
**Status**: Complete

## Research Questions Resolved

### 1. Component Architecture Pattern

**Decision**: Atomic Design with Composition Pattern

**Rationale**:
- Atomic Design (atoms → molecules → organisms → templates → pages) provides clear hierarchy
- Composition pattern allows flexible component assembly without prop drilling
- Aligns with React best practices and Next.js App Router patterns

**Alternatives Considered**:
- Monolithic components: Rejected due to poor reusability and maintenance
- CSS-in-JS (styled-components): Rejected in favor of Tailwind for better performance and smaller bundle size
- Component libraries (Radix, shadcn/ui): Could be used as foundation but adds dependencies

### 2. Design Token Management

**Decision**: Tailwind CSS Configuration + CSS Custom Properties

**Rationale**:
- Tailwind's `tailwind.config.js` serves as the single source of truth for design tokens
- CSS custom properties enable runtime theme switching (dark mode)
- No additional runtime cost compared to CSS-in-JS solutions
- Consistent with existing project patterns

**Alternatives Considered**:
- Style Dictionary: Overkill for single-project use case
- Theme UI: Adds runtime overhead and complexity
- Pure CSS variables: Less type-safe, harder to maintain

### 3. Dark Mode Implementation

**Decision**: Tailwind `dark:` Variant with Class Strategy

**Rationale**:
- Class-based strategy (`class="dark"` on html/body) provides explicit control
- Works with Next.js `next-themes` library for persistence
- No flash of unstyled content (FOUC) when properly implemented
- Aligns with FR-003 requirement

**Alternatives Considered**:
- Media query strategy: No user preference persistence
- CSS custom properties only: More complex to implement consistently

### 4. Animation Strategy

**Decision**: Tailwind CSS Animations + Custom Keyframes in globals.css

**Rationale**:
- Tailwind provides basic transitions (`transition-all`, `duration-300`)
- Custom keyframes in globals.css for complex animations (fade-in-up, scale-in)
- No JavaScript animation library needed (reduces bundle size)
- Respects `prefers-reduced-motion` via Tailwind's `motion-reduce:` variant

**Alternatives Considered**:
- Framer Motion: Powerful but adds ~20KB to bundle
- CSS Modules: Fragments styling across files
- Headless UI Transition: Good for specific use cases but limited

### 5. Responsive Design Approach

**Decision**: Mobile-First with Tailwind Breakpoints

**Rationale**:
- Tailwind's mobile-first breakpoints (sm, md, lg, xl, 2xl) are industry standard
- Mobile-first ensures core functionality works on all devices
- Breakpoint values align with common device sizes

**Breakpoints Used**:
- Base (0px): Mobile phones
- `sm` (640px): Large phones, small tablets
- `md` (768px): Tablets
- `lg` (1024px): Laptops
- `xl` (1280px): Desktops
- `2xl` (1536px): Large desktops

### 6. Accessibility Patterns

**Decision**: ARIA-first with Semantic HTML Foundation

**Rationale**:
- Semantic HTML provides baseline accessibility
- ARIA attributes enhance screen reader experience
- Focus management through `focus-visible` and `focus-within`
- Color contrast meets WCAG 2.1 AA standards

**Key Patterns**:
- Interactive elements: `role`, `aria-label`, `aria-expanded`, `aria-controls`
- Forms: `aria-invalid`, `aria-describedby` for error states
- Modals: `aria-modal`, focus trapping, escape key handling
- Tables: `scope` attributes on headers

### 7. Component Props Interface Pattern

**Decision**: TypeScript Interfaces with Optional Props + Defaults

**Rationale**:
- TypeScript provides compile-time safety
- Optional props with sensible defaults reduce boilerplate
- Discriminated unions for variant props (size, color)
- Extends React's HTMLAttributes for DOM prop forwarding

**Pattern**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}
```

### 8. File Organization

**Decision**: Feature-based Organization within components/

**Rationale**:
- Groups related components together
- Easy to locate and maintain
- Supports code splitting by feature
- Aligns with existing project structure

**Structure**:
```
frontend/components/
├── ui/                    # Atomic components (buttons, inputs)
│   ├── Button.tsx
│   ├── Input.tsx
│   └── index.ts
├── layout/               # Layout components
│   ├── AppLayout.tsx
│   ├── DashboardLayout.tsx
│   └── index.ts
├── landing/              # Landing page components
│   ├── Hero.tsx
│   ├── Features.tsx
│   └── index.ts
└── dashboard/            # Dashboard components
    ├── StatsCard.tsx
    ├── DataTable.tsx
    └── index.ts
```

## Technology Validation

### Existing Project Compatibility

| Technology | Status | Notes |
|------------|--------|-------|
| Next.js 14+ (App Router) | ✅ Verified | Project uses App Router |
| TypeScript | ✅ Verified | Strict mode enabled |
| Tailwind CSS | ✅ Verified | Already configured |
| Dark Mode | ✅ Verified | Using class strategy |
| Responsive | ✅ Verified | Mobile-first patterns exist |

### Design System Validation

| Token | Current Value | Source |
|-------|---------------|--------|
| Primary gradient start | indigo-600 (#4F46E5) | globals.css, page.tsx |
| Primary gradient end | purple-600 (#9333EA) | globals.css, page.tsx |
| Card background (light) | white with opacity | Existing components |
| Card background (dark) | gray-800 with opacity | Existing components |
| Border radius (cards) | rounded-2xl | Existing components |
| Shadow (cards) | shadow-lg | Existing components |
| Animation duration | 300ms | globals.css |

## Best Practices Identified

### From Existing Codebase

1. **Gradient Text Pattern**:
   ```jsx
   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
   ```

2. **Card Container Pattern**:
   ```jsx
   <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white dark:border-gray-700">
   ```

3. **Stats Card Pattern**:
   ```jsx
   <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
   ```

4. **Button Primary Pattern**:
   ```jsx
   <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
   ```

5. **Input Pattern**:
   ```jsx
   <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
   ```

## Conclusion

All research questions have been resolved. The SaaS UI Builder skill will:
- Use Atomic Design with Composition Pattern
- Leverage Tailwind CSS for all styling
- Support dark mode via class strategy
- Follow mobile-first responsive design
- Maintain accessibility through semantic HTML and ARIA
- Organize components by feature domain

No NEEDS CLARIFICATION items remain. Ready for Phase 1.
