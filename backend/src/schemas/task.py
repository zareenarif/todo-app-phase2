"""
Pydantic schemas for Task API request/response validation.
"""
from pydantic import BaseModel, Field, ConfigDict, field_validator
from datetime import datetime, date
from uuid import UUID
from typing import Optional, List
from src.models.task import PriorityEnum, RecurrenceEnum


class TaskCreate(BaseModel):
    """
    Task creation schema - validates task creation requests.
    Only title is required, all other fields are optional.
    """
    title: str = Field(..., min_length=1, max_length=200, description="Task title (required)")
    description: Optional[str] = Field(None, max_length=2000, description="Task description (optional)")
    priority: Optional[PriorityEnum] = Field(None, description="Task priority: high, medium, or low")
    tags: Optional[List[str]] = Field(default_factory=list, description="List of tags")
    due_date: Optional[date] = Field(None, description="Due date in YYYY-MM-DD format")
    recurrence: Optional[RecurrenceEnum] = Field(None, description="Recurrence pattern: daily, weekly, or monthly")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: str) -> str:
        """Ensure title is not empty or whitespace-only."""
        if not v or not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()


class TaskUpdate(BaseModel):
    """
    Task update schema - validates task update requests.
    All fields are optional for partial updates.
    """
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Task title")
    description: Optional[str] = Field(None, max_length=2000, description="Task description")
    priority: Optional[PriorityEnum] = Field(None, description="Task priority: high, medium, or low")
    tags: Optional[List[str]] = Field(None, description="List of tags")
    due_date: Optional[date] = Field(None, description="Due date in YYYY-MM-DD format")
    recurrence: Optional[RecurrenceEnum] = Field(None, description="Recurrence pattern: daily, weekly, or monthly")

    @field_validator('title')
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        """Ensure title is not empty or whitespace-only if provided."""
        if v is not None:
            if not v or not v.strip():
                raise ValueError('Title cannot be empty')
            return v.strip()
        return v


class TaskResponse(BaseModel):
    """
    Task response schema - returned from API endpoints.
    Includes all task fields with proper type conversion from SQLModel.
    """
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str] = None
    completed: bool
    priority: Optional[PriorityEnum] = None
    tags: List[str] = Field(default_factory=list)
    due_date: Optional[date] = None
    recurrence: Optional[RecurrenceEnum] = None
    created_at: datetime
    updated_at: datetime

    # Enable ORM mode for SQLModel compatibility
    model_config = ConfigDict(from_attributes=True)
