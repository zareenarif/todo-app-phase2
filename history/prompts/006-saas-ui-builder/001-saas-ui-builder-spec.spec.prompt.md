---
id: 001
title: SaaS UI Builder Specification
stage: spec
date: 2026-01-21
surface: agent
model: claude-opus-4-5-20251101
feature: saas-ui-builder
branch: 006-saas-ui-builder
user: DC
command: /sp.specify
labels: ["specification", "ui-builder", "saas", "next.js", "tailwind"]
links:
  spec: specs/006-saas-ui-builder/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/006-saas-ui-builder/spec.md
  - specs/006-saas-ui-builder/checklist.md
tests:
  - N/A - specification phase
---

## Prompt

/sp.specify

Skill: SaaS UI Builder (Next.js + Tailwind)

A specialized skill/template for generating consistent, professional SaaS-style UI components and pages using Next.js and Tailwind CSS.

Design standards:
- Indigo/purple gradient color scheme
- Card-based layouts
- Soft gradients and shadows
- Dark mode support
- Responsive design patterns

## Response snapshot

Created comprehensive specification for SaaS UI Builder skill with:

1. **6 User Stories** (prioritized P1-P3):
   - P1: Landing Page Component generation
   - P1: Dashboard Layout generation
   - P2: Stats/Metrics Cards
   - P2: Data Tables
   - P2: Form Components
   - P3: Modal/Dialog Components

2. **Requirements**:
   - 10 Functional Requirements (FR-001 to FR-010)
   - 6 Design System Requirements (DS-001 to DS-006)
   - Key entities defined (Component, Page, Design Token)

3. **Design System**:
   - Colors: Indigo-600 to Purple-600 gradients
   - Cards: white/gray-800, rounded-2xl, shadow-lg
   - Animations: 300ms default duration
   - Responsive: Tailwind breakpoints

4. **Success Criteria**:
   - 7 measurable outcomes including Lighthouse scores, browser compatibility, and developer productivity targets

## Outcome

- ✅ Impact: Created foundational spec for standardized UI component generation
- 🧪 Tests: Acceptance scenarios defined for all 6 user stories
- 📁 Files: spec.md and checklist.md created in specs/006-saas-ui-builder/
- 🔁 Next prompts: /sp.plan to create architecture, /sp.tasks to generate implementation tasks
- 🧠 Reflection: Spec captures existing design patterns already implemented in the todo app (landing page, dashboard, analytics)

## Evaluation notes (flywheel)

- Failure modes observed: None - straightforward specification creation
- Graders run and results (PASS/FAIL): Manual checklist validation - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Consider adding Storybook integration requirements
