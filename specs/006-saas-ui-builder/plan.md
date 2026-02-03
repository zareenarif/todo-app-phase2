# Implementation Plan: SaaS UI Builder

**Branch**: `006-saas-ui-builder` | **Date**: 2026-01-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-saas-ui-builder/spec.md`

## Summary

Build a comprehensive SaaS UI component library for Next.js + Tailwind CSS that generates consistent, professional UI components following the established design system (indigo/purple gradients, card-based layouts, dark mode support). The library extracts patterns already proven in the existing codebase (landing page, dashboard, analytics) into reusable, typed components.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), React 18, Tailwind CSS 3.x
**Storage**: N/A (UI library, no persistence)
**Testing**: Jest + React Testing Library, Storybook for visual testing
**Target Platform**: Web (browsers: Chrome, Firefox, Safari, Edge)
**Project Type**: Frontend component library within existing web application
**Performance Goals**: Lighthouse performance >= 80, accessibility >= 90
**Constraints**: Zero external UI dependencies, Tailwind-only styling, < 50KB total bundle impact
**Scale/Scope**: ~15 components, 3 page templates, 1 design token system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Specification Before Implementation | ✅ PASS | spec.md completed with 6 user stories, 16 requirements |
| II. Planning Before Coding | ✅ PASS | This plan document with research, data model, contracts |
| III. Tasks Before Execution | ⏳ PENDING | Will be generated via /sp.tasks |
| IV. Simplicity Over Complexity | ✅ PASS | Uses existing patterns, no new dependencies |
| V. Scope Discipline | ✅ PASS | Explicitly scoped to UI components only |
| VI. Security by Design | ✅ PASS | Frontend-only, no auth/data concerns |
| VII. Stateless Authentication | N/A | Not applicable to UI library |
| VIII. User Data Isolation | N/A | Not applicable to UI library |

**Technology Stack Compliance:**
- ✅ Next.js App Router: All components use 'use client' where needed
- ✅ TypeScript: All interfaces defined in data-model.md
- ✅ Tailwind CSS: Only Tailwind classes, no CSS-in-JS
- ✅ No additional dependencies required

## Project Structure

### Documentation (this feature)

```text
specs/006-saas-ui-builder/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research findings
├── data-model.md        # Component interfaces and types
├── quickstart.md        # Developer usage guide
├── checklist.md         # Quality validation checklist
├── contracts/           # Component API contracts
│   └── components.md    # All component contracts
└── tasks.md             # Implementation tasks (via /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── components/
│   ├── ui/                    # Atomic components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Textarea.tsx
│   │   └── index.ts
│   │
│   ├── dashboard/             # Dashboard-specific components
│   │   ├── StatsCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── Pagination.tsx
│   │   └── index.ts
│   │
│   ├── landing/               # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   │
│   └── layout/                # Layout components (existing + enhanced)
│       ├── AppLayout.tsx      # Existing
│       ├── DashboardLayout.tsx
│       ├── Sidebar.tsx
│       ├── Navbar.tsx
│       └── index.ts
│
├── lib/
│   └── types/
│       └── components.ts      # Shared component types
│
└── app/
    └── globals.css            # Custom animations (existing)
```

**Structure Decision**: Feature-based organization within `frontend/components/` grouped by domain (ui, dashboard, landing, layout). This aligns with existing project structure and enables tree-shaking for optimal bundle size.

## Complexity Tracking

No complexity violations detected. The implementation:
- Uses existing Tailwind CSS (no new dependencies)
- Follows established patterns from existing codebase
- Adds no backend changes
- Requires no database modifications

## Implementation Phases

### Phase 1: Atomic Components (ui/)

Priority: **P1** (Foundation for all other components)

1. **Button** - Primary, secondary, ghost, danger, outline variants
2. **Input** - Text input with label, error, addon support
3. **Card** - Container with header/footer composition
4. **Modal** - Accessible dialog with backdrop and animations
5. **Select** - Styled dropdown
6. **Checkbox** - Styled checkbox with label
7. **Textarea** - Multi-line input

Dependencies: None (base layer)

### Phase 2: Dashboard Components

Priority: **P1** (Core dashboard functionality)

1. **StatsCard** - Metrics display with icon and trend
2. **DataTable** - Sortable, selectable table with pagination
3. **Pagination** - Page navigation component

Dependencies: Phase 1 (Button, Card)

### Phase 3: Landing Components

Priority: **P1** (Marketing pages)

1. **Hero** - Main landing section with CTAs
2. **Features** - Feature grid with icons
3. **Testimonials** - Customer quotes display
4. **Pricing** - Pricing tier cards
5. **Footer** - Site footer with links

Dependencies: Phase 1 (Button, Card)

### Phase 4: Layout Components

Priority: **P2** (Enhanced navigation)

1. **DashboardLayout** - Sidebar + header + content area
2. **Sidebar** - Collapsible navigation sidebar
3. **Navbar** - Enhanced navigation bar

Dependencies: Phase 1 (Button)

### Phase 5: Integration & Documentation

Priority: **P2** (Polish)

1. Export index files for all component groups
2. Type exports for external usage
3. Storybook stories (optional)
4. Update existing pages to use new components

Dependencies: All previous phases

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Bundle size increase | Medium | Low | Tree-shaking, lazy loading |
| Breaking existing pages | Low | High | Gradual migration, backward compat |
| Dark mode inconsistencies | Low | Medium | Design token enforcement |
| Accessibility gaps | Medium | High | ARIA audit, Lighthouse testing |

## Architecture Decision Suggestions

📋 **Architectural decision detected**: Component library organization pattern (Atomic Design vs Feature-based). Document reasoning and tradeoffs? Run `/sp.adr component-organization-pattern`

📋 **Architectural decision detected**: No external UI library dependency (vs shadcn/ui, Radix). Document reasoning and tradeoffs? Run `/sp.adr no-external-ui-deps`

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lighthouse Accessibility | >= 90 | Automated audit |
| Lighthouse Performance | >= 80 | Automated audit |
| Bundle size impact | < 50KB | Build analysis |
| Component coverage | 15 components | Manual count |
| TypeScript strict | 100% | Build passes |
| Dark mode support | 100% | Visual testing |

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Implement Phase 1 (Atomic Components) first
3. Test with existing pages before Phase 2
4. Document ADRs for significant decisions
