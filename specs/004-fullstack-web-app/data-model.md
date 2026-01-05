# Data Model: Full-Stack Web Application

**Feature**: 004-fullstack-web-app
**Date**: 2026-01-05
**Database**: Neon Serverless PostgreSQL
**ORM**: SQLModel

---

## Overview

This data model defines the database schema for the full-stack todo application. The model consists of two primary entities: **User** (managed by Better Auth) and **Task** (created and managed by backend application). All user-data tables enforce data isolation through `user_id` foreign keys.

**Key Principles**:
- User data isolation (every task belongs to exactly one user)
- Type safety (SQLModel provides Pydantic-based validation)
- Reversible migrations (Alembic for schema changes)
- Timestamps on all tables (created_at, updated_at)
- UUID primary keys for security (prevent ID guessing)

---

## Entity: User

**Purpose**: Represents an authenticated user account

**Management**: Managed entirely by Better Auth library (no manual backend code needed)

**Table Name**: `users` (Better Auth convention)

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | Unique user identifier |
| `email` | VARCHAR(320) | UNIQUE, NOT NULL, INDEXED | User's email address (used for login) |
| `name` | VARCHAR(255) | NULLABLE | User's display name (optional) |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password (never plaintext) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last account update timestamp |

### Constraints

- **Primary Key**: `id` (UUID)
- **Unique**: `email` (prevents duplicate accounts)
- **Indexed**: `email` (for fast login lookups)

### Relationships

- **One-to-Many** with Task: One user has many tasks

### Notes

- This table is created and managed by Better Auth during its initialization
- Backend application only references this table via foreign keys
- Password hashing and authentication logic is handled by Better Auth
- No backend SQLModel model needed for this entity (Better Auth manages schema)

---

## Entity: Task

**Purpose**: Represents a single todo item belonging to a user

**Management**: Created and managed by backend application (FastAPI + SQLModel)

**Table Name**: `tasks`

### Attributes

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | Unique task identifier |
| `user_id` | UUID | FOREIGN KEY (users.id), NOT NULL, INDEXED | Owner of this task (enforces data isolation) |
| `title` | VARCHAR(200) | NOT NULL, CHECK (length > 0) | Task title (required, non-empty) |
| `description` | TEXT | NULLABLE | Detailed task description (optional, max 2000 chars in app validation) |
| `completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status (true = completed, false = pending) |
| `priority` | VARCHAR(20) | NULLABLE, CHECK (IN ('high', 'medium', 'low')) | Task priority (optional) |
| `tags` | JSONB | NULLABLE, DEFAULT '[]' | Array of string tags for categorization (optional) |
| `due_date` | DATE | NULLABLE | Task deadline date (optional) |
| `recurrence` | VARCHAR(20) | NULLABLE, CHECK (IN ('daily', 'weekly', 'monthly')) | Recurrence pattern (optional) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last task update timestamp |

### Constraints

- **Primary Key**: `id` (UUID)
- **Foreign Key**: `user_id` references `users(id)` ON DELETE CASCADE
- **Not Null**: `id`, `user_id`, `title`, `completed`, `created_at`, `updated_at`
- **Indexed**: `user_id` (for fast user-specific queries)
- **Check Constraints**:
  - `title` must have length > 0
  - `priority` must be one of: 'high', 'medium', 'low', or NULL
  - `recurrence` must be one of: 'daily', 'weekly', 'monthly', or NULL

### Relationships

- **Many-to-One** with User: Many tasks belong to one user

### Indexes

```sql
-- Primary index (automatic)
CREATE INDEX idx_tasks_pkey ON tasks (id);

-- User lookup index (CRITICAL for performance and data isolation)
CREATE INDEX idx_tasks_user_id ON tasks (user_id);

-- Optional query optimization indexes
CREATE INDEX idx_tasks_completed ON tasks (completed);
CREATE INDEX idx_tasks_due_date ON tasks (due_date) WHERE due_date IS NOT NULL;
```

### Default Values

- `completed`: `false` (new tasks are incomplete by default)
- `tags`: `[]` (empty array if not specified)
- `created_at`: `NOW()` (set automatically on insert)
- `updated_at`: `NOW()` (set automatically on insert, updated on modify)

### Validation Rules

**Backend Application Validation** (Pydantic schemas):
- `title`: Required, 1-200 characters
- `description`: Optional, max 2000 characters
- `priority`: Optional, must be 'high' | 'medium' | 'low'
- `tags`: Optional, array of strings
- `due_date`: Optional, must be valid ISO date (YYYY-MM-DD)
- `recurrence`: Optional, must be 'daily' | 'weekly' | 'monthly'

**Database-Level Validation** (CHECK constraints):
- `title` not empty
- `priority` enum validation
- `recurrence` enum validation

### Notes

- **user_id is CRITICAL**: Every query MUST filter by `user_id` to enforce data isolation
- **UUID over integer IDs**: Prevents ID enumeration attacks (users can't guess other task IDs)
- **JSONB for tags**: Flexible array storage; supports JSON operations for tag filtering
- **ON DELETE CASCADE**: If a user is deleted, all their tasks are automatically removed
- **Extended attributes** (priority, tags, due_date, recurrence): Preserve Phase 1 Feature 003 functionality

---

## SQLModel Implementation

### Task Model

```python
# backend/src/models/task.py
from sqlmodel import Field, SQLModel
from datetime import datetime, date
from uuid import UUID, uuid4
from typing import Optional
from enum import Enum

class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class RecurrenceEnum(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False, nullable=False)
    priority: Optional[PriorityEnum] = Field(default=None)
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSONB))
    due_date: Optional[date] = Field(default=None)
    recurrence: Optional[RecurrenceEnum] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
```

### User Reference

```python
# backend/src/models/user.py
from sqlmodel import SQLModel, Field
from uuid import UUID
from datetime import datetime

class User(SQLModel, table=True):
    """
    User entity - managed by Better Auth.
    This model is for reference only; Better Auth handles the actual schema.
    """
    __tablename__ = "users"

    id: UUID = Field(primary_key=True)
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)
    created_at: datetime
    updated_at: datetime
```

---

## Pydantic Schemas (Request/Response)

### Task Schemas

```python
# backend/src/schemas/task.py
from pydantic import BaseModel, Field, field_validator
from datetime import date, datetime
from uuid import UUID
from typing import Optional
from src.models.task import PriorityEnum, RecurrenceEnum

class TaskCreate(BaseModel):
    """Schema for creating a new task"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    priority: Optional[PriorityEnum] = None
    tags: list[str] = Field(default_factory=list)
    due_date: Optional[date] = None
    recurrence: Optional[RecurrenceEnum] = None

class TaskUpdate(BaseModel):
    """Schema for updating an existing task"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    priority: Optional[PriorityEnum] = None
    tags: Optional[list[str]] = None
    due_date: Optional[date] = None
    recurrence: Optional[RecurrenceEnum] = None

class TaskResponse(BaseModel):
    """Schema for task responses"""
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    completed: bool
    priority: Optional[PriorityEnum]
    tags: list[str]
    due_date: Optional[date]
    recurrence: Optional[RecurrenceEnum]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enable ORM mode for SQLModel compatibility
```

---

## Database Migrations (Alembic)

### Initial Migration

```python
# alembic/versions/001_initial_schema.py
"""Initial schema: users and tasks tables

Revision ID: 001
Create Date: 2026-01-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime

def upgrade():
    # Users table (managed by Better Auth, created here for reference)
    op.create_table(
        'users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(320), unique=True, nullable=False, index=True),
        sa.Column('name', sa.String(255), nullable=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    # Tasks table
    op.create_table(
        'tasks',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('priority', sa.String(20), nullable=True),
        sa.Column('tags', JSONB, nullable=False, server_default='[]'),
        sa.Column('due_date', sa.Date(), nullable=True),
        sa.Column('recurrence', sa.String(20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("char_length(title) > 0", name="check_title_not_empty"),
        sa.CheckConstraint("priority IN ('high', 'medium', 'low') OR priority IS NULL", name="check_priority_enum"),
        sa.CheckConstraint("recurrence IN ('daily', 'weekly', 'monthly') OR recurrence IS NULL", name="check_recurrence_enum"),
    )

    # Additional indexes
    op.create_index('idx_tasks_completed', 'tasks', ['completed'])
    op.create_index('idx_tasks_due_date', 'tasks', ['due_date'], postgresql_where=sa.text('due_date IS NOT NULL'))

def downgrade():
    op.drop_table('tasks')
    op.drop_table('users')
```

---

## State Transitions

### Task Completion Status

```
[Created] → completed = false (default)
    ↓
[Toggled] → completed = true
    ↓
[Toggled] → completed = false
```

**Rules**:
- Tasks start as incomplete (`completed = false`)
- Users can toggle completion via PATCH /api/v1/tasks/{id}/complete
- No restrictions on toggling (can mark complete/incomplete multiple times)

### Recurring Tasks

```
[Created with recurrence] → due_date = 2026-01-10, recurrence = "weekly"
    ↓
[Marked complete] → Task marked completed, NEW task created with due_date = 2026-01-17
```

**Rules**:
- When a recurring task is marked complete, a NEW task is created
- New task has same title, description, priority, tags, recurrence
- New task's due_date is calculated based on recurrence pattern:
  - `daily`: +1 day
  - `weekly`: +7 days
  - `monthly`: +1 month (same day)
- Original task remains marked as completed (creates task history)

---

## Query Patterns

### Data Isolation (CRITICAL)

**ALL queries MUST filter by user_id**:

```python
# CORRECT - Filters by authenticated user
statement = select(Task).where(Task.user_id == current_user_id)
tasks = session.exec(statement).all()

# INCORRECT - Returns all tasks (SECURITY VIOLATION)
statement = select(Task)  # Missing user_id filter!
tasks = session.exec(statement).all()
```

### Common Queries

```python
# List all tasks for user
statement = select(Task).where(Task.user_id == current_user_id)

# Filter by completion status
statement = select(Task).where(
    Task.user_id == current_user_id,
    Task.completed == True
)

# Filter by priority
statement = select(Task).where(
    Task.user_id == current_user_id,
    Task.priority == "high"
)

# Filter by tag (JSONB query)
statement = select(Task).where(
    Task.user_id == current_user_id,
    Task.tags.contains(["work"])
)

# Sort by due date
statement = select(Task).where(
    Task.user_id == current_user_id
).order_by(Task.due_date.asc())
```

---

## Data Isolation Enforcement

**Architecture**:
1. Frontend sends JWT with every API request
2. Backend `get_current_user` dependency extracts `user_id` from JWT
3. ALL endpoint handlers receive `current_user_id: str = Depends(get_current_user)`
4. ALL database queries filter by `current_user_id`

**Example Endpoint**:
```python
@router.get("/tasks", response_model=list[TaskResponse])
async def list_tasks(
    current_user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    statement = select(Task).where(Task.user_id == UUID(current_user_id))
    tasks = session.exec(statement).all()
    return tasks
```

**Security Verification**:
- User A (user_id = "123") can ONLY query tasks where `task.user_id == "123"`
- User B (user_id = "456") can ONLY query tasks where `task.user_id == "456"`
- No endpoint may bypass this filter

---

## Summary

| Entity | Table | Purpose | Management |
|--------|-------|---------|------------|
| User | `users` | Authenticated user accounts | Better Auth |
| Task | `tasks` | User's todo items | Backend (FastAPI + SQLModel) |

**Key Takeaways**:
- UUID primary keys prevent ID enumeration
- `user_id` foreign key on all user-data tables (currently just tasks)
- ALL queries filter by authenticated user_id (enforced at API layer)
- JSONB for flexible tags storage
- Alembic manages reversible schema migrations
- Extended attributes (priority, tags, due_date, recurrence) preserve Phase 1 functionality

**Status**: ✅ Data model complete; ready for API contract generation
