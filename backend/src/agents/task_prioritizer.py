"""
Task Prioritizer Agent - AI-powered task priority suggestions.
Analyzes tasks and suggests optimal priority ordering.
"""
import json
import re
from typing import Any, Dict, List, Optional

from .base_agent import BaseAgent, AgentType, AgentResponse


class TaskPrioritizerAgent(BaseAgent):
    """
    Agent that analyzes tasks and suggests priority assignments.
    Uses LLM to understand task context and urgency.
    """

    @property
    def agent_type(self) -> AgentType:
        return AgentType.PRIORITIZER

    @property
    def system_prompt(self) -> str:
        return """You are an expert task prioritization assistant. Your job is to analyze tasks and assign appropriate priorities based on:

1. **Urgency**: Due dates, deadlines, time-sensitivity
2. **Importance**: Impact on goals, dependencies, consequences of not completing
3. **Effort**: Estimated time and complexity
4. **Context**: Tags, descriptions, relationships to other tasks

Priority levels:
- **high**: Critical tasks that need immediate attention
- **medium**: Important tasks that should be done soon
- **low**: Tasks that can wait or are nice-to-have

Always respond with valid JSON containing your priority recommendations."""

    async def execute(
        self,
        tasks: List[Dict[str, Any]],
        user_context: Optional[str] = None,
    ) -> AgentResponse:
        """
        Analyze tasks and suggest priorities.

        Args:
            tasks: List of task dictionaries with id, title, description, etc.
            user_context: Optional context about user's situation/goals

        Returns:
            AgentResponse with priority recommendations
        """
        if not tasks:
            return AgentResponse(
                success=True,
                agent_type=self.agent_type,
                data={"priorities": []},
                message="No tasks to prioritize.",
            )

        # Build prompt
        prompt = self._build_prompt(tasks, user_context)

        try:
            # Get LLM response
            response = await self._generate(prompt, temperature=0.3, max_tokens=1024)

            # Parse priorities from response
            priorities = self._parse_response(response, tasks)

            return AgentResponse(
                success=True,
                agent_type=self.agent_type,
                data={"priorities": priorities, "raw_response": response},
                message=f"Successfully analyzed {len(tasks)} tasks.",
            )

        except Exception as e:
            return AgentResponse(
                success=False,
                agent_type=self.agent_type,
                data={},
                message="Failed to prioritize tasks.",
                error=str(e),
            )

    def _build_prompt(
        self,
        tasks: List[Dict[str, Any]],
        user_context: Optional[str],
    ) -> str:
        """Build the prioritization prompt."""
        prompt_parts = ["Please analyze these tasks and assign priorities:\n"]

        for i, task in enumerate(tasks, 1):
            prompt_parts.append(f"\n{i}. Task ID: {task.get('id', 'unknown')}")
            prompt_parts.append(f"   Title: {task.get('title', 'Untitled')}")
            if task.get("description"):
                prompt_parts.append(f"   Description: {task['description']}")
            if task.get("due_date"):
                prompt_parts.append(f"   Due Date: {task['due_date']}")
            if task.get("tags"):
                prompt_parts.append(f"   Tags: {', '.join(task['tags'])}")
            if task.get("priority"):
                prompt_parts.append(f"   Current Priority: {task['priority']}")

        if user_context:
            prompt_parts.append(f"\nUser Context: {user_context}")

        prompt_parts.append("""

Respond with a JSON array of objects, each containing:
- "task_id": the task ID
- "priority": "high", "medium", or "low"
- "reason": brief explanation (1-2 sentences)

Example response:
[
  {"task_id": "abc123", "priority": "high", "reason": "Due tomorrow and blocks other work."},
  {"task_id": "def456", "priority": "medium", "reason": "Important but no urgent deadline."}
]""")

        return "\n".join(prompt_parts)

    def _parse_response(
        self,
        response: str,
        tasks: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        """Parse LLM response into priority recommendations."""
        # Try to extract JSON from response
        try:
            # Look for JSON array in response
            json_match = re.search(r'\[[\s\S]*\]', response)
            if json_match:
                priorities = json.loads(json_match.group())
                return priorities
        except json.JSONDecodeError:
            pass

        # Fallback: return tasks with default medium priority
        return [
            {"task_id": t.get("id"), "priority": "medium", "reason": "Could not parse AI response"}
            for t in tasks
        ]
