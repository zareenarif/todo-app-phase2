# Implementation Tasks: Full-Stack Web Application

**Feature**: 004-fullstack-web-app
**Branch**: `004-fullstack-web-app`
**Date**: 2026-01-05

---

## Overview

This task list implements the full-stack todo web application as specified in `spec.md`. Tasks are organized by user story to enable independent implementation and testing. Each user story phase is a complete, testable increment.

**Total Tasks**: 67
**MVP Scope**: User Stories 1-3 (Authentication + View Tasks + Create Tasks)
**Implementation Strategy**: Incremental delivery by user story priority

---

## Task Format

Each task follows this format:
```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

**Legend**:
- `[P]` = Parallelizable (can run concurrently with other [P] tasks)
- `[US1]` = User Story 1, `[US2]` = User Story 2, etc.
- No story label = Setup, Foundational, or Polish task

---

## Implementation Strategy

**MVP-First Approach**:
1. **MVP (User Stories 1-3)**: Authentication, viewing tasks, creating tasks
   - Delivers end-to-end functionality: user can register, login, view tasks, create tasks
   - Validates full-stack architecture (frontend ↔ backend ↔ database)
   - Tests data isolation (multi-user)

2. **Core Features (User Stories 4-6)**: Update, delete, toggle completion
   - Completes CRUD operations
   - Adds task management functionality

3. **Enhanced UX (User Story 7)**: Responsive design
   - Mobile/tablet optimization
   - Accessibility improvements

**Incremental Delivery**:
- Each user story is independently testable
- Stories 1-3 can be delivered as MVP
- Stories 4-6 can be delivered as enhancements
- Story 7 can be delivered as final polish

---

## Dependencies

### User Story Completion Order

```
Setup (Phase 1)
  ↓
Foundational (Phase 2)
  ↓
┌─────────────────────────────────┐
│ US1: Authentication (P1 MVP)    │ ← MUST complete first
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│ US2: View Tasks (P1 MVP)        │ ← Depends on US1 (needs auth)
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│ US3: Create Tasks (P1 MVP)      │ ← Depends on US1, US2 (needs auth + view)
└─────────────────────────────────┘
  ↓
┌──────────────────┬──────────────────┬─────────────────────┐
│ US4: Update (P2) │ US5: Delete (P2) │ US6: Toggle (P2)    │ ← All depend on US1-3
└──────────────────┴──────────────────┴─────────────────────┘
  ↓
┌─────────────────────────────────┐
│ US7: Responsive Design (P3)     │ ← Depends on all previous stories
└─────────────────────────────────┘
  ↓
Polish & Cross-Cutting Concerns
```

**Blocking Dependencies**:
- **US1 blocks all others**: Authentication is required for all protected features
- **US2, US3 block US4-6**: Update/delete/toggle require tasks to exist first
- **US7 depends on all**: Responsive design tested across all features

**Parallel Opportunities**:
- Within each story: Model + schema + endpoint tasks can run in parallel if using different files
- US4, US5, US6 can be implemented in parallel (independent features)

---

## Phase 1: Setup

**Goal**: Initialize project structure, install dependencies, configure environment

### Backend Setup

- [X] T001 Create backend directory structure (`backend/src/{models,schemas,api/{v1},core,middleware}`, `backend/alembic/versions`, `backend/tests`)
- [X] T002 [P] Create Python virtual environment and install dependencies (`backend/venv`, `backend/requirements.txt`: fastapi, uvicorn, sqlmodel, pydantic, python-jose, passlib, alembic, psycopg2-binary, python-dotenv)
- [X] T003 [P] Create backend environment configuration template (`backend/.env.example` with DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS)
- [X] T004 [P] Create all backend `__init__.py` files for Python package structure

### Frontend Setup

- [X] T005 Create Next.js project with TypeScript and Tailwind CSS (`npx create-next-app@latest frontend --typescript --tailwind --app`)
- [X] T006 [P] Install Better Auth and additional frontend dependencies (`npm install better-auth` in `frontend/`)
- [X] T007 [P] Create frontend environment configuration template (`frontend/.env.local.example` with BETTER_AUTH_SECRET, DATABASE_URL, NEXT_PUBLIC_API_URL)
- [X] T008 [P] Create frontend directory structure (`frontend/src/app/{(auth),(protected)}`, `frontend/components/{tasks,auth,layout}`, `frontend/lib`)

### Database Setup

- [X] T009 Create Neon PostgreSQL database and obtain connection string
- [X] T010 Initialize Alembic migrations (`alembic init alembic` in `backend/`, configure `alembic/env.py` to use SQLModel.metadata)

**Setup Complete**: Project structure created, dependencies installed, environment templates ready

---

## Phase 2: Foundational

**Goal**: Implement core infrastructure that blocks all user stories (auth, database, shared utilities)

### Backend Core Infrastructure

- [X] T011 [P] Implement environment configuration in `backend/src/core/config.py` (load DATABASE_URL, BETTER_AUTH_SECRET, CORS_ORIGINS from environment)
- [X] T012 [P] Implement database engine setup in `backend/src/core/database.py` (SQLModel create_engine, get_session dependency)
- [X] T013 [P] Implement JWT verification utilities in `backend/src/core/security.py` (verify JWT using BETTER_AUTH_SECRET, extract user_id from token)
- [X] T014 [P] Implement CORS middleware in `backend/src/middleware/cors.py` (configure allowed origins from CORS_ORIGINS)
- [X] T015 [P] Implement error handling middleware in `backend/src/middleware/error_handler.py` (consistent error response format)

### Data Models & Schemas (Shared)

- [X] T016 [P] Define Priority and Recurrence enums in `backend/src/models/task.py`
- [X] T017 [P] Create User reference model in `backend/src/models/user.py` (for foreign key reference only, managed by Better Auth)
- [X] T018 Create Task SQLModel entity in `backend/src/models/task.py` (id, user_id, title, description, completed, priority, tags, due_date, recurrence, created_at, updated_at)

### Database Migration

- [X] T019 Create initial Alembic migration for users and tasks tables (`alembic revision --autogenerate -m "Initial schema"`)
- [X] T020 Apply initial migration to Neon database (`alembic upgrade head`)

### FastAPI Application Bootstrap

- [X] T021 Create FastAPI application in `backend/src/main.py` (app initialization, middleware registration, CORS, error handling)
- [X] T022 Create API router structure in `backend/src/api/v1/__init__.py` (combine all v1 routers)

### Frontend Core Infrastructure

- [X] T023 [P] Configure Better Auth in `frontend/lib/auth.ts` (set BETTER_AUTH_SECRET, database URL, session settings)
- [X] T024 [P] Define TypeScript types in `frontend/lib/types.ts` (Task, TaskCreate, TaskUpdate, PriorityEnum, RecurrenceEnum interfaces)
- [X] T025 [P] Create API client wrapper in `frontend/lib/api.ts` (base fetch function with Authorization header, error handling)

**Foundational Complete**: Core infrastructure ready, all user stories can now be implemented

---

## Phase 3: User Story 1 - Authentication (Priority: P1) 🎯 MVP

**Story Goal**: Users can register, login, logout, and access protected pages

**Independent Test Criteria**:
- ✅ New user can register with email/password and is redirected to dashboard
- ✅ Registered user can login with correct credentials and access dashboard
- ✅ User can logout and JWT is cleared
- ✅ Unauthenticated user accessing /dashboard is redirected to /login
- ✅ Invalid credentials show error message

### Backend: Authentication Dependency

- [X] T026 [US1] Implement get_current_user dependency in `backend/src/api/deps.py` (extract JWT from Authorization header, verify signature, extract user_id, return user_id or raise 401)

### Frontend: Authentication Pages

- [X] T027 [P] [US1] Create landing page in `frontend/app/page.tsx` (public page with links to login/register)
- [X] T028 [P] [US1] Create registration page in `frontend/app/(auth)/register/page.tsx` (Better Auth registration form)
- [X] T029 [P] [US1] Create login page in `frontend/app/(auth)/login/page.tsx` (Better Auth login form)

### Frontend: Protected Route Infrastructure

- [X] T030 [US1] Create AuthGuard component in `frontend/components/auth/AuthGuard.tsx` (check session, redirect to /login if unauthenticated)
- [X] T031 [US1] Create protected dashboard page in `frontend/app/(protected)/dashboard/page.tsx` (wrapped in AuthGuard, displays "Welcome" message)

### Frontend: Navigation

- [X] T032 [US1] Create Navbar component in `frontend/components/layout/Navbar.tsx` (navigation links, logout button, user email display)
- [X] T033 [US1] Update root layout in `frontend/app/layout.tsx` (include Navbar, Better Auth provider)

**US1 Complete**: Users can register, login, logout, and access protected dashboard

---

## Phase 4: User Story 2 - View Tasks (Priority: P1) 🎯 MVP

**Story Goal**: Authenticated users can view their personal task list

**Independent Test Criteria**:
- ✅ User with no tasks sees empty state message
- ✅ User with multiple tasks sees all their tasks with title, status, creation date
- ✅ User A cannot see User B's tasks (data isolation verified)
- ✅ Tasks persist after page refresh

### Backend: Task List Endpoint

- [X] T034 [P] [US2] Define TaskResponse Pydantic schema in `backend/src/schemas/task.py` (id, user_id, title, description, completed, priority, tags, due_date, recurrence, created_at, updated_at with ORM mode)
- [X] T035 [US2] Implement GET /api/v1/tasks endpoint in `backend/src/api/v1/tasks.py` (list tasks filtered by current_user_id, support query params: status, priority, tags, sort, order)
- [X] T036 [US2] Implement GET /api/v1/tasks/{id} endpoint in `backend/src/api/v1/tasks.py` (get single task, verify ownership, return 403 if user_id mismatch, 404 if not found)
- [X] T037 [US2] Register tasks router in `backend/src/api/v1/__init__.py` and `backend/src/main.py`

### Frontend: Task Display Components

- [X] T038 [P] [US2] Create TaskCard component in `frontend/components/tasks/TaskCard.tsx` (display task title, description, completion status, priority, tags, due date)
- [X] T039 [US2] Create TaskList component in `frontend/components/tasks/TaskList.tsx` (fetch tasks from API, display TaskCard for each, show empty state if no tasks)

### Frontend: Task List Page

- [X] T040 [US2] Implement listTasks API function in `frontend/lib/api.ts` (GET /api/v1/tasks with optional filters)
- [X] T041 [US2] Create task list page in `frontend/app/(protected)/tasks/page.tsx` (wrapped in AuthGuard, renders TaskList component)
- [X] T042 [US2] Update dashboard to link to /tasks page in `frontend/app/(protected)/dashboard/page.tsx`

**US2 Complete**: Users can view their personal task list with data isolation

---

## Phase 5: User Story 3 - Create Tasks (Priority: P1) 🎯 MVP

**Story Goal**: Authenticated users can create new tasks

**Independent Test Criteria**:
- ✅ User can create task with title only and it appears in list
- ✅ User can create task with title, description, priority, tags, due date
- ✅ Empty title shows validation error
- ✅ Created task is automatically assigned to authenticated user's user_id
- ✅ User A's new task is not visible to User B

### Backend: Task Creation Endpoint

- [X] T043 [P] [US3] Define TaskCreate Pydantic schema in `backend/src/schemas/task.py` (title required, description/priority/tags/due_date/recurrence optional with validation: title 1-200 chars, description max 2000 chars)
- [X] T044 [US3] Implement POST /api/v1/tasks endpoint in `backend/src/api/v1/tasks.py` (create task with user_id from JWT, validate request body, return 201 with created task)

### Frontend: Task Creation Form

- [X] T045 [P] [US3] Create TaskForm component in `frontend/components/tasks/TaskForm.tsx` (form with title, description, priority, tags, due date inputs, client-side validation)
- [X] T046 [US3] Implement createTask API function in `frontend/lib/api.ts` (POST /api/v1/tasks with task data)

### Frontend: Task Creation Integration

- [X] T047 [US3] Add "Add Task" button to task list page in `frontend/app/(protected)/tasks/page.tsx` (opens TaskForm, refreshes list after creation)
- [X] T048 [US3] Update TaskList component in `frontend/components/tasks/TaskList.tsx` (accept onTaskCreated callback to refresh list)

**US3 Complete**: MVP functional - users can register, login, view tasks, and create tasks

---

## Phase 6: User Story 4 - Update Tasks (Priority: P2)

**Story Goal**: Authenticated users can edit existing tasks

**Independent Test Criteria**:
- ✅ User can update task title and changes persist
- ✅ User can update task description
- ✅ Empty title shows validation error
- ✅ User A cannot update User B's task (403 Forbidden)

### Backend: Task Update Endpoint

- [X] T049 [P] [US4] Define TaskUpdate Pydantic schema in `backend/src/schemas/task.py` (all fields optional, same validation as TaskCreate)
- [X] T050 [US4] Implement PUT /api/v1/tasks/{id} endpoint in `backend/src/api/v1/tasks.py` (verify ownership, update fields, set updated_at, return 200 with updated task, 403 if ownership mismatch, 404 if not found)

### Frontend: Task Update UI

- [X] T051 [P] [US4] Implement updateTask API function in `frontend/lib/api.ts` (PUT /api/v1/tasks/{id} with partial task data)
- [X] T052 [US4] Add edit mode to TaskCard component in `frontend/components/tasks/TaskCard.tsx` (toggle between view and edit, use TaskForm for editing, save changes)
- [X] T053 [US4] Update TaskForm component in `frontend/components/tasks/TaskForm.tsx` (support edit mode with initial values)

**US4 Complete**: Users can update existing tasks with ownership verification

---

## Phase 7: User Story 5 - Delete Tasks (Priority: P2)

**Story Goal**: Authenticated users can delete tasks

**Independent Test Criteria**:
- ✅ User can delete task and it disappears from list
- ✅ Deleted task does not reappear after refresh
- ✅ User A cannot delete User B's task (403 Forbidden)
- ✅ Deleting non-existent task returns 404

### Backend: Task Delete Endpoint

- [X] T054 [US5] Implement DELETE /api/v1/tasks/{id} endpoint in `backend/src/api/v1/tasks.py` (verify ownership, delete task, return 204 No Content, 403 if ownership mismatch, 404 if not found)

### Frontend: Task Delete UI

- [X] T055 [P] [US5] Implement deleteTask API function in `frontend/lib/api.ts` (DELETE /api/v1/tasks/{id})
- [X] T056 [US5] Add delete button to TaskCard component in `frontend/components/tasks/TaskCard.tsx` (confirm deletion, call deleteTask, remove from list)

**US5 Complete**: Users can delete tasks with ownership verification

---

## Phase 8: User Story 6 - Toggle Completion (Priority: P2)

**Story Goal**: Authenticated users can mark tasks as complete/incomplete

**Independent Test Criteria**:
- ✅ User can mark incomplete task as complete (completed = true)
- ✅ User can mark complete task as incomplete (completed = false)
- ✅ Completion status persists after refresh
- ✅ User A cannot toggle User B's task (403 Forbidden)

### Backend: Task Toggle Endpoint

- [X] T057 [US6] Implement PATCH /api/v1/tasks/{id}/complete endpoint in `backend/src/api/v1/tasks.py` (verify ownership, toggle completed field, set updated_at, return 200 with updated task, 403 if ownership mismatch, 404 if not found)

### Frontend: Task Toggle UI

- [X] T058 [P] [US6] Implement toggleTaskCompletion API function in `frontend/lib/api.ts` (PATCH /api/v1/tasks/{id}/complete)
- [X] T059 [US6] Add completion checkbox to TaskCard component in `frontend/components/tasks/TaskCard.tsx` (toggle on click, update UI immediately, call toggleTaskCompletion)

**US6 Complete**: Users can toggle task completion status

---

## Phase 9: User Story 7 - Responsive Design (Priority: P3)

**Story Goal**: Application works on mobile, tablet, and desktop devices

**Independent Test Criteria**:
- ✅ Mobile (320px-767px): Layout stacks vertically, touch targets ≥ 44px
- ✅ Tablet (768px-1023px): Medium-sized grid layout
- ✅ Desktop (1024px+): Multi-column grid with larger text
- ✅ All interactive elements are easily tappable on touchscreens

### Frontend: Responsive Styling

- [X] T060 [P] [US7] Add mobile-first responsive styles to TaskCard component in `frontend/components/tasks/TaskCard.tsx` (Tailwind breakpoints: sm, md, lg)
- [X] T061 [P] [US7] Add mobile-first responsive styles to TaskList component in `frontend/components/tasks/TaskList.tsx` (grid layout adapts to screen size)
- [X] T062 [P] [US7] Add mobile-first responsive styles to TaskForm component in `frontend/components/tasks/TaskForm.tsx` (full-width on mobile, modal on desktop)
- [X] T063 [P] [US7] Add mobile-first responsive styles to Navbar component in `frontend/components/layout/Navbar.tsx` (hamburger menu on mobile, full navbar on desktop)
- [X] T064 [P] [US7] Ensure all interactive elements meet minimum touch target size (44px) in all components

**US7 Complete**: Application is fully responsive across all devices

---

## Phase 10: Polish & Cross-Cutting Concerns

**Goal**: Final touches, error handling improvements, accessibility

- [X] T065 [P] Add loading states to all API operations in TaskList, TaskForm, TaskCard components (spinner during fetch/create/update/delete)
- [X] T066 [P] Add user-friendly error messages for failed operations (toast notifications or inline errors)
- [X] T067 [P] Add success confirmations for completed operations (e.g., "Task created successfully", "Task deleted")

**Polish Complete**: Application is production-ready

---

## Parallel Execution Examples

### Within Setup Phase (T001-T010)
**Parallel Group 1** (after T001 completes):
```bash
# Can run simultaneously (different files/directories):
T002 & T003 & T004 & T005 & T006 & T007 & T008
```

### Within Foundational Phase (T011-T025)
**Parallel Group 2** (all independent):
```bash
# Backend core (can run simultaneously):
T011 & T012 & T013 & T014 & T015 & T016 & T017

# Frontend core (can run simultaneously):
T023 & T024 & T025
```

### Within US1 Phase (T026-T033)
**Parallel Group 3** (after T026 completes):
```bash
# Frontend pages (can run simultaneously):
T027 & T028 & T029
```

### Within US2 Phase (T034-T042)
**Parallel Group 4** (after backend endpoint ready):
```bash
# Frontend components (can run simultaneously):
T034 & T038 & T040
```

### Within US3 Phase (T043-T048)
**Parallel Group 5**:
```bash
# Schema and form (can run simultaneously):
T043 & T045 & T046
```

### Within US4, US5, US6 (T049-T059)
**Parallel Group 6** (these entire stories can run in parallel):
```bash
# US4, US5, US6 are independent and can be developed concurrently:
[US4: T049-T053] & [US5: T054-T056] & [US6: T057-T059]
```

### Within US7 Phase (T060-T064)
**Parallel Group 7** (all styling tasks independent):
```bash
# All responsive styling (can run simultaneously):
T060 & T061 & T062 & T063 & T064
```

### Within Polish Phase (T065-T067)
**Parallel Group 8**:
```bash
# All polish tasks (can run simultaneously):
T065 & T066 & T067
```

---

## Task Summary

**Total Tasks**: 67

**By Phase**:
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 15 tasks
- Phase 3 (US1 - Authentication): 8 tasks
- Phase 4 (US2 - View Tasks): 9 tasks
- Phase 5 (US3 - Create Tasks): 6 tasks
- Phase 6 (US4 - Update Tasks): 5 tasks
- Phase 7 (US5 - Delete Tasks): 3 tasks
- Phase 8 (US6 - Toggle Completion): 3 tasks
- Phase 9 (US7 - Responsive Design): 5 tasks
- Phase 10 (Polish): 3 tasks

**By User Story**:
- US1 (Authentication): 8 tasks
- US2 (View Tasks): 9 tasks
- US3 (Create Tasks): 6 tasks
- US4 (Update Tasks): 5 tasks
- US5 (Delete Tasks): 3 tasks
- US6 (Toggle Completion): 3 tasks
- US7 (Responsive Design): 5 tasks
- Infrastructure (Setup + Foundational + Polish): 28 tasks

**Parallelizable Tasks**: 36 marked with [P] (54% of total)

**MVP Scope** (Minimum Viable Product):
- Phases 1-5 (T001-T048): Setup + Foundational + US1 + US2 + US3
- **48 tasks** to achieve MVP (users can register, login, view tasks, create tasks)
- Delivers end-to-end functionality and validates full-stack architecture

**Format Validation**: ✅ All 67 tasks follow required checklist format with checkbox, Task ID, optional [P] and [Story] labels, description, and file path

---

## Next Steps

1. **Execute `/sp.implement`** to begin implementation
2. **Start with MVP**: Complete Phases 1-5 (T001-T048) first
3. **Test after each user story**: Verify independent test criteria
4. **Parallel execution**: Use [P] markers to identify tasks that can run concurrently
5. **Incremental delivery**: Ship MVP (US1-3), then enhance with US4-6, then polish with US7

---

**Tasks Generated**: 2026-01-05
**Ready For**: Implementation (`/sp.implement`)
