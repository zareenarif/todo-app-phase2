"""
Base Agent - Abstract class for all AI agents.
Provides common functionality for task-related AI operations.
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

from src.services.llm_service import LLMService, get_llm_service


class AgentType(str, Enum):
    """Types of available agents."""
    PRIORITIZER = "prioritizer"
    DECOMPOSER = "decomposer"
    SCHEDULER = "scheduler"
    REMINDER = "reminder"


class AgentStatus(str, Enum):
    """Agent execution status."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class AgentResponse:
    """Standard response from an agent."""
    success: bool
    agent_type: AgentType
    data: Dict[str, Any]
    message: str
    timestamp: datetime = field(default_factory=datetime.utcnow)
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "success": self.success,
            "agent_type": self.agent_type.value,
            "data": self.data,
            "message": self.message,
            "timestamp": self.timestamp.isoformat(),
            "error": self.error,
        }


class BaseAgent(ABC):
    """
    Abstract base class for AI agents.
    All agents operate on tasks and use the LLM service.
    """

    def __init__(self, llm_service: Optional[LLMService] = None):
        self._llm = llm_service or get_llm_service()

    @property
    @abstractmethod
    def agent_type(self) -> AgentType:
        """Return the type of this agent."""
        pass

    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """Return the system prompt for this agent."""
        pass

    @abstractmethod
    async def execute(self, **kwargs) -> AgentResponse:
        """Execute the agent's main function."""
        pass

    async def _generate(
        self,
        prompt: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Generate LLM response with agent's system prompt."""
        return await self._llm.complete(
            prompt=prompt,
            system_prompt=self.system_prompt,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    async def _chat(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Generate chat response with system prompt prepended."""
        full_messages = [
            {"role": "system", "content": self.system_prompt},
            *messages,
        ]
        return await self._llm.chat(
            messages=full_messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )

    def _format_task(self, task: Dict[str, Any]) -> str:
        """Format a task for inclusion in prompts."""
        parts = [f"- {task.get('title', 'Untitled')}"]
        if task.get("description"):
            parts.append(f"  Description: {task['description']}")
        if task.get("priority"):
            parts.append(f"  Priority: {task['priority']}")
        if task.get("due_date"):
            parts.append(f"  Due: {task['due_date']}")
        if task.get("tags"):
            parts.append(f"  Tags: {', '.join(task['tags'])}")
        return "\n".join(parts)

    def _format_tasks(self, tasks: List[Dict[str, Any]]) -> str:
        """Format multiple tasks for prompts."""
        return "\n\n".join(self._format_task(t) for t in tasks)
