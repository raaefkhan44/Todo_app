"""
Authentication dependency for FastAPI.

Provides dependency that extracts and verifies JWT tokens from requests.
"""

from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_jwt_token, extract_user_id


# HTTP Bearer token scheme for extracting Authorization header
security = HTTPBearer()


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
) -> str:
    """
    FastAPI dependency that extracts and verifies JWT token.

    Extracts JWT token from Authorization header, verifies it,
    and returns the authenticated user_id.

    Args:
        credentials: HTTP Bearer credentials from Authorization header

    Returns:
        User ID string extracted from valid JWT token

    Raises:
        HTTPException: 401 Unauthorized if token is missing, invalid, or expired

    Usage:
        @app.get("/protected")
        def protected_route(user_id: str = Depends(get_current_user)):
            # user_id is the authenticated user's ID
            pass
    """
    # Extract token from credentials
    token = credentials.credentials

    # Verify token and get payload
    payload = verify_jwt_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract user_id from payload
    user_id = extract_user_id(payload)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not extract user ID from token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id
