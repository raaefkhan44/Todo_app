"""
JWT verification and security utilities.

Provides functions for verifying JWT tokens issued by Better Auth
and extracting user identity from tokens.
"""

from typing import Optional
from jose import JWTError, jwt
from app.config import settings


def verify_jwt_token(token: str) -> Optional[dict]:
    """
    Verify JWT token and extract payload.

    Args:
        token: JWT token string

    Returns:
        Token payload dict if valid, None if invalid

    The function verifies:
    - Token signature using BETTER_AUTH_SECRET
    - Token expiration (exp claim)
    - Token format

    Expected token payload:
    {
        "sub": "user_id",  # User identifier
        "exp": 1234567890,  # Expiration timestamp
        "iat": 1234567890   # Issued at timestamp
    }
    """
    try:
        # Decode and verify JWT token
        # - Verifies signature using BETTER_AUTH_SECRET
        # - Verifies expiration automatically
        # - Raises JWTError if invalid
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        # Token is invalid (expired, wrong signature, malformed, etc.)
        return None


def extract_user_id(token_payload: dict) -> Optional[str]:
    """
    Extract user_id from JWT token payload.

    Args:
        token_payload: Decoded JWT payload

    Returns:
        User ID string if present, None otherwise

    Checks for user_id in standard JWT claims:
    1. 'sub' (subject) - standard JWT claim for user identifier
    2. 'user_id' - fallback if Better Auth uses custom claim
    3. 'id' - second fallback
    """
    # Try standard 'sub' claim first (most common)
    user_id = token_payload.get("sub")
    if user_id:
        return str(user_id)

    # Fallback to custom claims
    user_id = token_payload.get("user_id") or token_payload.get("id")
    if user_id:
        return str(user_id)

    return None
