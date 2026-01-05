# Quick Start Guide: Full-Stack Web Application

**Feature**: 004-fullstack-web-app
**Date**: 2026-01-05
**Audience**: Developers implementing this feature

---

## Overview

This guide provides a step-by-step walkthrough to implement the full-stack todo web application from scratch. Follow these steps in order to build the Next.js frontend, FastAPI backend, and PostgreSQL database integration.

---

## Prerequisites

**Required**:
- Python 3.11+ installed
- Node.js 18+ installed
- Neon PostgreSQL database created (get connection string from neon.tech)
- Git repository initialized

**Knowledge**:
- TypeScript basics
- Python basics
- REST API concepts
- JWT authentication basics

---

## Phase 1: Environment Setup

### Step 1.1: Create Neon PostgreSQL Database

1. Visit [neon.tech](https://neon.tech) and create a free account
2. Create a new project (e.g., "todo-app")
3. Create a new database (e.g., "todo_db")
4. Copy the connection string (format: `postgresql://user:password@ep-example.us-east-2.aws.neon.tech/todo_db?sslmode=require`)

### Step 1.2: Generate Shared Secret

```bash
# Generate a secure random secret (32+ characters)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Save this value as `BETTER_AUTH_SECRET` (used in both frontend and backend)

### Step 1.3: Create Environment Files

**Frontend** (create `frontend/.env.local`):
```env
BETTER_AUTH_SECRET=<your-generated-secret>
DATABASE_URL=<your-neon-connection-string>
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Backend** (create `backend/.env`):
```env
BETTER_AUTH_SECRET=<your-generated-secret>
DATABASE_URL=<your-neon-connection-string>
CORS_ORIGINS=http://localhost:3000
```

**CRITICAL**: `BETTER_AUTH_SECRET` MUST be identical in both files

---

## Phase 2: Backend Implementation

### Step 2.1: Initialize Backend Project

```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 2.2: Install Dependencies

Create `backend/requirements.txt`:
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlmodel==0.0.14
pydantic==2.5.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
alembic==1.13.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
```

Install:
```bash
pip install -r requirements.txt
```

### Step 2.3: Create Project Structure

```bash
mkdir -p src/{models,schemas,api/{v1},core,middleware} alembic/versions tests
touch src/__init__.py src/models/__init__.py src/schemas/__init__.py
touch src/api/__init__.py src/api/v1/__init__.py src/core/__init__.py
touch src/middleware/__init__.py src/main.py
```

### Step 2.4: Implement Core Configuration

See `specs/004-fullstack-web-app/data-model.md` for SQLModel models and `specs/004-fullstack-web-app/contracts/api-spec.yaml` for API schemas.

**Key Files to Implement**:
1. `src/core/config.py` - Environment variable configuration
2. `src/core/database.py` - SQLModel database engine setup
3. `src/core/security.py` - JWT verification utilities
4. `src/models/task.py` - Task SQLModel entity
5. `src/schemas/task.py` - Pydantic request/response schemas
6. `src/api/deps.py` - get_current_user dependency
7. `src/api/v1/tasks.py` - Task endpoints
8. `src/middleware/cors.py` - CORS configuration
9. `src/main.py` - FastAPI application

### Step 2.5: Initialize Alembic

```bash
alembic init alembic
```

Edit `alembic/env.py` to import SQLModel.metadata (see `specs/004-fullstack-web-app/research.md` section 1)

### Step 2.6: Create Initial Migration

```bash
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

Verify tables created in Neon dashboard (users, tasks)

### Step 2.7: Run Backend

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000/docs` to see Swagger UI

---

## Phase 3: Frontend Implementation

### Step 3.1: Initialize Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir
cd frontend
```

Answer prompts:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: No (use `app/` directly)
- App Router: Yes
- Import alias: Yes (@/*)

### Step 3.2: Install Dependencies

```bash
npm install better-auth
npm install -D @types/node
```

### Step 3.3: Create Project Structure

```bash
mkdir -p app/\(auth\)/login app/\(auth\)/register
mkdir -p app/\(protected\)/dashboard app/\(protected\)/tasks/[id]
mkdir -p components/{tasks,auth,layout} lib
```

### Step 3.4: Configure Better Auth

Create `lib/auth.ts` (see `specs/004-fullstack-web-app/research.md` section 6)

### Step 3.5: Implement Key Components

**Key Files to Implement**:
1. `lib/types.ts` - TypeScript interfaces (Task, TaskCreate, TaskUpdate)
2. `lib/api.ts` - API client functions (listTasks, createTask, etc.)
3. `components/auth/AuthGuard.tsx` - Route protection component
4. `components/layout/Navbar.tsx` - Navigation with logout
5. `components/tasks/TaskList.tsx` - Display task list
6. `components/tasks/TaskForm.tsx` - Create/edit task form
7. `components/tasks/TaskCard.tsx` - Individual task display
8. `app/page.tsx` - Landing page
9. `app/(auth)/login/page.tsx` - Login page
10. `app/(auth)/register/page.tsx` - Registration page
11. `app/(protected)/dashboard/page.tsx` - Main dashboard
12. `app/(protected)/tasks/page.tsx` - Task list page

See `specs/004-fullstack-web-app/contracts/frontend-backend-contract.md` for API integration details

### Step 3.6: Run Frontend

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Phase 4: Integration Testing

### Test 1: Authentication Flow

1. Visit `http://localhost:3000`
2. Click "Register" and create account (email + password)
3. Verify redirect to `/dashboard`
4. Logout
5. Login with same credentials
6. Verify successful login and redirect to `/dashboard`

### Test 2: Task CRUD Operations

1. Login as User A
2. Create task: "Buy groceries" (title only)
3. Verify task appears in task list
4. Create task: "Complete report" with description, priority "high", tags "work"
5. Update "Buy groceries" title to "Buy groceries and cook dinner"
6. Toggle completion status of "Buy groceries"
7. Delete "Complete report"
8. Verify all operations succeed

### Test 3: Multi-User Isolation

1. Open two browser sessions (or two different browsers)
2. **Session 1**: Register as user1@example.com, create 3 tasks
3. **Session 2**: Register as user2@example.com, create 2 tasks
4. **Session 1**: Verify sees only 3 tasks (not user2's tasks)
5. **Session 2**: Verify sees only 2 tasks (not user1's tasks)
6. **Session 1**: Copy task ID from browser dev tools Network tab
7. **Session 2**: Attempt to access user1's task ID via API (should get 403 Forbidden)

### Test 4: Responsive Design

1. Open browser dev tools (F12)
2. Toggle device toolbar (mobile viewport simulation)
3. Test on iPhone SE (375x667), iPad (768x1024), Desktop (1920x1080)
4. Verify layout adapts to screen size
5. Verify buttons are touch-friendly (≥44px)

### Test 5: Error Handling

1. Attempt to create task with empty title (should show validation error)
2. Logout and attempt to access `/dashboard` directly (should redirect to login)
3. Login, then manually clear JWT cookie in dev tools, refresh page (should redirect to login)
4. Stop backend server, attempt to create task (should show network error)

---

## Phase 5: Deployment Preparation

### Step 5.1: Update Environment Variables for Production

**Frontend** (`.env.production` or hosting provider dashboard):
```env
BETTER_AUTH_SECRET=<production-secret>
DATABASE_URL=<production-neon-url>
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
```

**Backend** (`.env` or hosting provider dashboard):
```env
BETTER_AUTH_SECRET=<production-secret>
DATABASE_URL=<production-neon-url>
CORS_ORIGINS=https://app.example.com,https://www.app.example.com
```

### Step 5.2: Run Database Migrations in Production

```bash
# On production backend server
alembic upgrade head
```

### Step 5.3: Security Checklist

- [ ] `BETTER_AUTH_SECRET` is strong (32+ characters, random)
- [ ] `BETTER_AUTH_SECRET` is identical in frontend and backend
- [ ] HTTPS enforced (no HTTP in production)
- [ ] CORS_ORIGINS set to specific domains (not "*")
- [ ] Environment variables not committed to Git
- [ ] `.env` files added to `.gitignore`
- [ ] Database connection uses SSL (`?sslmode=require`)
- [ ] All API endpoints require JWT (except auth endpoints)

---

## Troubleshooting

### Issue: "CORS policy blocked"

**Symptom**: Frontend can't call backend API

**Solution**:
- Verify backend `CORS_ORIGINS` includes frontend URL
- Check `CORSMiddleware` configuration in `backend/src/main.py`
- Verify `allow_credentials=True` is set

### Issue: "Could not validate credentials (401)"

**Symptom**: All API requests return 401

**Solution**:
- Verify `BETTER_AUTH_SECRET` matches in frontend and backend `.env` files
- Check JWT is being sent in `Authorization: Bearer <token>` header
- Verify Better Auth is issuing JWT correctly (check browser cookies)

### Issue: "Task not found (404)" but task exists

**Symptom**: Cannot access own task

**Solution**:
- Verify `user_id` filter in backend queries
- Check JWT contains `user_id` claim
- Verify `get_current_user` dependency extracts user_id correctly

### Issue: Can see other users' tasks

**Symptom**: Multi-user isolation broken

**Solution**:
- **CRITICAL SECURITY BUG**: All queries MUST filter by user_id
- Review every endpoint in `backend/src/api/v1/tasks.py`
- Ensure all SELECT queries include `.where(Task.user_id == current_user_id)`

### Issue: Database connection failed

**Symptom**: "could not connect to server"

**Solution**:
- Verify Neon connection string is correct
- Check `?sslmode=require` is in connection string
- Verify Neon database is not paused (auto-pauses after inactivity)
- Test connection: `psql <DATABASE_URL>`

---

## Development Commands Reference

### Backend

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Run development server
uvicorn src.main:app --reload --port 8000

# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# View Swagger docs
# http://localhost:8000/docs
```

### Frontend

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Lint code
npm run lint
```

---

## File Checklist

### Backend Files

- [ ] `backend/src/core/config.py` - Environment config
- [ ] `backend/src/core/database.py` - Database engine
- [ ] `backend/src/core/security.py` - JWT verification
- [ ] `backend/src/models/task.py` - Task model
- [ ] `backend/src/schemas/task.py` - Pydantic schemas
- [ ] `backend/src/api/deps.py` - get_current_user
- [ ] `backend/src/api/v1/tasks.py` - Task endpoints
- [ ] `backend/src/middleware/cors.py` - CORS middleware
- [ ] `backend/src/main.py` - FastAPI app
- [ ] `backend/alembic/env.py` - Alembic config
- [ ] `backend/alembic/versions/001_initial.py` - Initial migration
- [ ] `backend/requirements.txt` - Python dependencies
- [ ] `backend/.env` - Environment variables (NOT committed)
- [ ] `backend/.env.example` - Example environment variables (committed)

### Frontend Files

- [ ] `frontend/lib/types.ts` - TypeScript types
- [ ] `frontend/lib/api.ts` - API client
- [ ] `frontend/lib/auth.ts` - Better Auth config
- [ ] `frontend/components/auth/AuthGuard.tsx` - Route protection
- [ ] `frontend/components/layout/Navbar.tsx` - Navigation
- [ ] `frontend/components/tasks/TaskList.tsx` - Task list
- [ ] `frontend/components/tasks/TaskForm.tsx` - Task form
- [ ] `frontend/components/tasks/TaskCard.tsx` - Task card
- [ ] `frontend/app/page.tsx` - Landing page
- [ ] `frontend/app/(auth)/login/page.tsx` - Login
- [ ] `frontend/app/(auth)/register/page.tsx` - Register
- [ ] `frontend/app/(protected)/dashboard/page.tsx` - Dashboard
- [ ] `frontend/app/(protected)/tasks/page.tsx` - Tasks page
- [ ] `frontend/package.json` - Node dependencies
- [ ] `frontend/.env.local` - Environment variables (NOT committed)
- [ ] `frontend/.env.local.example` - Example environment variables (committed)

---

## Next Steps

After completing this quickstart:

1. **Review Specification**: Read `specs/004-fullstack-web-app/spec.md` for full requirements
2. **Review Data Model**: Read `specs/004-fullstack-web-app/data-model.md` for database schema details
3. **Review API Contract**: Read `specs/004-fullstack-web-app/contracts/api-spec.yaml` for complete API documentation
4. **Review Frontend-Backend Contract**: Read `specs/004-fullstack-web-app/contracts/frontend-backend-contract.md` for integration patterns
5. **Run Tasks**: Execute `/sp.tasks` to generate implementation task list
6. **Implement**: Execute `/sp.implement` to begin implementation

---

## Summary

**Development Workflow**:
1. Start backend: `uvicorn src.main:app --reload` (port 8000)
2. Start frontend: `npm run dev` (port 3000)
3. Visit: `http://localhost:3000`
4. Register account, create tasks, test functionality

**Production Deployment**:
1. Set environment variables on hosting provider
2. Run `alembic upgrade head` on backend
3. Build frontend: `npm run build`
4. Deploy frontend and backend separately
5. Verify CORS, HTTPS, JWT secret match

**Status**: ✅ Quickstart guide complete
