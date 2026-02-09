"""
Task router with all CRUD endpoints.

Provides REST API endpoints for task management with JWT authentication and user isolation.
"""

from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.database import get_session
from app.dependencies.auth import get_current_user
from app.repositories.task import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
import logging

logger = logging.getLogger(__name__)

# Create router with prefix and tags
router = APIRouter(
    prefix="/api/{user_id}/tasks",
    tags=["tasks"],
)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
)
async def create_task(
    task_data: TaskCreate,
    user_id: str,  # Path parameter (ignored - JWT user_id is used)
    authenticated_user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Create a new task for the authenticated user.

    The task is automatically assigned to the user identified by the JWT token,
    regardless of the user_id path parameter.

    Args:
        task_data: Task creation data
        user_id: User ID from path (ignored)
        authenticated_user_id: User ID from JWT token
        session: Database session

    Returns:
        Created task

    Raises:
        400: Invalid task data
        401: Invalid or missing JWT token
    """
    # Use authenticated user_id, ignore path parameter
    repository = TaskRepository(session)
    task = repository.create_task(task_data, authenticated_user_id)
    logger.info(f"Task created: {task.id} for user {authenticated_user_id}")
    return task


@router.get(
    "",
    response_model=List[TaskResponse],
    status_code=status.HTTP_200_OK,
    summary="List all tasks",
)
async def list_tasks(
    user_id: str,  # Path parameter (ignored - JWT user_id is used)
    authenticated_user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Get all tasks for the authenticated user.

    Returns only tasks belonging to the user identified by the JWT token,
    regardless of the user_id path parameter.

    Args:
        user_id: User ID from path (ignored)
        authenticated_user_id: User ID from JWT token
        session: Database session

    Returns:
        List of tasks

    Raises:
        401: Invalid or missing JWT token
    """
    # Use authenticated user_id, ignore path parameter
    repository = TaskRepository(session)
    tasks = repository.get_all_tasks(authenticated_user_id)
    return tasks


@router.get(
    "/{id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a specific task",
)
async def get_task(
    id: str,
    user_id: str,  # Path parameter (ignored - JWT user_id is used)
    authenticated_user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Get a specific task by ID.

    Returns 404 if the task doesn't exist or doesn't belong to the authenticated user.

    Args:
        id: Task ID
        user_id: User ID from path (ignored)
        authenticated_user_id: User ID from JWT token
        session: Database session

    Returns:
        Task details

    Raises:
        401: Invalid or missing JWT token
        404: Task not found or doesn't belong to user
    """
    # Use authenticated user_id, ignore path parameter
    repository = TaskRepository(session)
    task = repository.get_task_by_id(id, authenticated_user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.put(
    "/{id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a task",
)
async def update_task(
    id: str,
    task_data: TaskUpdate,
    user_id: str,  # Path parameter (ignored - JWT user_id is used)
    authenticated_user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Update an existing task.

    All fields in the request body are optional for partial updates.
    Returns 404 if the task doesn't exist or doesn't belong to the authenticated user.

    Args:
        id: Task ID
        task_data: Updated task data
        user_id: User ID from path (ignored)
        authenticated_user_id: User ID from JWT token
        session: Database session

    Returns:
        Updated task

    Raises:
        400: Invalid task data
        401: Invalid or missing JWT token
        404: Task not found or doesn't belong to user
    """
    # Use authenticated user_id, ignore path parameter
    repository = TaskRepository(session)
    task = repository.update_task(id, task_data, authenticated_user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a task",
)
async def delete_task(
    id: str,
    user_id: str,  # Path parameter (ignored - JWT user_id is used)
    authenticated_user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Delete a task permanently.

    Returns 404 if the task doesn't exist or doesn't belong to the authenticated user.

    Args:
        id: Task ID
        user_id: User ID from path (ignored)
        authenticated_user_id: User ID from JWT token
        session: Database session

    Raises:
        401: Invalid or missing JWT token
        404: Task not found or doesn't belong to user
    """
    # Use authenticated user_id, ignore path parameter
    repository = TaskRepository(session)
    deleted = repository.delete_task(id, authenticated_user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Return 204 No Content (no response body)
    return None


@router.patch(
    "/{id}/complete",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    summary="Toggle task completion",
)
async def toggle_task_completion(
    id: str,
    user_id: str,  # Path parameter (ignored - JWT user_id is used)
    authenticated_user_id: Annotated[str, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
):
    """
    Toggle task completion status (completed: true ↔ false).

    Returns 404 if the task doesn't exist or doesn't belong to the authenticated user.

    Args:
        id: Task ID
        user_id: User ID from path (ignored)
        authenticated_user_id: User ID from JWT token
        session: Database session

    Returns:
        Updated task with toggled completion status

    Raises:
        401: Invalid or missing JWT token
        404: Task not found or doesn't belong to user
    """
    # Use authenticated user_id, ignore path parameter
    repository = TaskRepository(session)
    task = repository.toggle_completion(id, authenticated_user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task
