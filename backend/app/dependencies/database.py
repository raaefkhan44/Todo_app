"""
Database session dependency.

Provides database session for FastAPI dependency injection.
"""

from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from app.database import get_session

# Type alias for database session dependency
DatabaseSession = Annotated[Session, Depends(get_session)]
