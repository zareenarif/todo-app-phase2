"""
Task Decomposer Agent - AI-powered task breakdown.
Breaks complex tasks into actionable subtasks.
"""
import json
import re
from typing import Any, Dict, List, Optional

from .base_agent import BaseAgent, AgentType, AgentResponse


class TaskDecomposerAgent(BaseAgent):
    """
    Agent that breaks down complex tasks into smaller subtasks.
    Uses LLM to understand task scope and generate actionable steps.
    """

    @property
    def agent_type(self) -> AgentType:
        return AgentType.DECOMPOSER

    @property
    def system_prompt(self) -> str:
        return """You are an expert task decomposition assistant. Your job is to break down complex tasks into smaller, actionable subtasks.

Guidelines for decomposition:
1. **Actionable**: Each subtask should be a concrete action that can be completed
2. **Specific**: Subtasks should be clear and unambiguous
3. **Appropriately sized**: Not too large (should take minutes to hours, not days)
4. **Ordered**: List subtasks in logical execution order when applicable
5. **Complete**: Cover all aspects needed to complete the parent task

For each subtask, provide:
- A clear title (action-oriented, starts with a verb)
- A brief description if needed
- Suggested priority (high/medium/low)
- Estimated effort (small/medium/large)

Always respond with valid JSON containing the subtasks."""

    async def execute(
        self,
        task: Dict[str, Any],
        max_subtasks: int = 10,
        detail_level: str = "medium",
    ) -> AgentResponse:
        """
        Break down a task into subtasks.

        Args:
            task: Task dictionary with title, description, etc.
            max_subtasks: Maximum number of subtasks to generate
            detail_level: "brief", "medium", or "detailed"

        Returns:
            AgentResponse with subtask recommendations
        """
        if not task or not task.get("title"):
            return AgentResponse(
                success=False,
                agent_type=self.agent_type,
                data={},
                message="Task title is required.",
                error="Missing task title",
            )

        # Build prompt
        prompt = self._build_prompt(task, max_subtasks, detail_level)

        try:
            # Get LLM response
            response = await self._generate(prompt, temperature=0.5, max_tokens=1500)

            # Parse subtasks from response
            subtasks = self._parse_response(response)

            return AgentResponse(
                success=True,
                agent_type=self.agent_type,
                data={
                    "parent_task_id": task.get("id"),
                    "subtasks": subtasks,
                    "raw_response": response,
                },
                message=f"Generated {len(subtasks)} subtasks.",
            )

        except Exception as e:
            return AgentResponse(
                success=False,
                agent_type=self.agent_type,
                data={},
                message="Failed to decompose task.",
                error=str(e),
            )

    def _build_prompt(
        self,
        task: Dict[str, Any],
        max_subtasks: int,
        detail_level: str,
    ) -> str:
        """Build the decomposition prompt."""
        detail_instruction = {
            "brief": "Keep subtasks concise and high-level.",
            "medium": "Provide moderate detail for each subtask.",
            "detailed": "Include comprehensive details and descriptions.",
        }.get(detail_level, "Provide moderate detail for each subtask.")

        prompt = f"""Please break down this task into actionable subtasks:

**Task Title**: {task.get('title', 'Untitled')}
"""

        if task.get("description"):
            prompt += f"**Description**: {task['description']}\n"

        if task.get("tags"):
            prompt += f"**Tags**: {', '.join(task['tags'])}\n"

        if task.get("due_date"):
            prompt += f"**Due Date**: {task['due_date']}\n"

        prompt += f"""
**Instructions**:
- Generate up to {max_subtasks} subtasks
- {detail_instruction}
- List them in logical execution order

Respond with a JSON array of subtask objects:
```json
[
  {{
    "title": "Action-oriented title",
    "description": "Brief description (optional)",
    "priority": "high|medium|low",
    "effort": "small|medium|large"
  }}
]
```

Generate the subtasks now:"""

        return prompt

    def _parse_response(self, response: str) -> List[Dict[str, Any]]:
        """Parse LLM response into subtask list."""
        try:
            # Look for JSON array in response
            json_match = re.search(r'\[[\s\S]*?\]', response)
            if json_match:
                subtasks = json.loads(json_match.group())
                # Validate and normalize subtasks
                normalized = []
                for st in subtasks:
                    if isinstance(st, dict) and st.get("title"):
                        normalized.append({
                            "title": st.get("title", ""),
                            "description": st.get("description", ""),
                            "priority": st.get("priority", "medium"),
                            "effort": st.get("effort", "medium"),
                        })
                return normalized
        except json.JSONDecodeError:
            pass

        # Fallback: try to extract bullet points
        lines = response.split("\n")
        subtasks = []
        for line in lines:
            line = line.strip()
            if line.startswith(("-", "*", "•")) or re.match(r"^\d+\.", line):
                # Clean up the line
                title = re.sub(r"^[-*•\d.]+\s*", "", line)
                if title:
                    subtasks.append({
                        "title": title,
                        "description": "",
                        "priority": "medium",
                        "effort": "medium",
                    })

        return subtasks[:10]  # Limit to 10
