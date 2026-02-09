"""
Custom exception handlers for FastAPI.

Provides production-safe error handling that doesn't expose sensitive information.
"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from jose import JWTError
import logging

logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handler for HTTPException.

    Preserves the status code and detail from the exception.
    """
    from fastapi import HTTPException

    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=exc.headers,
        )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    Handler for Pydantic validation errors.

    Returns 400 Bad Request with detailed validation error information.
    """
    logger.warning(f"Validation error: {exc.errors()}")

    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.errors()},
    )


async def sqlalchemy_exception_handler(
    request: Request, exc: SQLAlchemyError
) -> JSONResponse:
    """
    Handler for SQLAlchemy database errors.

    Returns 500 Internal Server Error without exposing database details.
    Logs the full error for debugging.
    """
    logger.error(f"Database error: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )


async def jwt_exception_handler(request: Request, exc: JWTError) -> JSONResponse:
    """
    Handler for JWT verification errors.

    Returns 401 Unauthorized for invalid tokens.
    """
    logger.warning(f"JWT error: {exc}")

    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Could not validate credentials"},
        headers={"WWW-Authenticate": "Bearer"},
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Catch-all handler for unexpected exceptions.

    Returns 500 Internal Server Error without exposing error details.
    Logs the full error for debugging.

    Special handling for ValueError from repository validation.
    """
    # Handle ValueError from repository validation as 400 Bad Request
    if isinstance(exc, ValueError):
        logger.warning(f"Validation error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": str(exc)},
        )

    logger.error(f"Unexpected error: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )
