"""
Task data model.
"""
from sqlmodel import Field, SQLModel, Column
from sqlalchemy.dialects.postgresql import UUID as PGUUID, JSONB
from datetime import datetime, date
from uuid import UUID, uuid4
from typing import Optional, List
from enum import Enum


class PriorityEnum(str, Enum):
    """Task priority levels."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RecurrenceEnum(str, Enum):
    """Task recurrence patterns."""
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class Task(SQLModel, table=True):
    """
    Task entity representing a todo item.

    Attributes:
        id: Unique task identifier (UUID)
        user_id: Owner's user ID (foreign key)
        title: Task title (required, 1-200 chars)
        description: Task description (optional, max 2000 chars)
        completed: Completion status (default: False)
        priority: Task priority (high/medium/low or None)
        tags: Array of string tags (JSONB)
        due_date: Task deadline date (optional)
        recurrence: Recurrence pattern (daily/weekly/monthly or None)
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """
    __tablename__ = "tasks"

    id: UUID = Field(
        default_factory=uuid4,
        sa_column=Column(PGUUID(as_uuid=True), primary_key=True)
    )
    user_id: UUID = Field(
        sa_column=Column(PGUUID(as_uuid=True), nullable=False, index=True),
        foreign_key="users.id"
    )
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False, nullable=False)
    priority: Optional[PriorityEnum] = Field(default=None)
    tags: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSONB, nullable=False, server_default='[]')
    )
    due_date: Optional[date] = Field(default=None)
    recurrence: Optional[RecurrenceEnum] = Field(default=None)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
