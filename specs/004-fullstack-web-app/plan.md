# Implementation Plan: Full-Stack Web Application

**Branch**: `004-fullstack-web-app` | **Date**: 2026-01-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-fullstack-web-app/spec.md`

## Summary

Transform the Phase 1 CLI todo application into a production-ready, multi-user web application with secure authentication and persistent storage. The system consists of a Next.js 16+ frontend (TypeScript + Tailwind CSS + Better Auth), Python FastAPI backend (with SQLModel ORM and JWT verification), and Neon Serverless PostgreSQL database. Users register/login via Better Auth, receive JWT tokens, and manage their personal tasks through a responsive web interface. All data is isolated by user_id, with the backend verifying JWTs and filtering all database queries to ensure users only access their own tasks.

## Technical Context

**Language/Version**:
- Frontend: TypeScript (strict mode), Node.js 18+
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 16+ (App Router), Better Auth, Tailwind CSS, Fetch API/Axios
- Backend: FastAPI, SQLModel, Pydantic, python-jose (JWT), passlib (password hashing)

**Storage**: Neon Serverless PostgreSQL (connection via DATABASE_URL environment variable)

**Testing**: NEEDS CLARIFICATION (Manual testing per Phase 1 constitutional constraints, or introduction of automated testing for Phase 2?)

**Target Platform**:
- Frontend: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Backend: Linux/Windows server environment (containerization optional)

**Project Type**: Web application (frontend + backend + database)

**Performance Goals**:
- Task list page loads in <2 seconds for up to 100 tasks
- API responses <500ms p95 latency
- Supports 50 concurrent users without degradation

**Constraints**:
- Stateless backend (no session storage)
- JWT-only authentication (no OAuth for Phase 2 MVP)
- No offline support (requires active internet connection)
- Single database instance (no multi-region)
- No real-time updates (user must refresh for changes)

**Scale/Scope**:
- 50-100 concurrent users (target)
- Up to 100 tasks per user (optimal)
- 5 frontend pages (Landing, Login, Register, Dashboard, Tasks)
- 6 REST API endpoints (task CRUD + toggle completion)
- 2 database tables (users managed by Better Auth, tasks created manually)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

**✅ Principle I: Specification Before Implementation**
- Specification created and validated (specs/004-fullstack-web-app/spec.md)
- All requirements documented with acceptance scenarios
- API contracts explicitly defined in functional requirements
- UI/UX requirements include acceptance criteria

**✅ Principle II: Planning Before Coding**
- Implementation plan in progress (this document)
- Will define all components (frontend, backend, database) and interactions
- Will define API endpoints, request/response schemas, and database models
- Will address authentication flow and security requirements

**✅ Principle III: Tasks Before Execution**
- Task decomposition will occur in /sp.tasks command after plan approval
- Tasks will specify whether they are frontend, backend, database, or integration work
- Tasks will identify dependencies (e.g., backend endpoint before frontend integration)

**✅ Principle IV: Simplicity Over Complexity**
- Using established frameworks: Next.js App Router (frontend), FastAPI (backend)
- No custom authentication (using Better Auth)
- Leveraging framework defaults
- No unnecessary abstraction layers

**✅ Principle V: Scope Discipline and Controlled Enhancement**
- Following SDD workflow: Constitution → Specify → Plan → Tasks → Implement
- Specification user-approved
- Explicit out-of-scope items documented (AI, Kubernetes, background workers, admin panels)
- MVP scope focused on core authentication and task CRUD

**✅ Principle VI: Security by Design**
- All API endpoints require JWT (except landing/login/register)
- Input validation using Pydantic (backend) and form validation (frontend)
- Parameterized queries via SQLModel ORM
- Environment variables for secrets (DATABASE_URL, BETTER_AUTH_SECRET)
- CORS policies explicitly configured

**✅ Principle VII: Stateless Authentication**
- Better Auth for authentication (Next.js integration)
- JWT for all authenticated requests
- Backend verifies JWT using shared BETTER_AUTH_SECRET
- No session storage or server-side session state

**✅ Principle VIII: User Data Isolation**
- Task entity includes user_id foreign key
- All queries will filter by user_id from JWT
- Backend will extract user_id from verified JWT
- No cross-user data access permitted

### Technology Stack Compliance

**✅ Frontend:**
- Next.js 16+ (App Router) ✓
- TypeScript (strict mode) ✓
- Tailwind CSS ✓
- Better Auth ✓

**✅ Backend:**
- Python FastAPI ✓
- SQLModel ORM ✓
- Pydantic validation ✓
- JWT verification (python-jose) ✓

**✅ Database:**
- Neon Serverless PostgreSQL ✓
- Alembic migrations (NEEDS CLARIFICATION: setup details)

**✅ Environment Variables:**
- DATABASE_URL ✓
- BETTER_AUTH_SECRET ✓
- NEXT_PUBLIC_API_URL ✓
- CORS_ORIGINS ✓

### Security Architecture Compliance

**✅ Authentication Flow (7 steps defined in spec):**
1. User registers/logs in via Better Auth ✓
2. Better Auth generates JWT signed with BETTER_AUTH_SECRET ✓
3. Frontend stores JWT in HTTP-only cookie ✓
4. Frontend includes JWT in Authorization header ✓
5. Backend verifies JWT signature ✓
6. Backend extracts user_id from JWT ✓
7. Backend filters all queries by user_id ✓

### API Design Compliance

**✅ RESTful Conventions:**
- Base URL: /api/v1/ ✓
- Resource naming: plural nouns (/tasks) ✓
- HTTP methods: GET/POST/PUT/PATCH/DELETE ✓
- JSON content-type ✓
- Required status codes documented ✓

### Data Model Compliance

**✅ Task Entity (as per constitution section):**
- Core fields: id (UUID), user_id (UUID FK), title, description, completed, created_at, updated_at ✓
- Extended fields from Phase 1: priority, tags, due_date, recurrence ✓
- Constraints: user_id indexed, title NOT NULL, completed default false ✓

### Quality Standards Compliance

**✅ Frontend:**
- TypeScript strict mode ✓
- WCAG 2.1 Level AA accessibility specified ✓
- Responsive design (mobile/tablet/desktop) ✓

**✅ Backend:**
- Type hints on functions ✓
- Pydantic models for schemas ✓
- OpenAPI/Swagger documentation (FastAPI automatic) ✓

**GATE STATUS: ✅ PASS** - All constitutional requirements met; ready for Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── task.py           # Task SQLModel entity
│   │   └── user.py           # User reference (managed by Better Auth)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── task.py           # Pydantic request/response schemas
│   │   └── auth.py           # JWT payload schema
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py           # Dependencies (get_current_user from JWT)
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── tasks.py      # Task endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py         # Environment variable configuration
│   │   ├── security.py       # JWT verification utilities
│   │   └── database.py       # SQLModel database engine setup
│   ├── middleware/
│   │   ├── __init__.py
│   │   ├── cors.py           # CORS configuration
│   │   └── error_handler.py # Error handling middleware
│   └── main.py               # FastAPI application entry point
├── alembic/
│   ├── versions/             # Migration files
│   └── env.py                # Alembic configuration
├── tests/
│   ├── api/
│   │   └── v1/
│   │       └── test_tasks.py # Task endpoint tests (if automated testing)
│   └── conftest.py           # Pytest fixtures
├── alembic.ini               # Alembic configuration file
├── requirements.txt          # Python dependencies
└── .env.example              # Example environment variables

frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── tasks/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── tasks/
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── TaskCard.tsx
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx
│   │   └── layout/
│   │       └── Navbar.tsx
│   ├── lib/
│   │   ├── api.ts           # API client wrapper (fetch/axios)
│   │   ├── auth.ts          # Better Auth configuration
│   │   └── types.ts         # TypeScript type definitions
│   └── styles/
│       └── globals.css      # Tailwind CSS imports
├── public/
│   └── (static assets)
├── tests/
│   └── (if automated testing)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local.example

# Existing Phase 1 code (preserved for reference)
src/
├── models/
│   └── task.py              # Original CLI Task model
├── services/
│   └── todo_service.py      # Original in-memory service
└── cli/
    └── menu.py              # Original CLI menu (deprecated in Phase 2)

main.py                      # Original CLI entry point (deprecated in Phase 2)
```

**Structure Decision**: Web application structure (Option 2) selected. The repository now contains both the Phase 1 CLI code (in `src/` and `main.py`, deprecated but preserved for reference) and the new Phase 2 full-stack application (in `backend/` and `frontend/` directories). The backend follows FastAPI conventions with models, schemas, API routes, and middleware clearly separated. The frontend uses Next.js 16+ App Router with route groups for authentication and protected pages, organized components by feature, and a lib directory for shared utilities.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All architectural decisions align with constitutional principles. The full-stack structure (frontend + backend + database) is explicitly supported by the Phase 2 constitution. Using established frameworks (Next.js, FastAPI, SQLModel) with their standard patterns maintains simplicity.

---

## Phase 0 & 1 Completion Summary

### Phase 0: Research (✅ Complete)

**Artifacts Generated**:
- `research.md` - Resolved all NEEDS CLARIFICATION items from Technical Context

**Key Decisions**:
1. **Testing Strategy**: Manual testing required; automated API tests optional
2. **Alembic Migrations**: Configuration pattern and workflow defined
3. **Better Auth Integration**: JWT generation and verification flow specified
4. **CORS Configuration**: Development and production patterns documented
5. **Neon PostgreSQL**: Connection string format and pooling strategy defined
6. **JWT Verification**: Shared secret pattern between frontend and backend

### Phase 1: Design (✅ Complete)

**Artifacts Generated**:
1. `data-model.md` - Complete database schema with SQLModel models and Pydantic schemas
2. `contracts/api-spec.yaml` - OpenAPI 3.0 specification for REST API endpoints
3. `contracts/frontend-backend-contract.md` - Integration contract between Next.js and FastAPI
4. `quickstart.md` - Step-by-step developer implementation guide

**Architecture Decisions**:
- **Entities**: User (Better Auth managed), Task (backend managed)
- **Data Isolation**: All queries filter by `user_id` from JWT
- **API Design**: 6 RESTful endpoints under `/api/v1/tasks`
- **Frontend Structure**: Next.js App Router with route groups (auth, protected)
- **Backend Structure**: FastAPI with layered architecture (models, schemas, api, core, middleware)

**Agent Context Updated**:
- Database technology added to CLAUDE.md

### Constitution Check Re-Evaluation (✅ Pass)

All constitutional requirements remain satisfied post-design:

**✅ Principle I-VIII**: All principles complied with
**✅ Technology Stack**: Exact match (Next.js 16+, FastAPI, SQLModel, Better Auth, Neon PostgreSQL)
**✅ Security Architecture**: 7-step authentication flow implemented, user data isolation enforced
**✅ API Design**: RESTful conventions, required status codes, JSON format
**✅ Data Model**: UUID PKs, user_id FKs, indexed queries, extended attributes preserved
**✅ Quality Standards**: TypeScript strict mode, Pydantic validation, WCAG 2.1 AA, comprehensive docs

**No architectural violations introduced.**

---

## Planning Phase Status

**Status**: ✅ **PLANNING COMPLETE** - Ready for task generation (`/sp.tasks`)

**Deliverables**:
- [x] Technical Context defined
- [x] Constitution Check passed
- [x] Project Structure documented
- [x] Phase 0 Research completed (6 research tasks, all resolved)
- [x] Phase 1 Design completed (data model, API contracts, quickstart guide)
- [x] Agent context updated

**Next Command**: `/sp.tasks` to generate actionable implementation tasks

---

## Key Architectural Highlights

**Security-First Design**:
- Stateless JWT authentication
- User data isolation at database query level
- Input validation at both frontend and backend
- CORS restricted to specific origins
- Environment variables for secrets

**Full-Stack Separation**:
- Frontend: Next.js App Router (TypeScript, Tailwind CSS, Better Auth)
- Backend: FastAPI (Python, SQLModel, Pydantic, JWT verification)
- Database: Neon Serverless PostgreSQL (Alembic migrations)

**Type Safety**:
- TypeScript strict mode (frontend)
- Pydantic models (backend request/response)
- SQLModel entities (database)

**Developer Experience**:
- OpenAPI/Swagger docs auto-generated
- Comprehensive quickstart guide
- Clear frontend-backend contract
- Detailed data model documentation

---

**Plan Completed**: 2026-01-05
**Branch**: 004-fullstack-web-app
**Ready For**: Task generation and implementation
