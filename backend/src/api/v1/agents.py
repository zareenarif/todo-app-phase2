"""
Agent API endpoints - AI-powered task management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime
import time

from src.core.database import get_session
from src.api.deps import get_current_user
from src.models.task import Task
from src.models.agent import AgentLog, AgentMessage, AgentTypeEnum, AgentStatusEnum
from src.schemas.agent import (
    PrioritizeRequest,
    PrioritizeResponse,
    PriorityRecommendation,
    DecomposeRequest,
    DecomposeResponse,
    SubtaskRecommendation,
    ChatRequest,
    ChatResponse,
    AgentLogResponse,
    HealthCheckResponse,
)
from src.agents import TaskPrioritizerAgent, TaskDecomposerAgent
from src.services.llm_service import get_llm_service

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/prioritize", response_model=PrioritizeResponse)
async def prioritize_tasks(
    request: PrioritizeRequest,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> PrioritizeResponse:
    """
    Use AI to analyze and suggest task priorities.

    - **task_ids**: List of task IDs to prioritize
    - **context**: Optional context about user's goals/situation

    Returns priority recommendations for each task.
    """
    start_time = time.time()

    # Fetch tasks
    tasks = []
    for task_id in request.task_ids:
        task = session.get(Task, task_id)
        if task and str(task.user_id) == current_user_id:
            tasks.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority.value if task.priority else None,
                "tags": task.tags,
                "due_date": str(task.due_date) if task.due_date else None,
            })

    if not tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No valid tasks found for prioritization"
        )

    # Execute agent
    agent = TaskPrioritizerAgent()
    result = await agent.execute(tasks=tasks, user_context=request.context)

    # Calculate execution time
    execution_time = int((time.time() - start_time) * 1000)

    # Log the execution
    log_entry = AgentLog(
        user_id=current_user_id,
        agent_type=AgentTypeEnum.PRIORITIZER,
        input_data={"task_ids": request.task_ids, "context": request.context},
        output_data=result.data,
        status=AgentStatusEnum.COMPLETED if result.success else AgentStatusEnum.FAILED,
        error_message=result.error,
        execution_time_ms=execution_time,
    )
    session.add(log_entry)
    session.commit()

    # Format response
    priorities = [
        PriorityRecommendation(
            task_id=p.get("task_id", ""),
            priority=p.get("priority", "medium"),
            reason=p.get("reason", ""),
        )
        for p in result.data.get("priorities", [])
    ]

    return PrioritizeResponse(
        success=result.success,
        priorities=priorities,
        message=result.message,
    )


@router.post("/decompose", response_model=DecomposeResponse)
async def decompose_task(
    request: DecomposeRequest,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> DecomposeResponse:
    """
    Use AI to break down a task into subtasks.

    - **task_id**: ID of the task to decompose
    - **max_subtasks**: Maximum number of subtasks (1-20)
    - **detail_level**: brief, medium, or detailed

    Returns list of suggested subtasks.
    """
    start_time = time.time()

    # Fetch task
    task = session.get(Task, request.task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {request.task_id} not found"
        )

    # Verify ownership
    if str(task.user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    # Prepare task data
    task_data = {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "tags": task.tags,
        "due_date": str(task.due_date) if task.due_date else None,
    }

    # Execute agent
    agent = TaskDecomposerAgent()
    result = await agent.execute(
        task=task_data,
        max_subtasks=request.max_subtasks,
        detail_level=request.detail_level,
    )

    # Calculate execution time
    execution_time = int((time.time() - start_time) * 1000)

    # Log the execution
    log_entry = AgentLog(
        user_id=current_user_id,
        agent_type=AgentTypeEnum.DECOMPOSER,
        input_data={"task_id": request.task_id, "max_subtasks": request.max_subtasks},
        output_data=result.data,
        status=AgentStatusEnum.COMPLETED if result.success else AgentStatusEnum.FAILED,
        error_message=result.error,
        execution_time_ms=execution_time,
    )
    session.add(log_entry)
    session.commit()

    # Format response
    subtasks = [
        SubtaskRecommendation(
            title=st.get("title", ""),
            description=st.get("description", ""),
            priority=st.get("priority", "medium"),
            effort=st.get("effort", "medium"),
        )
        for st in result.data.get("subtasks", [])
    ]

    return DecomposeResponse(
        success=result.success,
        parent_task_id=request.task_id,
        subtasks=subtasks,
        message=result.message,
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> ChatResponse:
    """
    Chat with an AI agent about tasks.

    - **message**: User's message
    - **agent_type**: Type of agent to use

    Returns agent's response.
    """
    start_time = time.time()

    # Get user's tasks for context
    query = select(Task).where(Task.user_id == current_user_id).limit(20)
    tasks = session.exec(query).all()

    task_context = "\n".join([
        f"- {t.title} (priority: {t.priority.value if t.priority else 'none'}, "
        f"completed: {t.completed}, due: {t.due_date or 'none'})"
        for t in tasks
    ])

    # Build messages
    system_prompt = f"""You are a helpful AI task management assistant. You help users manage their todo list.

User's current tasks:
{task_context}

Be helpful, concise, and actionable in your responses. If the user asks about prioritization, suggest specific tasks to focus on. If they ask about breaking down tasks, provide concrete subtasks."""

    llm = get_llm_service()
    try:
        response = await llm.complete(
            prompt=request.message,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=500,
        )

        # Save user message
        user_msg = AgentMessage(
            user_id=current_user_id,
            role="user",
            content=request.message,
            agent_type=AgentTypeEnum.CHAT,
        )
        session.add(user_msg)

        # Save assistant message
        assistant_msg = AgentMessage(
            user_id=current_user_id,
            role="assistant",
            content=response,
            agent_type=AgentTypeEnum.CHAT,
        )
        session.add(assistant_msg)

        # Log the execution
        execution_time = int((time.time() - start_time) * 1000)
        log_entry = AgentLog(
            user_id=current_user_id,
            agent_type=AgentTypeEnum.CHAT,
            input_data={"message": request.message},
            output_data={"response": response},
            status=AgentStatusEnum.COMPLETED,
            execution_time_ms=execution_time,
        )
        session.add(log_entry)
        session.commit()

        return ChatResponse(
            success=True,
            message=response,
            agent_type=request.agent_type,
        )

    except Exception as e:
        return ChatResponse(
            success=False,
            message=f"Failed to get response: {str(e)}",
            agent_type=request.agent_type,
        )


@router.get("/logs", response_model=List[AgentLogResponse])
async def get_agent_logs(
    limit: int = 20,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> List[AgentLogResponse]:
    """
    Get recent agent execution logs.

    - **limit**: Maximum number of logs to return (default: 20)

    Returns list of recent agent interactions.
    """
    query = (
        select(AgentLog)
        .where(AgentLog.user_id == current_user_id)
        .order_by(AgentLog.created_at.desc())
        .limit(limit)
    )
    logs = session.exec(query).all()

    return [
        AgentLogResponse(
            id=log.id,
            agent_type=log.agent_type.value,
            status=log.status.value,
            input_summary=str(log.input_data)[:100],
            output_summary=str(log.output_data)[:100],
            execution_time_ms=log.execution_time_ms,
            created_at=log.created_at,
        )
        for log in logs
    ]


@router.get("/health", response_model=HealthCheckResponse)
async def check_llm_health() -> HealthCheckResponse:
    """
    Check LLM provider health status.

    Returns status of primary and fallback LLM providers.
    """
    llm = get_llm_service()
    results = await llm.health_check()
    return HealthCheckResponse(
        primary=results.get("primary", {}),
        fallback=results.get("fallback", {}),
    )
