---
id: 003
title: Generate Implementation Tasks
stage: tasks
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5
feature: fullstack-web-app
branch: 004-fullstack-web-app
user: DC
command: /sp.tasks
labels: ["phase-2", "full-stack", "tasks", "task-generation", "user-stories", "mvp"]
links:
  spec: specs/004-fullstack-web-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-fullstack-web-app/tasks.md
tests:
  - Task format validation (all 67 tasks follow checklist format)
  - User story mapping validation (all stories have complete task sets)
  - Dependency graph validation (blocking dependencies identified)
  - Parallel execution validation (36 tasks marked parallelizable)
---

## Prompt

Execute the task generation workflow for Feature 004: Full-Stack Web Application.

**Context**:
- Planning completed: `specs/004-fullstack-web-app/plan.md`
- Specification validated: `specs/004-fullstack-web-app/spec.md`
- Available design docs: research.md, data-model.md, contracts/, quickstart.md
- Branch: `004-fullstack-web-app`

**Workflow Steps**:
1. Run check-prerequisites.ps1 to get feature directory and available docs
2. Load design documents (plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md)
3. Extract tech stack, project structure, user stories with priorities
4. Map entities and API endpoints to user stories
5. Generate tasks organized by user story (Setup, Foundational, US1-7, Polish)
6. Create dependency graph and parallel execution examples
7. Validate task completeness and format
8. Create PHR

**Requirements**:
- Tasks MUST follow checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- Tasks organized by user story for independent implementation and testing
- Each user story phase includes independent test criteria
- MVP scope clearly identified
- Parallel execution opportunities marked with [P]

## Response snapshot

Generated comprehensive task list with 67 tasks organized by user story for incremental delivery.

**Task Organization Strategy**:

Organized tasks by user story priority to enable independent implementation and testing:
- **Phase 1: Setup** (10 tasks) - Project initialization
- **Phase 2: Foundational** (15 tasks) - Core infrastructure blocking all stories
- **Phase 3: US1 Authentication** (8 tasks) - Registration, login, protected routes
- **Phase 4: US2 View Tasks** (9 tasks) - Task list display with data isolation
- **Phase 5: US3 Create Tasks** (6 tasks) - Task creation form and endpoint
- **Phase 6: US4 Update Tasks** (5 tasks) - Edit existing tasks
- **Phase 7: US5 Delete Tasks** (3 tasks) - Task deletion
- **Phase 8: US6 Toggle Completion** (3 tasks) - Completion status toggle
- **Phase 9: US7 Responsive Design** (5 tasks) - Mobile/tablet optimization
- **Phase 10: Polish** (3 tasks) - Loading states, error handling, success messages

**User Story Mapping**:

From spec.md, extracted 7 user stories with priorities:
1. **US1 (P1 MVP)**: User Registration and Authentication → 8 tasks
2. **US2 (P1 MVP)**: View Personal Task List → 9 tasks
3. **US3 (P1 MVP)**: Create New Task → 6 tasks
4. **US4 (P2)**: Update Existing Task → 5 tasks
5. **US5 (P2)**: Delete Task → 3 tasks
6. **US6 (P2)**: Toggle Task Completion Status → 3 tasks
7. **US7 (P3)**: Responsive Mobile/Tablet Experience → 5 tasks

**Entity-to-Story Mapping** (from data-model.md):
- **User entity** (Better Auth managed): Required for US1 (authentication)
- **Task entity** (backend managed): Required for US2 (view), US3 (create), US4 (update), US5 (delete), US6 (toggle)

**Endpoint-to-Story Mapping** (from contracts/api-spec.yaml):
- `GET /api/v1/tasks` (list) → US2 (view tasks)
- `POST /api/v1/tasks` (create) → US3 (create task)
- `GET /api/v1/tasks/{id}` (get single) → US2 (view single task)
- `PUT /api/v1/tasks/{id}` (update) → US4 (update task)
- `DELETE /api/v1/tasks/{id}` (delete) → US5 (delete task)
- `PATCH /api/v1/tasks/{id}/complete` (toggle) → US6 (toggle completion)

**Dependency Graph**:

```
Setup → Foundational → US1 (blocks all) → US2 → US3 → [US4 | US5 | US6] (parallel) → US7 → Polish
```

**Blocking Dependencies**:
- US1 (Authentication) blocks all other stories (all features require auth)
- US2, US3 block US4-6 (update/delete/toggle require tasks to exist)
- US7 depends on all previous stories (responsive design tested across all features)

**Parallel Opportunities**:
- 36 tasks marked with [P] (54% parallelizable)
- Within phases: Model + schema + endpoint tasks can run in parallel (different files)
- Across stories: US4, US5, US6 can be implemented in parallel (independent features)

**MVP Scope Identified**:
- **Phases 1-5** (T001-T048): Setup + Foundational + US1 + US2 + US3
- **48 tasks** to achieve MVP
- **Delivers**: Users can register, login, view tasks, create tasks
- **Validates**: Full-stack architecture (frontend ↔ backend ↔ database), data isolation

**Independent Test Criteria per Story**:

- **US1**: ✅ Register, login, logout, protected route access, invalid credentials handling
- **US2**: ✅ Empty state, task display, multi-user isolation, data persistence
- **US3**: ✅ Create with title only, create with all fields, validation errors, auto user_id assignment, isolation
- **US4**: ✅ Update title/description, validation, ownership verification (403)
- **US5**: ✅ Delete task, persistence, ownership verification (403), 404 for non-existent
- **US6**: ✅ Toggle complete/incomplete, persistence, ownership verification (403)
- **US7**: ✅ Mobile layout, tablet layout, desktop layout, touch targets ≥ 44px

**Task Breakdown by Category**:

**Backend Tasks** (30 total):
- Setup: 4 tasks (structure, deps, env, __init__.py)
- Foundational: 10 tasks (config, database, security, middleware, models, migration)
- US1: 1 task (get_current_user dependency)
- US2: 4 tasks (schemas, list endpoint, get endpoint, router registration)
- US3: 2 tasks (schema, create endpoint)
- US4: 2 tasks (schema, update endpoint)
- US5: 1 task (delete endpoint)
- US6: 1 task (toggle endpoint)
- Infrastructure subtasks: 5 core modules (config, database, security, CORS, error handling)

**Frontend Tasks** (37 total):
- Setup: 6 tasks (Next.js project, deps, env, structure)
- Foundational: 3 tasks (Better Auth config, types, API client)
- US1: 7 tasks (landing, register, login, AuthGuard, dashboard, Navbar, layout)
- US2: 5 tasks (TaskCard, TaskList, API function, tasks page, dashboard link)
- US3: 4 tasks (TaskForm, API function, add button, list callback)
- US4: 3 tasks (API function, edit mode in TaskCard, TaskForm edit support)
- US5: 2 tasks (API function, delete button in TaskCard)
- US6: 2 tasks (API function, checkbox in TaskCard)
- US7: 5 tasks (responsive styles in all components)
- Polish: 3 tasks (loading states, error messages, success confirmations)

**Task Format Validation**: ✅ All 67 tasks follow required format:
- Checkbox: `- [ ]` ✓
- Task ID: T001-T067 ✓
- [P] marker: 36 tasks marked parallelizable ✓
- [Story] label: All US1-US7 tasks have story labels (US1, US2, etc.) ✓
- Description with file path: All tasks include specific file paths ✓

**Incremental Delivery Strategy**:

1. **Milestone 1 - MVP** (Phases 1-5, T001-T048):
   - Deliverable: Users can register, login, view tasks, create tasks
   - Validation: End-to-end functionality, full-stack integration, multi-user isolation
   - Time estimate: 60-70% of total effort

2. **Milestone 2 - Core Features** (Phases 6-8, T049-T059):
   - Deliverable: Complete CRUD (update, delete, toggle completion)
   - Validation: Full task management capabilities
   - Time estimate: 15-20% of total effort

3. **Milestone 3 - Enhanced UX** (Phases 9-10, T060-T067):
   - Deliverable: Responsive design, polished UI/UX
   - Validation: Mobile/tablet/desktop testing, accessibility
   - Time estimate: 15-20% of total effort

**Parallel Execution Examples**:

8 parallel groups identified:
- Group 1 (Setup): T002-T008 (7 tasks in parallel after directory creation)
- Group 2 (Foundational Backend): T011-T017 (7 tasks in parallel)
- Group 3 (Foundational Frontend): T023-T025 (3 tasks in parallel)
- Group 4 (US1 Pages): T027-T029 (3 tasks in parallel after auth dependency ready)
- Group 5 (US2 Components): T034, T038, T040 (3 tasks in parallel)
- Group 6 (US3 Schema/Form): T043, T045, T046 (3 tasks in parallel)
- Group 7 (US4-6 Stories): All of US4, US5, US6 in parallel (11 tasks total)
- Group 8 (US7 Responsive): T060-T064 (5 tasks in parallel)
- Group 9 (Polish): T065-T067 (3 tasks in parallel)

**Task Density Analysis**:
- Average: 6.7 tasks per user story
- Most complex: US2 (View Tasks) with 9 tasks (list + single + components + integration)
- Least complex: US5 (Delete) and US6 (Toggle) with 3 tasks each (endpoint + API + UI)

**File Impact Analysis**:
- Backend files created: 18 files across models, schemas, api, core, middleware
- Frontend files created: 19 files across app routes, components, lib utilities
- Total new files: 37 (excluding config files like .env, package.json)

## Outcome

- ✅ Impact: Complete task list generated enabling incremental, testable implementation of full-stack web application with clear MVP scope and parallel execution opportunities
- 🧪 Tests: Task format validation passed (67/67 tasks correct), user story mapping validated (all stories complete), dependency graph validated (blocking deps identified), parallel execution validated (36 tasks marked)
- 📁 Files: tasks.md (500+ lines) with 67 tasks across 10 phases
- 🔁 Next prompts: Implementation (`/sp.implement`) to execute tasks incrementally by user story
- 🧠 Reflection: Successfully organized tasks by user story priority enabling independent implementation and testing; MVP scope (48 tasks) clearly identified; 54% of tasks parallelizable for efficient execution

## Evaluation notes (flywheel)

- Failure modes observed: None - all tasks follow required format, all user stories have complete task sets, all dependencies identified
- Graders run and results (PASS/FAIL): Task format validation: PASS (67/67), User story completeness: PASS (all 7 stories), Dependency graph: PASS (blocking deps clear), Parallel execution: PASS (36 tasks marked), MVP scope: PASS (clearly defined), Independent test criteria: PASS (all stories have criteria)
- Prompt variant (if applicable): N/A (standard /sp.tasks workflow)
- Next experiment (smallest change to try): Validate tasks against implementation requirements to ensure each task is specific enough for autonomous execution by LLM
