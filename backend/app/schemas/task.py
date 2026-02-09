"""
Task request and response schemas.

Pydantic models for API request validation and response serialization.
"""

from datetime import date, datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, field_validator
from app.models.task import PriorityEnum


class TaskCreate(BaseModel):
    """
    Schema for creating a new task.

    All fields except title are optional.
    """

    title: str = Field(min_length=1, max_length=255, description="Task title (required)")
    description: Optional[str] = Field(default=None, max_length=2000, description="Task description")
    priority: Optional[PriorityEnum] = Field(default=None, description="Task priority: low, medium, or high")
    due_date: Optional[date] = Field(default=None, description="Due date in ISO 8601 format (YYYY-MM-DD)")
    tags: List[str] = Field(default_factory=list, description="Array of tag strings")
    recurrence_pattern: Optional[str] = Field(default=None, max_length=255, description="Recurrence pattern")

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        """Validate that title is not empty or whitespace-only."""
        if not v or not v.strip():
            raise ValueError("Title cannot be empty or whitespace-only")
        return v.strip()


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.

    All fields are optional for partial updates.
    """

    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: Optional[bool] = Field(default=None)
    priority: Optional[PriorityEnum] = Field(default=None)
    due_date: Optional[date] = Field(default=None)
    tags: Optional[List[str]] = Field(default=None)
    recurrence_pattern: Optional[str] = Field(default=None, max_length=255)

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        """Validate that title is not empty or whitespace-only if provided."""
        if v is not None and (not v or not v.strip()):
            raise ValueError("Title cannot be empty or whitespace-only")
        return v.strip() if v else None


class TaskResponse(BaseModel):
    """
    Schema for task API responses.

    Matches the Task database model.
    """

    id: UUID
    title: str
    description: Optional[str]
    completed: bool
    priority: Optional[PriorityEnum]
    due_date: Optional[date]
    tags: List[str]
    recurrence_pattern: Optional[str]
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enable ORM mode for SQLModel compatibility
