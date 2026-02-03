"""
Agent data models for tracking AI agent interactions.
"""
from sqlmodel import Field, SQLModel, Column
from sqlalchemy import String, JSON, ForeignKey, Text
from datetime import datetime
from uuid import uuid4
from typing import Optional, Dict, Any
from enum import Enum


def generate_uuid() -> str:
    """Generate a UUID string."""
    return str(uuid4())


class AgentTypeEnum(str, Enum):
    """Types of AI agents."""
    PRIORITIZER = "prioritizer"
    DECOMPOSER = "decomposer"
    SCHEDULER = "scheduler"
    REMINDER = "reminder"
    CHAT = "chat"


class AgentStatusEnum(str, Enum):
    """Agent execution status."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class AgentLog(SQLModel, table=True):
    """
    Log entry for agent executions.
    Tracks all AI agent interactions for history and debugging.

    Attributes:
        id: Unique log entry ID
        user_id: User who triggered the agent
        agent_type: Type of agent executed
        input_data: Input parameters (JSON)
        output_data: Agent response (JSON)
        status: Execution status
        error_message: Error details if failed
        execution_time_ms: Execution duration in milliseconds
        created_at: Timestamp of execution
    """
    __tablename__ = "agent_logs"

    id: str = Field(
        default_factory=generate_uuid,
        sa_column=Column(String(36), primary_key=True)
    )
    user_id: str = Field(
        sa_column=Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    )
    agent_type: AgentTypeEnum = Field(nullable=False)
    input_data: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False)
    )
    output_data: Dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False)
    )
    status: AgentStatusEnum = Field(
        default=AgentStatusEnum.PENDING,
        nullable=False
    )
    error_message: Optional[str] = Field(
        default=None,
        sa_column=Column(Text, nullable=True)
    )
    execution_time_ms: Optional[int] = Field(default=None)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )


class AgentMessage(SQLModel, table=True):
    """
    Chat message in agent conversation.
    Tracks conversation history for chat-based agent interactions.

    Attributes:
        id: Unique message ID
        user_id: User in conversation
        role: Message role (user/assistant/system)
        content: Message content
        agent_type: Agent that handled this message
        created_at: Message timestamp
    """
    __tablename__ = "agent_messages"

    id: str = Field(
        default_factory=generate_uuid,
        sa_column=Column(String(36), primary_key=True)
    )
    user_id: str = Field(
        sa_column=Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    )
    role: str = Field(nullable=False)  # "user", "assistant", "system"
    content: str = Field(
        sa_column=Column(Text, nullable=False)
    )
    agent_type: Optional[AgentTypeEnum] = Field(default=AgentTypeEnum.CHAT)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
