"""
Session database model.

Represents authentication sessions for Better Auth integration.
"""

from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel


class Session(SQLModel, table=True):
    """
    Session model for tracking authentication sessions.

    Sessions are validated indirectly through JWT tokens.
    The backend remains stateless - this table is for Better Auth's internal tracking.
    """

    __tablename__ = "sessions"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
