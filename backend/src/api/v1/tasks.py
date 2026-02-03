"""
Task API endpoints - CRUD operations for tasks.
"""
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlmodel import Session, select, col
from typing import List, Optional
from datetime import datetime
from src.core.database import get_session
from src.api.deps import get_current_user
from src.models.task import Task, PriorityEnum
from src.schemas.task import TaskResponse, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskResponse])
async def list_tasks(
    status: Optional[str] = Query(None, description="Filter by completion status: 'pending' or 'completed'"),
    priority: Optional[PriorityEnum] = Query(None, description="Filter by priority: 'high', 'medium', or 'low'"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    sort: Optional[str] = Query("created_at", description="Sort field: 'created_at', 'due_date', 'priority', or 'title'"),
    order: Optional[str] = Query("desc", description="Sort order: 'asc' or 'desc'"),
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> List[Task]:
    """
    List all tasks for the authenticated user with optional filtering and sorting.

    - **status**: Filter by 'pending' (not completed) or 'completed'
    - **priority**: Filter by 'high', 'medium', or 'low'
    - **tags**: Filter by tags (comma-separated, matches ANY tag)
    - **sort**: Sort by field (created_at, due_date, priority, title)
    - **order**: Sort order (asc or desc)

    Returns list of tasks owned by the authenticated user.
    """
    # Base query: filter by user_id for data isolation
    query = select(Task).where(Task.user_id == current_user_id)

    # Apply filters
    if status is not None:
        if status == "pending":
            query = query.where(Task.completed == False)
        elif status == "completed":
            query = query.where(Task.completed == True)

    if priority is not None:
        query = query.where(Task.priority == priority)

    if tags is not None:
        # Filter tasks that have ANY of the specified tags
        # SQLAlchemy JSONB querying for PostgreSQL
        tag_list = [tag.strip() for tag in tags.split(",")]
        for tag in tag_list:
            # Use overlap operator for JSONB arrays
            query = query.where(col(Task.tags).op("?")(tag))

    # Apply sorting
    sort_field = getattr(Task, sort, Task.created_at)
    if order == "asc":
        query = query.order_by(sort_field.asc())
    else:
        query = query.order_by(sort_field.desc())

    # Execute query
    tasks = session.exec(query).all()

    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> Task:
    """
    Get a single task by ID.

    Verifies ownership: users can only access their own tasks.

    - **task_id**: UUID of the task to retrieve

    Returns:
    - 200: Task details
    - 403: Forbidden if task belongs to another user
    - 404: Not found if task doesn't exist
    """
    # Query task by ID
    task = session.get(Task, task_id)

    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    # Verify ownership
    if str(task.user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    return task


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> Task:
    """
    Create a new task for the authenticated user.

    Automatically assigns the task to the authenticated user (user_id from JWT).

    - **task_data**: Task creation data (title required, other fields optional)

    Returns:
    - 201: Created task with assigned ID and timestamps
    - 400: Bad request if validation fails
    - 401: Unauthorized if JWT is invalid
    """
    # Create Task model instance with user_id from JWT
    new_task = Task(
        user_id=current_user_id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        tags=task_data.tags or [],
        due_date=task_data.due_date,
        recurrence=task_data.recurrence,
    )

    # Save to database
    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    return new_task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> Task:
    """
    Update an existing task.

    Verifies ownership: users can only update their own tasks.
    Only provided fields are updated (partial update).

    - **task_id**: UUID of the task to update
    - **task_data**: Partial task data to update

    Returns:
    - 200: Updated task
    - 400: Bad request if validation fails
    - 401: Unauthorized if JWT is invalid
    - 403: Forbidden if task belongs to another user
    - 404: Not found if task doesn't exist
    """
    # Get task by ID
    task = session.get(Task, task_id)

    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    # Verify ownership
    if str(task.user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)

    # Update timestamp
    task.updated_at = datetime.utcnow()

    # Save to database
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> None:
    """
    Delete a task.

    Verifies ownership: users can only delete their own tasks.

    - **task_id**: UUID of the task to delete

    Returns:
    - 204: No content (task successfully deleted)
    - 401: Unauthorized if JWT is invalid
    - 403: Forbidden if task belongs to another user
    - 404: Not found if task doesn't exist
    """
    # Get task by ID
    task = session.get(Task, task_id)

    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    # Verify ownership
    if str(task.user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    # Delete task
    session.delete(task)
    session.commit()

    return None


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    task_id: str,
    session: Session = Depends(get_session),
    current_user_id: str = Depends(get_current_user),
) -> Task:
    """
    Toggle task completion status.

    Flips the completed field between True and False.
    Verifies ownership: users can only toggle their own tasks.

    - **task_id**: UUID of the task to toggle

    Returns:
    - 200: Updated task with toggled completion status
    - 401: Unauthorized if JWT is invalid
    - 403: Forbidden if task belongs to another user
    - 404: Not found if task doesn't exist
    """
    # Get task by ID
    task = session.get(Task, task_id)

    # Check if task exists
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found"
        )

    # Verify ownership
    if str(task.user_id) != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this task"
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    # Save to database
    session.add(task)
    session.commit()
    session.refresh(task)

    return task
