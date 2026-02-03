---
description: Create and run tests for AI agents in the todo app
handoffs:
  - label: Fix Issues
    agent: sp.implement
    prompt: Fix the failing agent tests
    send: true
---

# COMMAND: Agent Testing Workflow

## CONTEXT

Use this skill when you need to test AI agents. This workflow covers:
- Unit tests for agent logic
- Integration tests for LLM interactions
- Mock/stub patterns for LLM responses
- Performance and rate limit testing

**User's input to record:**
$ARGUMENTS

## YOUR ROLE

You are an expert QA engineer specializing in:
- Testing AI/ML systems
- LLM response mocking
- Async Python testing
- FastAPI endpoint testing

## OUTLINE

### Step 1: Test Planning

1. Identify test scenarios for the agent
2. Define expected inputs and outputs
3. Plan edge cases and error scenarios
4. Determine mock requirements

### Step 2: Unit Test Creation

Create tests for:
```python
# Test file: backend/tests/agents/test_<agent_name>.py

import pytest
from unittest.mock import AsyncMock, patch
from src.agents.<agent_name> import <AgentClass>

@pytest.mark.asyncio
async def test_agent_success():
    """Test agent with valid input."""
    pass

@pytest.mark.asyncio
async def test_agent_empty_input():
    """Test agent with empty input."""
    pass

@pytest.mark.asyncio
async def test_agent_llm_failure():
    """Test agent when LLM fails."""
    pass
```

### Step 3: Integration Test Creation

Create API endpoint tests:
```python
# Test file: backend/tests/api/test_agents.py

from fastapi.testclient import TestClient
from src.main import app

def test_agent_endpoint():
    """Test agent API endpoint."""
    pass
```

### Step 4: Mock LLM Responses

Pattern for mocking Groq/Ollama:
```python
@patch('src.services.llm_service.LLMService.complete')
async def test_with_mock(mock_complete):
    mock_complete.return_value = '{"priority": "high", "reason": "Test"}'
    # Test logic
```

### Step 5: Run Tests

```bash
cd backend
pytest tests/agents/ -v --cov=src/agents
pytest tests/api/test_agents.py -v
```

## OUTPUT FORMAT

Generate:
1. Test files in `backend/tests/agents/`
2. Test fixtures in `backend/tests/conftest.py`
3. Test documentation in `specs/<feature>/test-plan.md`

## KEY RULES

- Always mock LLM calls in unit tests
- Test with both success and failure scenarios
- Verify user_id filtering in API tests
- Check rate limiting behavior
- Test timeout handling

---

## PHR Creation

After completing this workflow:
- Stage: `red` or `green`
- Route: `history/prompts/<feature-name>/`
- Record test results and coverage metrics
