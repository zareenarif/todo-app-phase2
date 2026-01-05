# Research: Full-Stack Web Application

**Feature**: 004-fullstack-web-app
**Date**: 2026-01-05
**Purpose**: Resolve NEEDS CLARIFICATION items from Technical Context and research best practices for full-stack implementation

---

## Research Tasks

### 1. Alembic Migration Setup with SQLModel

**Research Question**: How to set up Alembic database migrations for SQLModel with PostgreSQL?

**Decision**: Use Alembic with SQLModel configuration for type-safe migrations

**Rationale**:
- Alembic is the standard migration tool for SQLAlchemy/SQLModel
- SQLModel is built on SQLAlchemy, so Alembic integrates naturally
- Alembic provides reversible migrations (up/down) as required by constitution
- Neon PostgreSQL is PostgreSQL-compatible, so standard Alembic configuration works

**Implementation Approach**:
1. **Installation**: Include `alembic` in `backend/requirements.txt`
2. **Initialization**: Run `alembic init alembic` in backend directory
3. **Configuration** (`alembic/env.py`):
   - Import SQLModel Base metadata
   - Configure `target_metadata` to use SQLModel.metadata
   - Set database URL from environment variable (`DATABASE_URL`)
4. **Migration Creation**:
   - Auto-generate migrations: `alembic revision --autogenerate -m "description"`
   - Manually review generated migrations for correctness
5. **Migration Execution**:
   - Apply migrations: `alembic upgrade head`
   - Rollback: `alembic downgrade -1` (or specific revision)

**Code Pattern** (alembic/env.py):
```python
from sqlmodel import SQLModel
from src.models.task import Task  # Import all models
from src.core.config import settings

target_metadata = SQLModel.metadata

def run_migrations_online():
    connectable = create_engine(settings.DATABASE_URL)
    # ... rest of alembic migration logic
```

**Alternatives Considered**:
- **Raw SQL migrations**: Rejected because it loses type safety and SQLModel benefits
- **SQLModel-only (no migrations)**: Rejected because schema changes wouldn't be versioned

---

### 2. Testing Strategy for Phase 2

**Research Question**: Should Phase 2 introduce automated testing, or maintain Phase 1's manual-only testing approach?

**Decision**: Manual testing remains primary; automated testing is OPTIONAL but RECOMMENDED for API endpoints

**Rationale**:
- Constitution (v2.0.0) states "Manual Testing (REQUIRED before deployment)" and "Automated Testing (OPTIONAL for Phase 2)"
- Full-stack applications benefit from API contract testing to catch integration issues
- Manual end-to-end testing remains critical for user flows and UI/UX validation
- Automated tests reduce regression risk when adding features

**Implementation Approach**:

**Manual Testing (REQUIRED)**:
- All user stories tested end-to-end via browser
- Authentication flow (register/login/logout) manually verified
- All task CRUD operations tested in UI
- Multi-user isolation verified (two browser sessions, different users)
- Responsive design tested on mobile/tablet/desktop viewports
- Error scenarios tested (invalid input, unauthorized access)

**Automated Testing (OPTIONAL, if time permits)**:
- **Backend API Tests** (pytest):
  - Test each endpoint (GET/POST/PUT/DELETE /api/v1/tasks)
  - Test JWT verification (valid token, invalid token, missing token)
  - Test user isolation (User A cannot access User B's tasks)
  - Test input validation (empty titles, excessive lengths)
- **Frontend Component Tests** (optional, low priority):
  - React Testing Library for component rendering
  - User interaction tests (form submissions, button clicks)

**Testing Tools**:
- Backend: `pytest`, `httpx` (FastAPI test client)
- Frontend (optional): `vitest`, `@testing-library/react`

**Alternatives Considered**:
- **Automated testing only**: Rejected because manual testing provides better coverage of user experience and responsiveness
- **No testing at all**: Rejected because it would violate constitutional quality standards

---

### 3. Better Auth + FastAPI JWT Verification Integration

**Research Question**: How does Better Auth (Next.js) integrate with FastAPI backend for JWT verification?

**Decision**: Better Auth generates JWTs on frontend; FastAPI verifies them independently using shared secret

**Integration Pattern**:

1. **Frontend (Better Auth in Next.js)**:
   - Better Auth handles registration and login
   - Issues JWT signed with `BETTER_AUTH_SECRET` (from environment variable)
   - JWT contains claims: `user_id`, `email`, `exp` (expiration), `iat` (issued at)
   - Frontend stores JWT in HTTP-only cookie (secure, not accessible via JavaScript)
   - Frontend includes JWT in `Authorization: Bearer <token>` header on every API request

2. **Backend (FastAPI JWT Verification)**:
   - Dependency function `get_current_user` in `src/api/deps.py`
   - Extracts token from `Authorization` header
   - Verifies JWT signature using `BETTER_AUTH_SECRET` (same secret as frontend)
   - Decodes JWT to extract `user_id` claim
   - Returns `user_id` to endpoint handlers
   - All protected endpoints use `Depends(get_current_user)`

**Code Pattern** (backend):
```python
# src/api/deps.py
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.BETTER_AUTH_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# src/api/v1/tasks.py
@router.get("/tasks")
async def list_tasks(current_user_id: str = Depends(get_current_user)):
    # Query tasks filtered by current_user_id
    return tasks
```

**Critical Configuration**:
- `BETTER_AUTH_SECRET` MUST be identical in both frontend and backend `.env` files
- JWT algorithm: HS256 (HMAC with SHA-256)
- Token expiration: 24 hours (configurable in Better Auth)

**Rationale**:
- Stateless authentication (no database lookups for session validation)
- Independent verification (backend doesn't depend on frontend for auth state)
- Secure (shared secret never exposed to client; JWT signature prevents tampering)

**Alternatives Considered**:
- **Session-based auth**: Rejected because constitution requires stateless authentication
- **OAuth 2.0**: Rejected because it's out of scope for Phase 2 MVP

---

### 4. CORS Configuration Best Practices

**Research Question**: How to configure CORS for Next.js frontend + FastAPI backend development and production?

**Decision**: Use FastAPI's CORSMiddleware with environment-specific allowed origins

**Configuration Approach**:

**Development**:
```python
# backend/src/core/config.py
CORS_ORIGINS = ["http://localhost:3000"]  # Next.js dev server

# backend/src/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,  # Required for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Production**:
```env
# backend/.env
CORS_ORIGINS=https://app.example.com,https://www.app.example.com
```

**Security Considerations**:
- Never use `allow_origins=["*"]` in production (constitution violation)
- `allow_credentials=True` required for HTTP-only cookies
- `allow_methods` and `allow_headers` can be `["*"]` for simplicity (only GET/POST/PUT/DELETE/PATCH used)

**Rationale**:
- Allows frontend to make API requests from different origin/port
- Protects against unauthorized cross-origin requests
- Supports cookies (required for Better Auth's HTTP-only cookie storage)

**Alternatives Considered**:
- **Same-origin deployment (frontend and backend on same domain)**: Rejected because it complicates deployment and is unnecessary
- **Proxy pattern (Next.js proxy to backend)**: Rejected because it adds complexity and doesn't align with RESTful API pattern

---

### 5. Neon PostgreSQL Connection Best Practices

**Research Question**: How to connect FastAPI/SQLModel to Neon Serverless PostgreSQL?

**Decision**: Use connection pooling with environment-based DATABASE_URL

**Connection Pattern**:

```python
# backend/src/core/database.py
from sqlmodel import Session, create_engine
from src.core.config import settings

# Neon PostgreSQL connection string format:
# postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/dbname?sslmode=require

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True for SQL query logging in development
    pool_pre_ping=True,  # Verify connections before using them
)

def get_session():
    with Session(engine) as session:
        yield session
```

**Usage in Endpoints**:
```python
@router.get("/tasks")
async def list_tasks(
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    statement = select(Task).where(Task.user_id == current_user_id)
    tasks = session.exec(statement).all()
    return tasks
```

**Neon-Specific Considerations**:
- **SSL Required**: Neon enforces `?sslmode=require` in connection string
- **Serverless Pooling**: Neon handles connection pooling automatically (no need for pgbouncer)
- **Idle Timeout**: Neon may suspend database after inactivity; `pool_pre_ping=True` handles reconnection

**Environment Variable**:
```env
DATABASE_URL=postgresql://user:password@ep-example.us-east-2.aws.neon.tech/todo_db?sslmode=require
```

**Rationale**:
- SQLModel's create_engine handles PostgreSQL connections efficiently
- pool_pre_ping ensures connections are valid before use (handles serverless wakeup)
- Dependency injection (get_session) ensures proper session lifecycle

**Alternatives Considered**:
- **Direct SQLAlchemy without SQLModel**: Rejected because SQLModel provides type safety
- **asyncpg for async connections**: Deferred to future optimization (sync connections sufficient for Phase 2 MVP)

---

### 6. Next.js 16 App Router + Better Auth Integration

**Research Question**: How to integrate Better Auth with Next.js 16 App Router for authentication?

**Decision**: Use Better Auth's Next.js App Router adapter with route protection via middleware

**Integration Approach**:

1. **Installation**:
```bash
npm install better-auth
```

2. **Configuration** (`frontend/src/lib/auth.ts`):
```typescript
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  database: {
    // Better Auth manages its own user table in PostgreSQL
    url: process.env.DATABASE_URL!
  },
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours
    updateAge: 60 * 60 // Update session every hour
  }
})
```

3. **Auth Guard Component** (`frontend/src/components/auth/AuthGuard.tsx`):
```typescript
"use client"
import { useSession } from "better-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") return <div>Loading...</div>
  if (status === "unauthenticated") return null

  return <>{children}</>
}
```

4. **Protected Page Example** (`frontend/src/app/(protected)/dashboard/page.tsx`):
```typescript
import { AuthGuard } from "@/components/auth/AuthGuard"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>Dashboard content</div>
    </AuthGuard>
  )
}
```

**Rationale**:
- Better Auth provides built-in Next.js App Router support
- Handles user registration, login, logout, and session management
- Issues JWTs automatically with configured secret
- Manages user table in database (no manual user model needed)

**Alternatives Considered**:
- **NextAuth.js**: Rejected because Better Auth has better TypeScript support and simpler configuration
- **Custom JWT auth**: Rejected because it violates "use established libraries" constitutional principle

---

## Summary of Decisions

| Research Area | Decision | Key Rationale |
|---------------|----------|---------------|
| Database Migrations | Alembic with SQLModel | Standard, type-safe, reversible migrations |
| Testing Strategy | Manual (required) + API tests (optional) | Balances coverage with constitutional constraints |
| JWT Verification | Shared secret between Better Auth & FastAPI | Stateless, independent verification |
| CORS | FastAPI CORSMiddleware with env-specific origins | Security + development flexibility |
| Database Connection | SQLModel engine with pool_pre_ping | Handles Neon serverless characteristics |
| Better Auth Integration | Better Auth with App Router adapter | Established library, built-in JWT support |

---

## Remaining Implementation Details

All "NEEDS CLARIFICATION" items from Technical Context have been resolved:

- ✅ **Testing**: Manual testing required; automated API tests optional
- ✅ **Alembic setup details**: Configuration pattern and workflow defined
- ✅ **Better Auth integration**: JWT generation and verification flow specified
- ✅ **CORS configuration**: Development and production patterns documented
- ✅ **Neon PostgreSQL connection**: Connection string format and pooling strategy defined

**Status**: ✅ Phase 0 research complete; ready for Phase 1 design (data model and contracts)
