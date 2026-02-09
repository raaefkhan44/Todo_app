"""
Database connection and session management.

Provides SQLModel engine configuration for Neon PostgreSQL
and session dependency for FastAPI.
"""

from typing import Generator
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy import text
from app.config import settings

# Import models to register them with SQLModel metadata
from app.models.user import User
from app.models.task import Task
from app.models.session import Session as SessionModel


# Create SQLModel engine with Neon PostgreSQL connection
# Connection pool configuration:
# - pool_size=10: Base connection pool size
# - max_overflow=20: Additional connections under load (total 30 max)
# - pool_pre_ping=True: Verify connection health before use
# - pool_recycle=3600: Recycle connections every hour
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Log SQL queries in debug mode
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
)


def create_db_and_tables():
    """
    Create database tables from SQLModel metadata.

    This is called on application startup to ensure all tables exist.
    Uses SQLModel.metadata.create_all() which is idempotent - safe to run multiple times.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    Yields:
        Session: SQLModel database session

    Usage:
        @app.get("/items")
        def get_items(session: Session = Depends(get_session)):
            # Use session here
            pass
    """
    with Session(engine) as session:
        yield session


def validate_connection():
    """
    Validate database connection on startup.

    Attempts to execute a simple query to verify the connection works.

    Raises:
        RuntimeError: If connection fails or DATABASE_URL is invalid
    """
    try:
        with Session(engine) as session:
            # Execute simple query to test connection
            session.exec(text("SELECT 1"))
    except Exception as e:
        raise RuntimeError(
            f"Failed to connect to database. Please check your DATABASE_URL. "
            f"Error: {str(e)}"
        )
