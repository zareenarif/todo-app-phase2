---
id: 002
title: Create Full-Stack Implementation Plan
stage: plan
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5
feature: fullstack-web-app
branch: 004-fullstack-web-app
user: DC
command: /sp.plan
labels: ["phase-2", "full-stack", "planning", "architecture", "design", "research"]
links:
  spec: specs/004-fullstack-web-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-fullstack-web-app/plan.md
  - specs/004-fullstack-web-app/research.md
  - specs/004-fullstack-web-app/data-model.md
  - specs/004-fullstack-web-app/contracts/api-spec.yaml
  - specs/004-fullstack-web-app/contracts/frontend-backend-contract.md
  - specs/004-fullstack-web-app/quickstart.md
  - CLAUDE.md (agent context updated)
tests:
  - Constitution Check passed (all 8 principles compliant)
  - Phase 0 research completed (6 decisions documented)
  - Phase 1 design completed (data model, API contracts, quickstart)
---

## Prompt

Execute the planning workflow for Feature 004: Full-Stack Web Application.

**Context**:
- Specification created and validated: `specs/004-fullstack-web-app/spec.md`
- Branch: `004-fullstack-web-app`
- Constitutional requirements: Phase 2 constitution v2.0.0

**Workflow Steps**:
1. Setup: Run `.specify/scripts/powershell/setup-plan.ps1 -Json` for context
2. Load specification and constitution
3. Fill Technical Context section
4. Complete Constitution Check section
5. Update Project Structure section
6. Phase 0: Research (resolve all NEEDS CLARIFICATION items)
7. Phase 1: Design (generate data-model.md, API contracts, quickstart.md)
8. Update agent context
9. Re-evaluate Constitution Check post-design
10. Create PHR for planning process

## Response snapshot

Created comprehensive implementation plan for full-stack web application with complete Phase 0 research and Phase 1 design artifacts.

**Phase 0: Research Completed**

Generated `research.md` with 6 key research areas:

1. **Alembic Migration Setup**: Decided to use Alembic with SQLModel configuration for type-safe, reversible migrations. Documented setup pattern, migration workflow, and code examples.

2. **Testing Strategy**: Decided manual testing remains primary (REQUIRED); automated API tests are optional but recommended. Balanced constitutional constraints with full-stack best practices.

3. **Better Auth + FastAPI JWT Verification**: Documented integration pattern where Better Auth generates JWTs on frontend and FastAPI verifies independently using shared `BETTER_AUTH_SECRET`. Included code patterns for both sides.

4. **CORS Configuration**: Decided to use FastAPI CORSMiddleware with environment-specific allowed origins. Documented development (`localhost:3000`) and production (specific domains) configurations.

5. **Neon PostgreSQL Connection**: Documented connection pooling pattern with `pool_pre_ping=True` to handle serverless characteristics. Included connection string format and environment variable setup.

6. **Next.js 16 App Router + Better Auth**: Documented integration approach using Better Auth's App Router adapter with AuthGuard component for route protection.

**Phase 1: Design Completed**

Generated 4 comprehensive design artifacts:

**1. Data Model (`data-model.md` - 445 lines)**:
- **Entities**: User (Better Auth managed), Task (backend managed)
- **SQLModel Implementation**: Complete Task model with enums (Priority, Recurrence), UUID primary keys, JSONB tags
- **Pydantic Schemas**: TaskCreate, TaskUpdate, TaskResponse with validation rules
- **Database Migrations**: Alembic initial migration script with CHECK constraints
- **Query Patterns**: Data isolation enforcement (ALL queries filter by user_id)
- **State Transitions**: Task completion and recurring task logic

**2. API Contracts (`contracts/api-spec.yaml` - 450 lines)**:
- **OpenAPI 3.0 Specification**: Complete REST API documentation
- **6 Endpoints**:
  - GET /api/v1/tasks (list with filters/sort)
  - POST /api/v1/tasks (create)
  - GET /api/v1/tasks/{id} (get single)
  - PUT /api/v1/tasks/{id} (update)
  - DELETE /api/v1/tasks/{id} (delete)
  - PATCH /api/v1/tasks/{id}/complete (toggle completion)
- **Schemas**: TaskCreate, TaskUpdate, TaskResponse, ErrorResponse
- **Security**: BearerAuth (JWT) on all endpoints
- **Response Examples**: Success and error responses with status codes
- **Query Parameters**: status, priority, tags, sort, order

**3. Frontend-Backend Contract (`contracts/frontend-backend-contract.md` - 340 lines)**:
- **Authentication Flow**: Registration, login, logout patterns
- **API Request Pattern**: Authorization header, JWT extraction, error handling
- **6 API Endpoint Usage Examples**: TypeScript code for each endpoint
- **Error Handling**: HTTP status code mapping (400/401/403/404/500)
- **Data Isolation Guarantee**: Backend contract ensuring user_id filtering
- **Environment Variables**: Frontend and backend .env requirements
- **TypeScript Types**: Complete type definitions (Task, TaskCreate, TaskUpdate, enums)
- **Development Workflow**: Backend + frontend dev server setup

**4. Quickstart Guide (`quickstart.md` - 400 lines)**:
- **Phase 1: Environment Setup**: Neon PostgreSQL setup, secret generation, .env file creation
- **Phase 2: Backend Implementation**: Project structure, dependencies, core files, Alembic setup, running backend
- **Phase 3: Frontend Implementation**: Next.js initialization, Better Auth config, component structure, running frontend
- **Phase 4: Integration Testing**: 5 test scenarios (authentication, CRUD, multi-user isolation, responsive design, error handling)
- **Phase 5: Deployment Preparation**: Production environment variables, migrations, security checklist
- **Troubleshooting**: 5 common issues with solutions (CORS, JWT, ownership, database connection)
- **File Checklists**: Backend (14 files) and frontend (13 files) implementation checklists
- **Development Commands Reference**: Backend and frontend command quick reference

**Technical Context**:
- **Languages**: TypeScript (Node.js 18+), Python 3.11+
- **Frontend**: Next.js 16+, Better Auth, Tailwind CSS, Fetch API
- **Backend**: FastAPI, SQLModel, Pydantic, python-jose (JWT), passlib
- **Database**: Neon Serverless PostgreSQL
- **Testing**: Manual (required), automated API tests (optional)
- **Performance**: <2s page loads, <500ms API p95, 50 concurrent users
- **Scale**: 100 tasks/user, 5 frontend pages, 6 API endpoints, 2 database tables

**Constitution Check**:
- ✅ All 8 core principles (I-VIII) compliant
- ✅ Technology stack exact match (Next.js 16+, FastAPI, SQLModel, Better Auth, Neon PostgreSQL)
- ✅ Security architecture (7-step JWT flow, user data isolation)
- ✅ API design (RESTful, required status codes, JSON format)
- ✅ Data model (UUID PKs, user_id FKs, indexed, extended attributes)
- ✅ Quality standards (TypeScript strict, Pydantic, WCAG 2.1 AA)
- ✅ No violations detected

**Project Structure**:
- Web application structure (frontend + backend + database)
- Backend: FastAPI with models, schemas, api, core, middleware layers
- Frontend: Next.js App Router with route groups (auth, protected), components by feature
- Phase 1 CLI code preserved in `src/` and `main.py` (deprecated)

**Agent Context Updated**:
- Database technology added to CLAUDE.md

**Plan Status**: ✅ COMPLETE - Ready for `/sp.tasks`

## Outcome

- ✅ Impact: Complete implementation plan created with comprehensive research, data model, API contracts, and quickstart guide enabling full-stack development
- 🧪 Tests: Constitution Check passed twice (initial + post-design), all Phase 0 research decisions documented, all Phase 1 design artifacts validated
- 📁 Files: plan.md (380 lines), research.md (280 lines), data-model.md (445 lines), api-spec.yaml (450 lines), frontend-backend-contract.md (340 lines), quickstart.md (400 lines), CLAUDE.md (updated)
- 🔁 Next prompts: Task generation (`/sp.tasks`) to break down implementation into discrete, testable tasks
- 🧠 Reflection: Successfully designed complete full-stack architecture with strong security (stateless JWT, user isolation), type safety (TypeScript + Pydantic + SQLModel), and developer experience (OpenAPI docs, comprehensive quickstart)

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell script encoding issues when appending content (resolved by using Edit tool instead of Bash heredoc)
- Graders run and results (PASS/FAIL): Technical Context completeness: PASS, Constitution Check (initial): PASS, Phase 0 research quality: PASS, Phase 1 design completeness: PASS, Constitution Check (post-design): PASS, Documentation clarity: PASS
- Prompt variant (if applicable): N/A (standard /sp.plan workflow)
- Next experiment (smallest change to try): Validate plan against task generation requirements to ensure all implementation details are clear enough for discrete task creation
