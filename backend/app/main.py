"""
FastAPI application entry point.

Main application setup with middleware, exception handlers, and startup events.
"""

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from jose import JWTError
from app.config import settings
from app.database import create_db_and_tables, validate_connection
from app.core import exceptions
from app.routers import tasks
import logging

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title="Todo Application Backend API",
    description="REST API for Todo application with JWT authentication and user isolation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
app.add_exception_handler(Exception, exceptions.generic_exception_handler)
app.add_exception_handler(RequestValidationError, exceptions.validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, exceptions.sqlalchemy_exception_handler)
app.add_exception_handler(JWTError, exceptions.jwt_exception_handler)

# Register routers
app.include_router(tasks.router)


@app.on_event("startup")
async def startup_event():
    """
    Application startup event.

    Validates database connection and creates tables if they don't exist.
    """
    logger.info("Starting up application...")

    try:
        # Validate database connection
        logger.info("Validating database connection...")
        validate_connection()
        logger.info("Database connection validated successfully")

        # Create tables
        logger.info("Creating database tables...")
        create_db_and_tables()
        logger.info("Database tables created successfully")

        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Health status
    """
    return {"status": "healthy"}


@app.get("/", status_code=status.HTTP_200_OK)
async def root():
    """
    Root endpoint.

    Returns:
        dict: Welcome message with API documentation links
    """
    return {
        "message": "Todo Application Backend API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
    }
