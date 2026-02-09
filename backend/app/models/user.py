"""
User database model.

Represents authenticated users in the system.
"""

from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """
    User model for storing user account information.

    Users own tasks and are authenticated via JWT tokens issued by Better Auth.
    Passwords are hashed by Better Auth on the frontend.
    """

    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(max_length=255, unique=True, index=True)
    email: str = Field(max_length=255, unique=True, index=True)
    password: str = Field(max_length=255)  # Hashed password
    created_at: datetime = Field(default_factory=datetime.utcnow)
