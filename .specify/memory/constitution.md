# Todo Full-Stack Web Application Constitution (Phase 2)

<!--
Sync Impact Report:
- Version change: 1.2.0 → 2.0.0
- Major version increment: Fundamental architectural transformation from CLI to full-stack web application
- Breaking changes:
  - Removed: CLI-only interface constraint
  - Removed: In-memory only storage constraint
  - Removed: Python-only constraint
  - Added: Full-stack architecture (Next.js frontend + FastAPI backend)
  - Added: PostgreSQL database persistence
  - Added: Authentication and authorization requirements
  - Added: Multi-user support with data isolation
- Modified principles:
  - Principle IV: Simplicity Over Complexity (updated for full-stack context)
  - Principle V: Scope Discipline (reframed for web application features)
- Added principles:
  - Principle VI: Security by Design
  - Principle VII: Stateless Authentication
  - Principle VIII: User Data Isolation
- New sections: Technology Stack, Security Architecture, API Design Principles
- Templates requiring updates:
  ✅ .specify/templates/plan-template.md (reviewed - updated for full-stack planning)
  ✅ .specify/templates/spec-template.md (reviewed - updated for API/UI requirements)
  ✅ .specify/templates/tasks-template.md (reviewed - updated for frontend/backend task separation)
- Follow-up TODOs: None
- Impact: Complete architectural transformation enabling web-based multi-user todo application with secure authentication and data persistence
-->

## Purpose

This project follows Spec-Driven Development (SDD). The objective of Phase 2 is to transform the Phase 1 CLI application into a production-ready, full-stack web application with secure authentication, persistent storage, and multi-user support.

All development decisions MUST be guided by this constitution and the approved specification. No implementation may begin until the specification, plan, and tasks are agreed upon.

**Phase Transition:** Phase 2 builds upon the Phase 1 foundation by migrating all functionality to a web-based architecture while adding authentication, persistence, and multi-user capabilities.

## Core Principles

### I. Specification Before Implementation

All features MUST be specified before any code is written. The specification defines what will be built, why it is needed, and what success looks like.

**Non-negotiable rules:**
- No coding without an approved specification
- Specifications must be concrete and testable
- Requirements must be clear and unambiguous
- API contracts must be explicitly defined
- UI/UX requirements must include acceptance criteria

**Rationale:** Specifications prevent scope creep, ensure alignment, and provide a shared understanding of what will be delivered. For full-stack applications, specifications serve as contracts between frontend, backend, and database layers.

### II. Planning Before Coding

All implementations MUST have an architectural plan approved before code is generated. The plan defines how the specification will be achieved technically across the entire stack.

**Non-negotiable rules:**
- No coding without an approved implementation plan
- Plans must identify all components (frontend, backend, database) and their interactions
- Plans must define API endpoints, request/response schemas, and database models
- Plans must address authentication flow and security requirements
- Plans must consider separation of concerns across layers

**Rationale:** Planning ensures that technical decisions are deliberate and documented across the full stack. It prevents reactive coding, ensures architectural consistency, and validates that frontend, backend, and database designs align.

### III. Tasks Before Execution

All work MUST be broken down into discrete, testable tasks before execution begins. Tasks define the specific steps to implement the plan.

**Non-negotiable rules:**
- No execution without a defined task list
- Each task must be independently verifiable
- Tasks must reference specific files, endpoints, and components
- Tasks must specify whether they are frontend, backend, database, or integration work
- Tasks must identify dependencies (e.g., backend endpoint must exist before frontend integration)

**Rationale:** Task decomposition ensures work is trackable, testable, and completable in small increments across multiple technologies. It makes progress visible and prevents partial implementations.

### IV. Simplicity Over Complexity

The implementation MUST be as simple as possible while meeting all requirements. Complexity requires explicit justification.

**Non-negotiable rules:**
- Use established frameworks and patterns (Next.js App Router, FastAPI conventions)
- No custom authentication schemes (use Better Auth)
- No unnecessary abstraction layers
- Clear, readable code over clever solutions
- Leverage framework defaults unless requirements demand customization

**Rationale:** Simplicity reduces maintenance burden, improves reliability, and makes the codebase accessible. In full-stack applications, simplicity means using framework conventions and standard patterns rather than inventing custom solutions.

### V. Scope Discipline and Controlled Enhancement

This project maintains strict scope discipline. New features may be added ONLY through proper Spec-Driven Development workflow with explicit user approval.

**Non-negotiable rules:**
- All new features MUST follow SDD workflow: specification → plan → tasks → implementation
- No features may be added without user-approved specification
- Explicitly out of scope:
  - AI/Chatbot features
  - Kubernetes orchestration
  - Cloud-specific infrastructure code
  - Background worker processes
  - Admin panels or user management dashboards
- Features must maintain simplicity and architectural consistency
- All Phase 1 features must be preserved and enhanced for web interface

**Rationale:** Scope discipline ensures the project remains focused and deliverable. The explicit out-of-scope list prevents feature creep while allowing core todo functionality to be fully realized in a web context.

### VI. Security by Design

Security MUST be built into every layer of the application from the start. Security is not optional and cannot be retrofitted.

**Non-negotiable rules:**
- All API endpoints MUST require valid JWT authentication (no public endpoints except auth)
- All user input MUST be validated and sanitized
- All database queries MUST use parameterized statements (SQLModel ORM enforced)
- Secrets MUST be stored in environment variables, never in code
- HTTPS MUST be enforced in production
- CORS policies MUST be explicitly configured
- SQL injection, XSS, and CSRF vulnerabilities MUST be prevented by design

**Rationale:** Security vulnerabilities are expensive to fix later and can compromise user data. Building security into the architecture from day one ensures protection is consistent and comprehensive.

### VII. Stateless Authentication

Authentication MUST be stateless using JWT tokens. No server-side session storage is permitted.

**Non-negotiable rules:**
- Better Auth MUST be used for authentication (integrated with Next.js frontend)
- JWTs MUST be used for all authenticated requests
- Backend MUST verify JWT independently using shared `BETTER_AUTH_SECRET`
- JWT verification MUST happen on every protected API request
- Token expiration MUST be enforced
- Requests without valid JWT MUST return 401 Unauthorized
- No session storage, cookies for session tracking, or server-side session state

**Rationale:** Stateless authentication scales horizontally, simplifies deployment, and eliminates session synchronization issues. JWT enables the backend to verify requests independently without database lookups or shared session stores.

### VIII. User Data Isolation

Each user MUST only access their own data. Cross-user data leakage is a critical security failure.

**Non-negotiable rules:**
- Every task record MUST have a `user_id` foreign key
- All database queries MUST filter by authenticated user's ID
- Backend MUST extract `user_id` from verified JWT
- Frontend MUST send JWT with every API request
- API responses MUST only include data belonging to the authenticated user
- No endpoint may return or modify another user's tasks under any circumstance

**Rationale:** Data isolation is fundamental to multi-user applications. Leaking user data destroys trust and violates privacy. Enforcing user_id filtering at the database query level ensures isolation is guaranteed by architecture, not just by careful coding.

## Technology Stack

The following technologies are REQUIRED and MUST be used exactly as specified:

### Frontend
- **Framework:** Next.js 16+ (App Router only, not Pages Router)
- **Language:** TypeScript (strongly typed, no `any` types without justification)
- **Styling:** Tailwind CSS (utility-first, responsive design)
- **Authentication:** Better Auth (integrated with Next.js)
- **State Management:** React hooks and server components (no Redux unless justified)
- **HTTP Client:** Fetch API or Axios for backend API calls

### Backend
- **Framework:** Python FastAPI (async where beneficial)
- **Language:** Python 3.11+
- **ORM:** SQLModel (Pydantic-based, type-safe)
- **Authentication:** JWT verification using `BETTER_AUTH_SECRET`
- **Validation:** Pydantic models for request/response validation

### Database
- **Database:** Neon Serverless PostgreSQL
- **Migrations:** Alembic (SQLModel-compatible)
- **Connection:** PostgreSQL connection string from environment variable

### Authentication & Tokens
- **Auth Provider:** Better Auth (Next.js integration)
- **Token Format:** JWT (JSON Web Tokens)
- **Shared Secret:** `BETTER_AUTH_SECRET` environment variable (same for frontend and backend)
- **Token Storage:** HTTP-only cookies (frontend) + Authorization header (backend requests)

### Development & Tooling
- **Spec-Driven Development:** Claude Code + Spec-Kit Plus
- **Code Generation:** Claude Code (all code MUST be generated, no manual coding)
- **Version Control:** Git with semantic commit messages
- **Environment Variables:** `.env` files (never committed)

**Rationale:** This stack provides type safety (TypeScript + Pydantic), modern frameworks (Next.js + FastAPI), serverless scaling (Neon PostgreSQL), and stateless authentication (JWT). All technologies are production-proven and well-documented.

## Technical Constraints

### Architecture
- **Separation of Concerns:** Frontend, backend, and database MUST be clearly separated
- **RESTful API:** Backend MUST expose RESTful JSON endpoints
- **Stateless Backend:** Backend MUST NOT maintain session state
- **Type Safety:** TypeScript frontend and Pydantic backend MUST validate all data

### Deployment Constraints
- **Containerization:** Not required (out of scope for Phase 2)
- **Orchestration:** No Kubernetes or cloud orchestration
- **Background Workers:** Not permitted (out of scope)
- **Admin Dashboards:** Not permitted (out of scope)

### Database Constraints
- **ORM Required:** All database access MUST use SQLModel (no raw SQL except migrations)
- **Migrations Required:** All schema changes MUST be versioned with Alembic
- **User Isolation:** Every user-data table MUST have `user_id` foreign key
- **Timestamps:** All tables MUST have `created_at` and `updated_at` fields

## Security Architecture

### Authentication Flow
1. User registers/logs in via Better Auth (Next.js frontend)
2. Better Auth generates JWT signed with `BETTER_AUTH_SECRET`
3. Frontend stores JWT in HTTP-only cookie
4. Frontend includes JWT in `Authorization: Bearer <token>` header for all API requests
5. Backend verifies JWT signature using `BETTER_AUTH_SECRET`
6. Backend extracts `user_id` from verified JWT
7. Backend filters all queries by `user_id`

### Environment Variables (REQUIRED)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Shared secret for JWT signing/verification (MUST match between frontend/backend)
- `NEXT_PUBLIC_API_URL` - Backend API base URL (for frontend API calls)
- `CORS_ORIGINS` - Allowed frontend origins (for backend CORS configuration)

### Security Checklist (MUST verify before deployment)
- [ ] All API endpoints require JWT (except auth endpoints)
- [ ] JWT verification uses correct secret
- [ ] All queries filter by authenticated user_id
- [ ] No passwords stored in plain text
- [ ] No secrets in code or version control
- [ ] CORS configured to allow only specific origins
- [ ] HTTPS enforced in production
- [ ] Input validation on all endpoints

## API Design Principles

All RESTful API endpoints MUST follow these conventions:

### Endpoint Structure
- Base URL: `/api/v1/` (version prefix required)
- Resource naming: plural nouns (e.g., `/api/v1/tasks`, not `/api/v1/task`)
- HTTP methods:
  - `GET` - Retrieve resources (list or single)
  - `POST` - Create new resource
  - `PUT/PATCH` - Update existing resource
  - `DELETE` - Delete resource

### Request/Response Format
- Content-Type: `application/json`
- Request body: JSON (validated by Pydantic models)
- Response body: JSON (serialized from Pydantic models)
- Error responses: `{ "detail": "Error message" }` with appropriate HTTP status code

### Status Codes (REQUIRED)
- `200 OK` - Successful GET/PUT/PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid JWT
- `403 Forbidden` - Valid JWT but insufficient permissions
- `404 Not Found` - Resource does not exist
- `500 Internal Server Error` - Unexpected server error

### Authentication Header (REQUIRED for all protected endpoints)
```
Authorization: Bearer <jwt_token>
```

## Data Model Rules

### Task Entity (REQUIRED fields)

All tasks MUST contain the following attributes:

**Core Fields:**
- `id` - UUID primary key (auto-generated)
- `user_id` - UUID foreign key to users table (REQUIRED, indexed)
- `title` - String, required, non-empty (max 200 chars)
- `description` - String, optional (max 2000 chars)
- `completed` - Boolean, default False
- `created_at` - Timestamp, auto-generated
- `updated_at` - Timestamp, auto-updated

**Extended Fields (from Phase 1 Feature 003):**
- `priority` - Enum: 'high' | 'medium' | 'low' | null
- `tags` - Array of strings (JSON field or separate tags table)
- `due_date` - Date, optional
- `recurrence` - Enum: 'daily' | 'weekly' | 'monthly' | null

**Database Constraints:**
- `user_id` MUST be indexed for query performance
- `title` MUST have NOT NULL constraint
- `completed` MUST default to false
- `created_at` MUST default to NOW()
- `updated_at` MUST update automatically on record change

### User Entity (REQUIRED fields)

Managed by Better Auth, but backend MUST reference:
- `id` - UUID primary key
- `email` - String, unique, indexed
- `name` - String, optional
- `created_at` - Timestamp

## Frontend Requirements

### Pages (REQUIRED)
- `/` - Landing page (public)
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/dashboard` - Main todo dashboard (protected)
- `/tasks` - Task list view (protected)
- `/tasks/[id]` - Task detail view (protected)

### Components (REQUIRED)
- TaskList - Display list of tasks with filters/sort
- TaskForm - Create/edit task form
- TaskCard - Individual task display
- AuthGuard - Protect routes requiring authentication
- Navbar - Navigation with user menu

### Responsive Design (REQUIRED)
- Mobile-first design (320px minimum width)
- Tablet breakpoint (768px)
- Desktop breakpoint (1024px)
- All interactive elements MUST be touch-friendly (44px minimum)

## Backend Requirements

### API Endpoints (REQUIRED)

**Authentication (delegated to Better Auth, backend verifies JWT):**
- No backend auth endpoints (Better Auth handles this)

**Tasks:**
- `GET /api/v1/tasks` - List all tasks for authenticated user (with filters/sort)
- `POST /api/v1/tasks` - Create new task
- `GET /api/v1/tasks/{id}` - Get single task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `PATCH /api/v1/tasks/{id}/complete` - Toggle completion status

**Query Parameters (supported on GET /api/v1/tasks):**
- `?status=pending|completed` - Filter by completion status
- `?priority=high|medium|low` - Filter by priority
- `?tags=work,personal` - Filter by tags (comma-separated)
- `?sort=created_at|due_date|priority` - Sort field
- `?order=asc|desc` - Sort direction

### Middleware (REQUIRED)
- JWT verification middleware (runs on all protected routes)
- CORS middleware (configured with allowed origins)
- Request validation middleware (Pydantic)
- Error handling middleware (consistent error responses)

## Quality Standards

All code MUST meet the following quality standards:

**Frontend:**
- TypeScript strict mode enabled
- No `any` types without explicit justification
- All components properly typed (Props interfaces)
- Accessibility (WCAG 2.1 Level AA minimum)
- Responsive design tested on mobile/tablet/desktop

**Backend:**
- Type hints on all functions
- Pydantic models for all request/response schemas
- Async/await for I/O operations where beneficial
- Proper error handling with appropriate status codes
- All endpoints include API documentation (OpenAPI/Swagger)

**Database:**
- All migrations reversible (up and down)
- All foreign keys properly indexed
- All user-data tables include user_id
- All tables include timestamps

**General:**
- Clean and readable code (self-documenting)
- Small, focused functions with single responsibilities
- No dead code or unused imports
- Comprehensive docstrings/JSDoc comments
- No hardcoded secrets or environment-specific values

## Testing Requirements

**Manual Testing (REQUIRED before deployment):**
- All user flows tested end-to-end
- Authentication flow verified (register, login, logout)
- All CRUD operations tested for tasks
- Filter and sort functionality verified
- Multi-user isolation tested (two users cannot see each other's tasks)
- Error cases tested (invalid input, unauthorized access)

**Automated Testing (OPTIONAL for Phase 2):**
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## Governance

This constitution supersedes all other development practices. Any amendments to this constitution MUST be documented with rationale and approved before taking effect.

**Compliance:**
- All specifications, plans, and tasks MUST be verified against this constitution
- Any complexity introduced MUST be justified explicitly
- All code generation MUST be performed by Claude Code (no manual coding by humans)
- Security requirements MUST be verified at every stage (spec, plan, implementation)

**Amendment Process:**
- Amendments require explicit documentation of the change and rationale
- Version must be incremented according to semantic versioning:
  - MAJOR: Breaking changes to architecture, technology stack, or core principles
  - MINOR: New principles, requirements, or substantial additions
  - PATCH: Clarifications, typo fixes, non-breaking refinements
- All dependent templates and documentation must be updated to reflect amendments
- All active features must be reviewed for constitutional compliance after amendments

**Version:** 2.0.0 | **Ratified:** 2026-01-05 | **Last Amended:** 2026-01-05

## Amendment History

### Version 2.0.0 (2026-01-05)

**Amendment:** Complete architectural transformation to full-stack web application

**Rationale:** Phase 2 evolves the CLI application into a production-ready web application with secure authentication, persistent storage, and multi-user support. This enables real-world usage while preserving all Phase 1 functionality in a web-based interface.

**Major Changes:**
- **Technology Stack:** Added Next.js 16+ (frontend), FastAPI (backend), Neon PostgreSQL (database), Better Auth (authentication)
- **Architecture:** Transformed from single-layer CLI to three-layer full-stack (frontend/backend/database)
- **Storage:** Replaced in-memory storage with persistent PostgreSQL database
- **Authentication:** Added stateless JWT-based authentication with Better Auth
- **Multi-User:** Added user isolation and data separation requirements
- **Security:** Added three new security-focused principles (VI, VII, VIII)
- **Constraints:** Removed CLI-only and in-memory constraints; added full-stack constraints
- **API Design:** Added comprehensive RESTful API design principles
- **Data Model:** Extended Task entity with user_id and database-specific fields (UUID, timestamps)
- **Frontend Requirements:** Added responsive UI, routing, and component requirements
- **Backend Requirements:** Added API endpoints, middleware, and authentication verification requirements

**Breaking Changes from Phase 1:**
- CLI interface replaced with web interface
- In-memory storage replaced with PostgreSQL
- Single-user design replaced with multi-user architecture
- Python-only codebase expanded to TypeScript (frontend) + Python (backend)

**Preserved from Phase 1:**
- All task management features (CRUD, priorities, tags, due dates, recurring tasks)
- Core SDD principles (specification → plan → tasks → implementation)
- Code quality standards
- Simplicity over complexity philosophy
- Scope discipline

**Out of Scope (Explicit):**
- AI/Chatbot features
- Kubernetes/cloud orchestration
- Background worker processes
- Admin panels or user management dashboards

**Impact:** Enables development of a production-ready, multi-user web application while maintaining SDD discipline and preserving all Phase 1 functionality. All future features must comply with full-stack architecture and security requirements.

### Version 1.2.0 (2026-01-04)

**Amendment:** Extended Task Entity Rules to support advanced task management features

**Rationale:** Enable organizational and productivity features (priorities, tags, due dates, recurring tasks) while maintaining CLI-only and in-memory constraints.

**Changes:**
- Added Extended Attributes subsection to Task Entity Rules
- Added priority, tags, due_date, recurrence attributes (all optional)
- Maintained backward compatibility

**Impact:** Enabled Feature 003 (advanced task management) while maintaining Phase 1 architectural constraints.

### Version 1.1.0 (2026-01-03)

**Amendment:** Updated Principle V from "No Features Beyond Phase I Scope" to "Scope Discipline and Controlled Enhancement"

**Rationale:** Allow controlled feature expansion through proper SDD workflow while maintaining scope discipline.

**Changes:**
- Renamed Principle V to reflect controlled enhancement approach
- Added SDD workflow requirement for all new features
- Maintained core constraints unless explicitly amended

**Impact:** Enabled Feature 002 (search/filter/sort) through proper SDD workflow.
