"""
Task repository for data access with user isolation.

Enforces user_id filtering on all database queries to prevent cross-user data access.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select
from app.models.task import Task, PriorityEnum
from app.schemas.task import TaskCreate, TaskUpdate


class TaskRepository:
    """
    Repository for task data access with user isolation.

    All methods require user_id parameter to ensure users can only access their own tasks.
    This enforces security at the data access layer.
    """

    def __init__(self, session: Session):
        """
        Initialize repository with database session.

        Args:
            session: SQLModel database session
        """
        self.session = session

    def get_all_tasks(self, user_id: str) -> List[Task]:
        """
        Get all tasks for a specific user.

        Args:
            user_id: User ID to filter tasks

        Returns:
            List of tasks belonging to the user
        """
        statement = select(Task).where(Task.user_id == UUID(user_id))
        results = self.session.exec(statement)
        return list(results.all())

    def get_task_by_id(self, task_id: str, user_id: str) -> Optional[Task]:
        """
        Get a specific task by ID, ensuring it belongs to the user.

        Args:
            task_id: Task ID
            user_id: User ID to verify ownership

        Returns:
            Task if found and belongs to user, None otherwise
        """
        statement = select(Task).where(
            Task.id == UUID(task_id),
            Task.user_id == UUID(user_id)
        )
        result = self.session.exec(statement)
        return result.first()

    def create_task(self, task_data: TaskCreate, user_id: str) -> Task:
        """
        Create a new task for a user.

        Args:
            task_data: Task creation data
            user_id: User ID who owns the task

        Returns:
            Created task

        Raises:
            ValueError: If validation fails
        """
        # Validate title (additional check beyond Pydantic)
        if not task_data.title or not task_data.title.strip():
            raise ValueError("Title cannot be empty or whitespace-only")

        # Validate priority if provided
        if task_data.priority and task_data.priority not in ["low", "medium", "high"]:
            raise ValueError("Priority must be 'low', 'medium', 'high', or null")

        # Validate tags if provided
        if task_data.tags and not isinstance(task_data.tags, list):
            raise ValueError("Tags must be an array of strings")

        # Create task with user_id
        task = Task(
            title=task_data.title.strip(),  # Strip whitespace
            description=task_data.description,
            priority=task_data.priority,
            due_date=task_data.due_date,
            tags=task_data.tags,
            recurrence_pattern=task_data.recurrence_pattern,
            user_id=UUID(user_id),
        )

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def update_task(
        self, task_id: str, task_data: TaskUpdate, user_id: str
    ) -> Optional[Task]:
        """
        Update a task, ensuring it belongs to the user.

        Args:
            task_id: Task ID to update
            task_data: Updated task data
            user_id: User ID to verify ownership

        Returns:
            Updated task if found and belongs to user, None otherwise
        """
        # Get task with user_id filter
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        # Update only provided fields
        update_data = task_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(task, key, value)

        # Update timestamp
        task.updated_at = datetime.utcnow()

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, task_id: str, user_id: str) -> bool:
        """
        Delete a task, ensuring it belongs to the user.

        Args:
            task_id: Task ID to delete
            user_id: User ID to verify ownership

        Returns:
            True if task was deleted, False if not found or doesn't belong to user
        """
        # Get task with user_id filter
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return False

        self.session.delete(task)
        self.session.commit()
        return True

    def toggle_completion(self, task_id: str, user_id: str) -> Optional[Task]:
        """
        Toggle task completion status, ensuring it belongs to the user.

        Args:
            task_id: Task ID to toggle
            user_id: User ID to verify ownership

        Returns:
            Updated task if found and belongs to user, None otherwise
        """
        # Get task with user_id filter
        task = self.get_task_by_id(task_id, user_id)
        if not task:
            return None

        # Toggle completion
        task.completed = not task.completed
        task.updated_at = datetime.utcnow()

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task
