"""
Agent API schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class AgentTypeEnum(str, Enum):
    """Types of AI agents."""
    PRIORITIZER = "prioritizer"
    DECOMPOSER = "decomposer"
    SCHEDULER = "scheduler"
    REMINDER = "reminder"
    CHAT = "chat"


# --- Request Schemas ---

class PrioritizeRequest(BaseModel):
    """Request to prioritize tasks."""
    task_ids: List[str] = Field(..., description="List of task IDs to prioritize")
    context: Optional[str] = Field(None, description="Additional context for prioritization")


class DecomposeRequest(BaseModel):
    """Request to decompose a task into subtasks."""
    task_id: str = Field(..., description="ID of task to decompose")
    max_subtasks: int = Field(10, ge=1, le=20, description="Maximum subtasks to generate")
    detail_level: str = Field("medium", description="Detail level: brief, medium, or detailed")


class ChatRequest(BaseModel):
    """Request for agent chat interaction."""
    message: str = Field(..., min_length=1, max_length=2000, description="User message")
    agent_type: AgentTypeEnum = Field(AgentTypeEnum.CHAT, description="Agent to use")


# --- Response Schemas ---

class PriorityRecommendation(BaseModel):
    """Priority recommendation for a single task."""
    task_id: str
    priority: str  # high, medium, low
    reason: str


class PrioritizeResponse(BaseModel):
    """Response from prioritization agent."""
    success: bool
    priorities: List[PriorityRecommendation]
    message: str


class SubtaskRecommendation(BaseModel):
    """Subtask recommendation."""
    title: str
    description: Optional[str] = ""
    priority: str = "medium"
    effort: str = "medium"


class DecomposeResponse(BaseModel):
    """Response from decomposition agent."""
    success: bool
    parent_task_id: str
    subtasks: List[SubtaskRecommendation]
    message: str


class ChatMessage(BaseModel):
    """Chat message in conversation."""
    role: str  # user, assistant
    content: str
    timestamp: datetime


class ChatResponse(BaseModel):
    """Response from chat agent."""
    success: bool
    message: str
    agent_type: AgentTypeEnum


class AgentLogResponse(BaseModel):
    """Agent log entry response."""
    id: str
    agent_type: str
    status: str
    input_summary: str
    output_summary: str
    execution_time_ms: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class HealthCheckResponse(BaseModel):
    """LLM health check response."""
    primary: Dict[str, Any]
    fallback: Dict[str, Any]
