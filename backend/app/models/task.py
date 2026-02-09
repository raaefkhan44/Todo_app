"""
Task database model.

Represents todo items that belong to users.
"""

from datetime import datetime, date
from enum import Enum
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Column
from sqlalchemy import ARRAY, String


class PriorityEnum(str, Enum):
    """Task priority levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(SQLModel, table=True):
    """
    Task model for storing todo items.

    Each task belongs to exactly one user and can only be accessed by that user.
    User isolation is enforced at the repository layer.
    """

    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(max_length=255, min_length=1)
    description: Optional[str] = Field(default=None, max_length=2000)
    completed: bool = Field(default=False)
    priority: Optional[PriorityEnum] = Field(default=None)
    due_date: Optional[date] = Field(default=None)
    tags: List[str] = Field(default_factory=list, sa_column=Column(ARRAY(String)))
    recurrence_pattern: Optional[str] = Field(default=None, max_length=255)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
